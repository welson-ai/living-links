'use client'

import { useEffect, useState } from 'react'
import { Check, Link2, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

type LinkRow = { amount: number; description: string; rule: string; status: string }

export default function PayPage({ params }: { params: Promise<{ token: string }> }) {
  const [link, setLink] = useState<LinkRow | null>(null)
  const [token, setToken] = useState('')
  useEffect(() => { void params.then(({ token: nextToken }) => { setToken(nextToken); void supabase.from('living_links').select('amount,description,rule,status').eq('token', nextToken).single().then(({ data }) => setLink(data as LinkRow | null)) }) }, [params])
  return <main className="min-h-screen bg-background px-5 py-8 text-foreground"><div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-between"><header className="flex items-center gap-2.5"><div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Link2 className="size-4" /></div><span className="font-semibold tracking-tight">Living Links</span></header><section className="rounded-3xl border border-border bg-card p-6"><p className="text-sm text-muted-foreground">You&apos;re paying for</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">{link?.description ?? (token ? 'Payment link' : 'Loading...')}</h1><p className="mt-8 text-5xl font-semibold tracking-tight">{link ? `$${Number(link.amount).toLocaleString()}` : '—'}</p><div className="my-7 rounded-2xl bg-muted p-4"><p className="text-sm font-semibold">Protected by a clear rule</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{link?.rule ?? 'Your payment stays protected until the agreed condition is met.'}</p></div><button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground"><Check className="size-4" /> Confirm payment</button></section><p className="flex items-center justify-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4" /> Secure payments powered by LOOP</p></div></main>
}
