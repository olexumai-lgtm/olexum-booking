import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Clock, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

const FONT_HEADING = "'Cormorant Garamond', Georgia, serif";
const FONT_BODY = "'DM Sans', system-ui, sans-serif";

export default function ThankYou() {
  useEffect(() => {
    if (window.fbq) {
      window.fbq("track", "CompleteRegistration");
    }
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#f8f8fa] to-white text-[#1a1a2e] flex flex-col items-center justify-center px-5 py-16"
      style={{ fontFamily: FONT_BODY }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <img
            src="/olexum-logo.png"
            alt="Olexum"
            className="h-5 sm:h-6 w-auto mx-auto"
          />
        </div>

        {/* Heading */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20"
          >
            <Clock className="w-8 h-8 text-primary" />
          </motion.div>

          <h1
            className="text-[32px] sm:text-[40px] font-semibold tracking-[-0.01em] leading-[1.1] mb-4 text-[#1a1a2e]"
            style={{ fontFamily: FONT_HEADING }}
          >
            You're Almost Set!
          </h1>
          <p className="text-[#6b7280] text-[15px] leading-[1.65]">
            Your Growth Audit has been requested — but it's not locked in yet.
          </p>
        </div>

        {/* Confirm CTA — the most important thing on the page */}
        <Card className="bg-white border-[#e5e7eb]/50 shadow-[0_2px_16px_rgba(0,0,0,0.05)] rounded-2xl mb-7 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-40" />
          <CardContent className="p-7 sm:p-9 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h2
              className="text-xl sm:text-[22px] font-semibold mb-3 leading-[1.2]"
              style={{ fontFamily: FONT_HEADING }}
            >
              Check your texts to confirm your appointment
            </h2>
            <p className="text-sm text-[#6b7280] leading-[1.7]">
              We just sent you a confirmation message. Your Growth Audit isn't
              locked in until you confirm via the link in your text or email.
            </p>
          </CardContent>
        </Card>

        {/* What to expect */}
        <Card className="bg-white border-[#e5e7eb]/50 shadow-[0_2px_16px_rgba(0,0,0,0.05)] rounded-2xl mb-7 overflow-hidden">
          <CardContent className="p-7 sm:p-9">
            <h3
              className="font-semibold text-lg mb-4 flex items-center gap-2.5 leading-[1.2]"
              style={{ fontFamily: FONT_HEADING }}
            >
              <Phone className="w-4 h-4 text-primary" />
              What to expect on your call
            </h3>
            <p className="text-sm text-[#6b7280] leading-[1.7]">
              One of Olexum's co-founders will walk you through exactly how much
              revenue your spa is leaving on the table — and how SpaFlow captures
              it in 48 hours. The call takes about 15 minutes.
            </p>
          </CardContent>
        </Card>

        {/* Footer note */}
        <p className="text-center text-xs text-[#9ca3af]">
          Need to reschedule? Use the link in your confirmation text or email.
        </p>
      </motion.div>
    </div>
  );
}
