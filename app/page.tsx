'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2, Link2, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react'

const benefits = [
  { icon: ShieldCheck, title: 'Hold until delivery', body: 'Keep payment protected until the work is received and approved.' },
  { icon: Sparkles, title: 'Automatic matching', body: 'Every payment stays connected to the right order, customer, and conversation.' },
  { icon: MessageCircle, title: 'Easy WhatsApp sharing', body: 'Create a link and send it directly where your customers already chat.' },
]

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 sm:px-8">
        <header className="flex items-center justify-between py-6">
          <Link href="/" className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Link2 className="size-4" /></span><span className="font-semibold tracking-tight">Chequeout</span></Link>
          <nav className="flex items-center gap-3 text-sm"><Link href="/auth/login" className="hidden font-medium text-muted-foreground sm:inline">Log in</Link><Link href="/auth/sign-up" className="rounded-full bg-primary px-4 py-2.5 font-semibold text-primary-foreground">Get started</Link></nav>
        </header>
        <section className="relative flex flex-1 flex-col justify-center overflow-hidden rounded-[2rem] px-6 py-16 sm:px-10 sm:py-24 lg:px-16">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwq9NkjS9RoqNnE9SPsPIfuAyMTyNEA7sJJvxWWoMO3iVx3rRPOfXkU0s&s=10" alt="Seller using a phone to manage a payment" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-foreground/75" />
          <div className="relative z-10 max-w-3xl text-background">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary"><span className="size-1.5 rounded-full bg-primary" /> For social sellers</p>
            <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[1.03] tracking-[-0.06em] sm:text-7xl">Living Payment Links</h1>
            <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-background/80 sm:text-xl">Smart payment links for WhatsApp and Instagram sellers. Hold, confirm, and release money automatically.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/auth/sign-up" className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground shadow-sm">Create free account <ArrowRight className="size-4" /></Link></div>
            <div className="mt-20 grid gap-4 border-t border-background/25 pt-8 sm:grid-cols-3">{benefits.map(({ icon: Icon, title, body }) => <div key={title} className="space-y-3"><Icon className="size-5 text-primary" /><h2 className="font-semibold">{title}</h2><p className="text-sm leading-6 text-background/75">{body}</p></div>)}</div>
          </div>
        </section>
        <footer className="flex flex-col gap-3 border-t border-border py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Chequeout</span><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-primary" /> Built for trust at checkout</span></footer>
      </div>
    </main>
  )
}
