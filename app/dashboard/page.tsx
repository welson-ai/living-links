'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PaymentDashboard } from '@/components/payment-dashboard'
import { supabase } from '@/lib/supabase/client'

export default function DashboardPage() {
  const router = useRouter()
  useEffect(() => { supabase.auth.getUser().then(({ data }) => { if (!data.user) router.replace('/auth/login') }) }, [router])
  return <PaymentDashboard />
}
