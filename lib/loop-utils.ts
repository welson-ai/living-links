import { createHmac } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// LOOP Constants
export const LOOP_TILL_NO = '133238';
export const LOOP_SIGNING_SECRET = 'hyqd7bwMr9Kv-C5PW4n7uF4TiMnMp_hyvyhYYkYlcU8';

// Signature logic as per documentation
export function generateLoopSignature(tillNo: string, timestamp: string, nonce: string, secret: string) {
  // Canonical string: tillNo|timestamp|nonce
  const canonicalString = `${tillNo}|${timestamp}|${nonce}`;
  return createHmac('sha256', secret)
    .update(canonicalString)
    .digest('hex'); // Returns lowercase hex by default
}

export function generateTimestamp() {
  // Format: YYYY-MM-DDTHH:mm:ssZ
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export function generateNonce() {
  return uuidv4().toLowerCase();
}

/**
 * Fetches OAuth2 token from LOOP.
 */
export async function getLoopAccessToken() {
  const credentials = Buffer.from(`${process.env.LOOP_CLIENT_ID}:${process.env.LOOP_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch('https://sandbox.loop.co.ke/gateway/auth/1.0/oauth2/token', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  });

  const data = await response.json();
  
  if (!data.access_token) {
    console.error("LOOP Auth Error:", data);
    return null;
  }
  
  return data.access_token;
}

/**
 * Send funds from Merchant Till to Recipient
 */
export async function sendMoneyLoop(
  fromTill: string, 
  recipientPhone: string, 
  amount: number, 
  purpose: string, 
  orderRef: string, 
  token: string
) {
  const timestamp = generateTimestamp();
  const nonce = generateNonce();
  
  // Note: Docs say signature uses merchantTill|timestamp|nonce
  const signature = generateLoopSignature(fromTill, timestamp, nonce, LOOP_SIGNING_SECRET);

  const payload = {
    serviceCode: "MRCHNT_SENDMONEY",
    txnReference: orderRef,
    requestParameters: {
      channel: "LOOP",
      merchantTill: fromTill,
      recipientMobileNo: recipientPhone,
      amount: amount.toFixed(2),
      purposeOfPayment: purpose,
      timestamp,
      nonce,
      signature
    }
  };

  return await fetch('https://sandbox.loop.co.ke/gateway/send-money-loop/1.0/services/process-service-request2', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(payload),
  });
}
