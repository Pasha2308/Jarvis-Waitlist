import { Resend } from "resend";
import { RESEND_API_KEY } from "@/lib/env";

export const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
