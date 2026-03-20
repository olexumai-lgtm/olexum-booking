import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Calendar, Video, FileText } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

import { useEffect } from "react";

// Declare fbq type for TypeScript
declare global {
  interface Window {
    fbq: any;
  }
}

export default function ThankYou() {
  // Track 'Schedule' event when Thank You page loads
  useEffect(() => {
    if (window.fbq) {
      window.fbq('track', 'Schedule');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/50 shadow-[0_0_30px_-5px_var(--color-primary)]"
          >
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </motion.div>
          
          {/* Added padding-bottom to prevent gradient text clipping */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 pb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Booking Confirmed
          </h1>
          <p className="text-xl text-muted-foreground">
            Your strategy session has been scheduled. We look forward to speaking with you.
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur-xl border-white/10 shadow-2xl mb-8 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              What to Expect Next
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-white">Calendar Invite</h3>
                  <p className="text-muted-foreground">Check your email for the calendar invitation and meeting link. Please accept the invite to confirm your slot.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  <Video className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-white">Zoom Meeting</h3>
                  <p className="text-muted-foreground">The call will be held via Zoom. We recommend joining from a computer to see the live demo of our Voice AI Agents.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-white">Preparation</h3>
                  <p className="text-muted-foreground">Please have a rough estimate of your current lead volume and missed call rates ready for our discussion.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">Need to reschedule? The link is in your email confirmation.</p>
          
          <a href="https://olexum.solutions" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="w-full sm:w-auto min-w-[200px] text-lg h-12 bg-white text-black hover:bg-white/90 transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
              Visit Our Website <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
