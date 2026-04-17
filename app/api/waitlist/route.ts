import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_URL } from "@/lib/env";
import { resend } from "@/lib/resend";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateRefCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let suffix = "";
  for (let i = 0; i < 4; i += 1) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `JARV-${suffix}`;
}

export async function POST(request: Request) {
  try {
    const { email, referred_by: referredBy } = (await request.json()) as {
      email?: string;
      referred_by?: string;
    };

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email format." }, { status: 400 });
    }

    console.log("Incoming email:", email);

    const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const refCode = generateRefCode();
    const createdAt = new Date().toISOString();
    const baseOffset = 2000;

    const { error: insertError } = await supabase.from("waitlist").insert({
      email,
      ref_code: refCode,
      created_at: createdAt,
      referred_by: referredBy ?? null,
    });

    if (insertError) {
      const isDuplicateEmail =
        insertError.code === "23505" || insertError.message.toLowerCase().includes("waitlist_email_key");

      if (isDuplicateEmail) {
        const { data: existingUser, error: existingUserError } = await supabase
          .from("waitlist")
          .select("position, ref_code")
          .eq("email", email)
          .single();

        if (existingUserError || !existingUser) {
          return NextResponse.json({ success: false, error: existingUserError?.message ?? "Duplicate lookup failed." }, { status: 500 });
        }

        const rawPosition = existingUser.position ?? 0;
        const displayPosition = rawPosition + baseOffset;

        return NextResponse.json({
          success: true,
          displayPosition,
          ref_code: existingUser.ref_code,
          already_exists: true,
        });
      }

      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
    }
    console.log("Inserted user with ref_code:", refCode);

    const { count, error: countError } = await supabase
      .from("waitlist")
      .select("email", { count: "exact", head: true })
      .lte("created_at", createdAt);

    if (countError) {
      return NextResponse.json({ success: false, error: countError.message }, { status: 500 });
    }

    const position = count ?? 0;
    console.log("User position:", position);
    console.log("Referred by:", referredBy ?? null);

    if (referredBy) {
      await supabase.rpc("bump_referral_position", { p_ref_code: referredBy });
      console.log("Referral boost applied");
    }

    const displayPosition = position + baseOffset;
    const origin = new URL(request.url).origin;
    const referralLink = `${origin}?ref=${refCode}`;

    console.log("Attempting email send");
    if (resend) {
      try {
        await resend.emails.send({
          from: "Jarvis Home <onboarding@resend.dev>",
          to: email,
          subject: "Access Granted.",
          html: `
            <div style="background:#000000;padding:32px 16px;font-family:'Space Mono',Consolas,Monaco,'Courier New',monospace;color:#ffffff;">
              <div style="max-width:560px;margin:0 auto;border:1px solid rgba(255,42,42,0.35);padding:28px 24px;background:#050505;">
                <p style="margin:0 0 12px;color:rgba(255,42,42,0.75);font-size:12px;letter-spacing:0.18em;text-transform:uppercase;">
                  &gt; ACCESS CONFIRMED
                </p>
                <h1 style="margin:0 0 10px;font-size:40px;line-height:1.1;font-weight:700;color:#ffffff;">
                  You're inside.
                </h1>
                <p style="margin:0 0 24px;color:rgba(255,255,255,0.8);font-size:14px;">
                  Your system has been registered.
                </p>
                <div style="margin:0 0 24px;padding:18px;border:1px solid rgba(255,42,42,0.45);background:#0b0b0b;">
                  <p style="margin:0;color:#ffffff;font-size:14px;letter-spacing:0.08em;">Position:</p>
                  <p style="margin:8px 0 0;color:#ff2a2a;font-size:36px;font-weight:700;line-height:1;">#${displayPosition}</p>
                </div>
                <div style="margin:0 0 24px;">
                  <p style="margin:0 0 6px;color:#ffffff;font-size:14px;font-weight:700;">Move up the queue.</p>
                  <p style="margin:0 0 16px;color:rgba(255,255,255,0.8);font-size:14px;">Invite others. Gain priority.</p>
                  <a href="${referralLink}" style="display:block;width:fit-content;min-width:220px;text-align:center;background:#ff2a2a;color:#ffffff;padding:12px 18px;text-decoration:none;font-weight:700;letter-spacing:0.05em;">
                    Activate Referral Link
                  </a>
                </div>
                <p style="margin:0 0 8px;color:#ffffff;font-weight:700;">
                  This is not a tool. This is a system.
                </p>
                <p style="margin:0;color:rgba(255,255,255,0.65);font-size:12px;">
                  We’ll notify you when access unlocks.
                </p>
              </div>
            </div>
          `,
          text: `> ACCESS CONFIRMED

You're inside.
Your system has been registered.

Position: #${displayPosition}

Move up the queue.
Invite others. Gain priority.

Activate Referral Link: ${referralLink}

This is not a tool. This is a system.
We'll notify you when access unlocks.`,
        });
        console.log("Email sent");
      } catch (emailError) {
        console.log("Email failed");
        console.error(emailError);
      }
    } else {
      console.log("Skipping email - no API key");
    }

    return NextResponse.json({
      success: true,
      displayPosition,
      ref_code: refCode,
      already_exists: false,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Unexpected server error." }, { status: 500 });
  }
}
