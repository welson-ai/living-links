'use client'

import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react';
import { Check, Link2, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'

type LinkRow = { amount: number; description: string; rule: string; status: string }

export default function PayPage({ params }: { params: Promise<{ token: string }> }) {
  const [link, setLink] = useState<LinkRow | null>(null)
  const [token, setToken] = useState('')
  const [phone, setPhone] = useState('')

  async function handleConfirm() {
    if (!phone) { alert('Please enter your phone number'); return; }

    const uniqueOrderRef = `${token}-${Math.random().toString(36).substring(7)}`;

    const res = await fetch('/api/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, amount: link?.amount, orderRef: uniqueOrderRef }),
    });

    const data = await res.json();

    // Only update to 'Held' via the button click, not automatically
    if (data.statusCode === 200) {
      toast.success('Payment initiated! Now depositing to Escrow...');

      const { error } = await supabase
        .from('living_links')
        .update({ status: 'Held' })
        .eq('token', token);

      if (!error) {
        setLink(prev => prev ? {...prev, status: 'Held'} : null);
        toast.success('Payment successfully deposited to Escrow!');
      }
    } else {
      toast.error(`Failed: ${data.message || 'Payment initiation failed'}`);
    }
  }

  // Ensure setSelected exists if you are managing the modal state locally in PayPage
  // However, based on the previous files, setSelected is likely defined in PaymentDashboard.
  // In PayPage, we can just clear the status if needed, but since it's a page,
  // navigating back to dashboard might be the desired "close" effect.
  async function handleRelease() {
    const { error } = await supabase
      .from('living_links')
      .update({ status: 'Released' })
      .eq('token', token);

    if (!error) {
      setLink(prev => prev ? {...prev, status: 'Released'} : null);
      toast.success('Funds released to Merchant!');
    }
  }
  // This function ensures the status is reset if it's currently 'Held' when the page loads
  // ONLY if you want it to always be 'pending' on load.
  // I have commented out the auto-reset to avoid overwriting your database.
  useEffect(() => {
    void params.then(({ token: nextToken }) => {
      setToken(nextToken);
      void supabase
        .from('living_links')
        .select('amount,description,rule,status')
        .eq('token', nextToken)
        .single()
        .then(async ({ data }) => {
          if (data) {
            // If the status was already Held from a previous test,
            // you might want to reset it here if you want a fresh demo each time.
            // await supabase.from('living_links').update({ status: 'pending' }).eq('token', nextToken);
            setLink({ ...data, status: 'pending' } as LinkRow);
          }
        });
    });
  }, [params]);
  // Removed automatic polling
  /*
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      supabase.from('living_links')
        .select('status')
        .eq('token', token)
        .single()
        .then(({ data }) => {
          if (data?.status === 'Held') setLink(prev => prev ? {...prev, status: 'Held'} : null);
        });
    }, 2000);
    return () => clearInterval(interval);
  }, [token]);
  */

  return <main className="min-h-screen bg-background px-5 py-8 text-foreground"><div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-between"><header className="flex items-center gap-2.5"><div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Link2 className="size-4" /></div><span className="font-semibold tracking-tight">Chequeout</span></header><section className="rounded-3xl border border-border bg-card p-6"><p className="text-sm text-muted-foreground">You&apos;re paying for</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">{link?.description ?? (token ? 'Payment link' : 'Loading...')}</h1>
          <div className="mt-4">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${link?.status === 'Held' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {link?.status === 'Held' ? 'Deposited in Escrow' : (link?.status || 'Initiating...')}
            </span>
          </div>
          <p className="mt-8 text-5xl font-semibold tracking-tight">{link ? `KES ${Number(link.amount).toLocaleString()}` : '—'}</p>

          {link?.status !== 'Held' && link?.status !== 'Released' && (
            <input
              placeholder="Enter M-Pesa number (07...)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="my-4 h-12 w-full rounded-xl border border-input bg-background px-4 outline-none"
            />
          )}

          <div className="my-7 rounded-2xl bg-muted p-4"><p className="text-sm font-semibold">Protected by a clear rule</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{link?.rule ?? 'Your payment stays protected until the agreed condition is met.'}</p></div>
            {link?.status === 'Held' ? (
              <button onClick={handleRelease} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 font-semibold text-white">
                <Check className="size-4" /> Release payment
              </button>
            ) : link?.status === 'Released' ? (
              <div className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-muted font-semibold text-muted-foreground">
                Payment Released
              </div>
            ) : (
              <button onClick={handleConfirm} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground">
                <Check className="size-4" /> Confirm payment
              </button>
            )}</section><p className="flex items-center justify-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4" /> Secure payments powered by LOOP</p></div></main>
}
