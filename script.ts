import { Resend } from 'resend';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || 're_A2hYFkU4_95mD2M2k7xLq8Fw8K7N1yV3v'); // Need the right key, actually process.env will have it if I use npx dotenv or I just extract it.
async function test() {
  try {
     console.log("Using Token:", process.env.RESEND_API_KEY ? "YES (Env)" : "NO");
     const result = await resend.emails.list({ limit: 100 });
     console.log("Result object:", result);
     console.log("Result error:", JSON.stringify(result.error, null, 2));
     const emailsArray = Array.isArray(result.data) ? result.data : (result.data?.data || []);
     console.log("Total emails:", emailsArray.length);
     if (emailsArray.length > 0) {
        let count = 0;
        for (const e of emailsArray) {
            if (e.subject?.includes('entrada confirmada')) {
                count++;
                console.log("Match:", e.subject, e.created_at);
            }
        }
        console.log("Total matches:", count);
        console.log("First 5 subjects:", result.data.map(e => e.subject).slice(0, 5));
     }
  } catch(e) {
      console.error(e);
  }
}

test();
