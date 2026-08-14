import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateLoopSignature, generateTimestamp, generateNonce, getLoopAccessToken, LOOP_TILL_NO, LOOP_SIGNING_SECRET } from '@/lib/loop-utils';

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    const { phone, amount, orderRef } = await req.json();
    
    // 1. Get Token
    const token = await getLoopAccessToken();
    if (!token) {
      return NextResponse.json({ error: 'Auth failed' }, { status: 401 });
    }

    // 2. Prepare Signed Payload
    const timestamp = generateTimestamp();
    const nonce = generateNonce();
    // Signature uses the secret and the canonical string
    const signature = generateLoopSignature(LOOP_TILL_NO, timestamp, nonce, LOOP_SIGNING_SECRET);

    const payload = {
      serviceCode: "NEO_MRCHNT_STK",
      txnReference: orderRef, // Should be unique UUID v4
      requestParameters: {
        tillNo: LOOP_TILL_NO,
        payMblNo: phone,
        amount: amount.toString(),
        extRefNo: orderRef,
        // Use a production-ready URL; if local, use an ngrok URL.
        // Ensure this variable is set in .env.local
        callBackUrl: process.env.NEXT_PUBLIC_SITE_URL!.startsWith('http') 
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook/loop`
          : `https://your-domain.com/api/webhook/loop`, 
        timestamp,
        nonce,
        signature
      }
    };

    // 3. Call LOOP
    const response = await fetch('https://sandbox.loop.co.ke/gateway/mpesa-prompt/2.0/services/process-request', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    // 4. Handle Response - Check statusCode inside the JSON, not HTTP code
    if (data.statusCode === 200) {
      // Success accepted: record pending in Supabase
      await supabaseAdmin
        .from('living_links')
        .update({ status: 'pending' })
        .eq('token', orderRef);

      // FAKE ESCROW SIMULATION: REMOVED. 
      // It is no longer triggered automatically here.
      return NextResponse.json(data);
    } else {
      console.error("LOOP API Error:", data);
      return NextResponse.json(data, { status: 400 });
    }
  } catch (error) {
    console.error("Initiation Error:", error);
    return NextResponse.json({ error: 'Failed to initiate' }, { status: 500 });
  }
}
