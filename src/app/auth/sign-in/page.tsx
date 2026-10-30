'use client';
import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';
import GlassCard from '@/components/shared/GlassCard';

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('error') === 'oauth_failed') {
      toast.error('Google sign-in failed. Please try again.');
    }
  }, [searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      router.push('/en/dashboard/forge');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback?next=/en/dashboard/forge`,
        },
    });
    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-void p-6">
        <Toaster theme="dark" />
        <GlassCard className="p-8 w-full max-w-sm">
            <h1 className="text-2xl font-serif mb-8 text-center text-text-primary">Sign In to PromptForge</h1>

            <div className="flex flex-col gap-3">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white/5 hover:bg-white/10 text-text-primary p-3 rounded-xl border border-glass-border transition-colors font-medium text-sm"
                >
                    Sign In with Google
                </button>
            </div>

            <div className="my-8 flex items-center gap-3">
                <hr className="flex-1 border-glass-border" />
                <span className="text-text-muted text-xs uppercase">or</span>
                <hr className="flex-1 border-glass-border" />
            </div>

            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 rounded-xl bg-deep border border-glass-border text-sm focus:border-glow focus:outline-none transition-all"
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 rounded-xl bg-deep border border-glass-border text-sm focus:border-glow focus:outline-none transition-all"
                    onChange={e => setPassword(e.target.value)}
                />
                <button
                    className="w-full bg-glow hover:bg-glow/90 text-white p-3 rounded-xl font-medium text-sm transition-all shadow-lg shadow-glow/10"
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-text-muted">
                Don't have an account?{' '}
                <Link href="/auth/sign-up" className="text-glow hover:underline">
                    Sign Up
                </Link>
            </div>
        </GlassCard>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}