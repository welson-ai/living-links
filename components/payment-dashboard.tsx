'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Check, ChevronRight, Copy, Link2, LockKeyhole, Plus, Send, ShieldCheck, Sparkles, X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type LinkRow = {
  id: string
  amount: number
  description: string
  rule: string
  split_percentage: number | null
  status: 'Held' | 'Released' | 'Paid'
  token: string
  created_at: string
}

function money(value: number) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(value)
}

function makeToken(description: string) {
  return `${description.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Math.random().toString(36).slice(2, 8)}`
}

export function PaymentDashboard() {
  const router = useRouter()
  const [links, setLinks] = useState<LinkRow[]>([])
  const [activeTab, setActiveTab] = useState<'links' | 'activity'>('links')
  const [showCreate, setShowCreate] = useState(false)
  const [selected, setSelected] = useState<LinkRow | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [rule, setRule] = useState('Release when client approves')

  const loadLinks = useCallback(async () => {
    const { data } = await supabase.from('living_links').select('*').order('created_at', { ascending: false })
    if (data?.length) setLinks(data as LinkRow[])
    setLoading(false)
  }, [])

  useEffect(() => { void loadLinks() }, [loadLinks])

  const held = useMemo(() => links.filter((link) => link.status === 'Held').reduce((sum, link) => sum + Number(link.amount), 0), [links])
  const paid = useMemo(() => links.filter((link) => link.status === 'Paid' || link.status === 'Released').reduce((sum, link) => sum + Number(link.amount), 0), [links])

  async function createLink(event: React.FormEvent) {
    event.preventDefault()
    const numericAmount = Number(amount)
    if (!description.trim() || !numericAmount || numericAmount <= 0) return
    const next = { amount: numericAmount, description: description.trim(), rule, status: 'Held', token: makeToken(description) }
    const { data } = await supabase.from('living_links').insert(next).select().single()
    if (data) setLinks((current) => [data as LinkRow, ...current])
    if (!data) return
    setDescription(''); setAmount(''); setShowCreate(false)
  }

  async function releaseLink(link: LinkRow) {
    const { data } = await supabase.from('living_links').update({ status: 'Released', updated_at: new Date().toISOString() }).eq('id', link.id).select().single()
    const updated = (data as LinkRow) ?? { ...link, status: 'Released' as const }
    setLinks((current) => current.map((item) => item.id === link.id ? updated : item))
    setSelected(updated)
  }

  async function copyLink(link: LinkRow) {
    await navigator.clipboard?.writeText(`${window.location.origin}/pay/${link.token}`)
    setCopied(true); window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-10 pt-6 sm:max-w-2xl sm:px-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5"><div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Link2 className="size-4" /></div><span className="font-semibold tracking-tight">Living Links</span></div>
          <button aria-label="Sign out" onClick={async () => { await supabase.auth.signOut(); router.replace('/') }} className="grid size-9 place-items-center rounded-full border border-border bg-card text-sm font-semibold">JD</button>
        </header>

        <section className="pt-10"><p className="text-sm text-muted-foreground">Good morning, Jordan</p><div className="mt-2 flex items-end justify-between"><h1 className="text-3xl font-semibold tracking-tight">Your links</h1><button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm"><Plus className="size-4" /> Create</button></div></section>

        <section className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-border bg-card p-4"><div className="mb-5 flex items-center justify-between"><span className="text-xs font-medium text-muted-foreground">Held in links</span><LockKeyhole className="size-4 text-muted-foreground" /></div><p className="text-2xl font-semibold tracking-tight">{money(held)}</p><p className="mt-1 text-xs text-muted-foreground">Across {links.filter((l) => l.status === 'Held').length} links</p></div><div className="rounded-2xl border border-border bg-card p-4"><div className="mb-5 flex items-center justify-between"><span className="text-xs font-medium text-muted-foreground">Total received</span><ArrowDownLeft className="size-4 text-muted-foreground" /></div><p className="text-2xl font-semibold tracking-tight">{money(paid)}</p><p className="mt-1 text-xs text-muted-foreground">This month</p></div></section>

        <div className="mt-8 flex gap-6 border-b border-border"><button onClick={() => setActiveTab('links')} className={`border-b-2 pb-3 text-sm font-semibold ${activeTab === 'links' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}`}>Payment links</button><button onClick={() => setActiveTab('activity')} className={`border-b-2 pb-3 text-sm font-semibold ${activeTab === 'activity' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}`}>Activity</button></div>

        {activeTab === 'links' ? <section className="divide-y divide-border">{loading ? <p className="py-8 text-center text-sm text-muted-foreground">Loading your links...</p> : links.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No payment links yet. Create your first link above.</p> : links.map((link) => <button key={link.id} onClick={() => setSelected(link)} className="flex w-full items-center justify-between gap-4 py-5 text-left"><div className="min-w-0"><div className="flex items-center gap-2"><span className={`size-2 rounded-full ${link.status === 'Held' ? 'bg-accent' : 'bg-foreground'}`} /><span className="truncate font-medium">{link.description}</span></div><p className="mt-1 pl-4 text-sm text-muted-foreground">{link.rule}</p></div><div className="flex shrink-0 items-center gap-2"><span className="font-semibold">{money(Number(link.amount))}</span><ChevronRight className="size-4 text-muted-foreground" /></div></button>)}</section> : <section className="space-y-4 py-6">{links.length === 0 ? <p className="text-center text-sm text-muted-foreground">Your activity will appear here.</p> : links.map((link) => <ActivityRow key={link.id} icon={link.status === 'Held' ? <ArrowDownLeft /> : <ArrowUpRight />} title={link.status === 'Held' ? 'Payment link created' : 'Link released'} detail={link.description} amount={money(Number(link.amount))} />)}</section>}

        <div className="mt-auto flex items-center justify-center gap-2 pt-10 text-xs text-muted-foreground"><ShieldCheck className="size-4" /> Secure payments powered by LOOP</div>
      </div>

      {showCreate && <div className="fixed inset-0 z-10 flex items-end justify-center bg-foreground/30 p-3 sm:items-center"><form onSubmit={createLink} className="w-full max-w-md rounded-3xl bg-card p-6 shadow-xl"><div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">New link</p><h2 className="mt-1 text-2xl font-semibold">Request payment</h2></div><button type="button" onClick={() => setShowCreate(false)} className="grid size-9 place-items-center rounded-full bg-muted" aria-label="Close"><X className="size-4" /></button></div><label className="mb-4 block text-sm font-medium">What is this for?<input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Website design" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 outline-none ring-ring focus:ring-2" required /></label><label className="mb-4 block text-sm font-medium">Amount<input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="KES 0.00" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 outline-none ring-ring focus:ring-2" required /></label><label className="mb-6 block text-sm font-medium">Release rule<select value={rule} onChange={(e) => setRule(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 outline-none ring-ring focus:ring-2"><option>Release when client approves</option><option>Release on handoff</option><option>Split 50/50</option></select></label><button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground">Create payment link <ChevronRight className="size-4" /></button></form></div>}

      {selected && <div className="fixed inset-0 z-10 flex items-end justify-center bg-foreground/30 p-3 sm:items-center"><div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-xl"><div className="flex items-start justify-between"><div><div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground"><span className={`size-2 rounded-full ${selected.status === 'Held' ? 'bg-green-500' : 'bg-amber-500'}`} /> {selected.status}</div><h2 className="text-2xl font-semibold">{money(Number(selected.amount))}</h2><p className="mt-1 text-muted-foreground">{selected.description}</p></div><button onClick={() => setSelected(null)} className="grid size-9 place-items-center rounded-full bg-muted" aria-label="Close"><X className="size-4" /></button></div><div className="my-6 rounded-2xl bg-muted p-4"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl bg-card"><Sparkles className="size-4" /></div><div><p className="text-sm font-semibold">{selected.rule}</p><p className="mt-1 text-xs text-muted-foreground">Funds stay protected until the condition is met.</p></div></div></div>
        
      {selected.status === 'Released' && (
          <div className="flex flex-col items-center justify-center p-6 border border-border rounded-2xl bg-white mb-6">
            <p className="text-sm font-semibold mb-3 text-foreground">Verification QR</p>
            <QRCodeSVG value={`${window.location.origin}/pay/${selected.token}`} size={128} />
          </div>
      )}
        
      <div className="flex gap-3"><button onClick={() => copyLink(selected)} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-border font-semibold">{copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? 'Copied' : 'Copy link'}</button>{selected.status === 'Held' && <button onClick={() => releaseLink(selected)} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground"><Send className="size-4" /> Release</button>}</div></div></div>}
    </main>
  )
}

function ActivityRow({ icon, title, detail, amount }: { icon: React.ReactNode; title: string; detail: string; amount: string }) { return <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground">{icon}</div><div className="flex-1"><p className="text-sm font-medium">{title}</p><p className="text-xs text-muted-foreground">{detail}</p></div><span className="text-sm font-semibold">{amount}</span></div> }
