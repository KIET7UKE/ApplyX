'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'done'>('loading');
  const [token, setToken] = useState('');

  useEffect(() => {
    const handle = async (session: any) => {
      if (!session) return;
      const tok = session.access_token;
      setToken(tok);
      setStatus('done');

      // Send token to extension if opened by it
      try { window.opener?.postMessage({ type: 'APPLYX_TOKEN', token: tok }, '*'); } catch {}

      // Auto close after 2s if opened by extension, else go to dashboard
      setTimeout(() => {
        try { window.close(); } catch {}
        router.replace('/dashboard');
      }, 2000);
    };

    // Check existing session (handles page refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) handle(session);
    });

    // Listen for new sign in (handles OAuth redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) handle(session);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (status === 'done') return (
    <div className="flex min-h-screen items-center justify-center flex-col gap-4 text-center px-4">
      <CheckCircle2 className="h-12 w-12 text-green-600" />
      <p className="font-bold text-xl">Signed in successfully!</p>
      <p className="text-muted-foreground text-sm">
        You can close this tab and return to LinkedIn.
      </p>
      {token && (
        <div className="mt-4 p-4 bg-muted rounded-lg max-w-sm w-full">
          <p className="text-xs text-muted-foreground mb-2">
            If the extension didn't update, paste this token manually in the extension Config screen:
          </p>
          <div className="flex gap-2">
            <input readOnly value={token} className="flex-1 text-xs p-2 border rounded font-mono bg-background" />
            <button onClick={() => navigator.clipboard.writeText(token)} className="px-3 py-2 bg-primary text-primary-foreground rounded text-xs font-bold">
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center flex-col gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium">Signing you in...</p>
    </div>
  );
}
