import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Webhook Received:", body);

    // LOOP doc says to branch on statusCode
    // Assuming status or statusCode is passed in the callback body
    const txnReference = body.txnReference;
    const status = body.statusCode || body.status; 
    
    // Based on docs, success is usually a 200/SUCCESS indicator
    const newStatus = (status === 200 || status === 'SUCCESS') ? 'Held' : 'Failed';

    if (txnReference) {
      await supabaseAdmin
        .from('living_links')
        .update({ status: newStatus })
        .eq('token', txnReference);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
