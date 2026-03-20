import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, Phone, TrendingUp, ChevronRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _step1Fired?: boolean;
    _step1QualifiedFired?: boolean;
    _leadFired?: boolean;
  }
}

export default function Home() {
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [missedCalls, setMissedCalls] = useState(5);
  const [jobValue, setJobValue] = useState(4500);
  const [isMonthly, setIsMonthly] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [showQualification, setShowQualification] = useState(true);
  const [qualStep, setQualStep] = useState(1);
  const [disqualified, setDisqualified] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState("");

  const handleQ1Answer = (answer: string) => {
    if (typeof window !== "undefined" && window.fbq && !window._step1Fired) {
      window.fbq("trackCustom", "Step1Complete", { answer });
      window._step1Fired = true;
    }
    if (answer === "yes") {
      if (typeof window !== "undefined" && window.fbq && !window._step1QualifiedFired) {
        window.fbq("trackCustom", "Step1Qualified");
        window._step1QualifiedFired = true;
      }
      setQualStep(2);
    } else {
      setDisqualified(true);
    }
  };

  const handleQ2Answer = (answer: string) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("trackCustom", "QualifiedLead", { contractor_type: "mitigation_restoration", growth_challenge: answer });
      if (!window._leadFired) {
        window.fbq("track", "Lead", { content_name: "qualification_form", content_category: answer });
        window._leadFired = true;
      }
    }
    setShowQualification(false);
  };

  // Handle scroll for sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Countdown timer to March 28, 2026
  useEffect(() => {
    const targetDate = new Date("March 28, 2026 23:59:59").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff < 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load GHL Widget Script & Handle Redirect
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://link.msgsndr.com/js/form_embed.js";
    script.async = true;
    document.body.appendChild(script);

    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === 'survey-submit' || e.data.type === 'calendar-booking-redirect') {
        window.location.href = "/thank-you";
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      document.body.removeChild(script);
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Calculate revenue
  const annualOpportunity = missedCalls * jobValue * 0.25 * 52;
  const displayedRevenue = isMonthly ? annualOpportunity / 12 : annualOpportunity;

  const features = [
    {
      icon: <Phone className="w-8 h-8 text-primary" />,
      title: "Zero Missed Calls 24/7",
      description: "Your AI receptionist picks up every missed call instantly. No voicemail, no missed jobs, no leads lost to competitors.",
    },
    {
      icon: <Check className="w-8 h-8 text-primary" />,
      title: "Instant Lead Qualification",
      description: "Callers are qualified and booked directly into your calendar in real time. Your team wakes up to jobs, not voicemails.",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Beyond the Booking",
      description: "Because the work doesn't stop there. Your team focuses on the job site. Our system handles everything before and after - lead nurture, follow-up, and review collection.",
    },
  ];

  const faqs = [
    {
      question: "How does the 2-week free trial work?",
      answer: "We build and deploy a custom Voice AI Agent for your business completely free for 14 days. You only pay if you decide to keep it after seeing the results.",
    },
    {
      question: "Will it sound robotic?",
      answer: "Not at all. We use advanced Voice AI that sounds indistinguishable from a human, with natural pauses, intonation, and latency under 500ms.",
    },
    {
      question: "What industries do you support?",
      answer: "We specialize in service-based businesses including HVAC, Plumbing, Med Spas, Dental Offices, Legal Firms, Real Estate, and Restoration Businesses.",
    },
    {
      question: "Does it integrate with my CRM?",
      answer: "Yes, we integrate seamlessly with all major CRM platforms to sync leads and appointments instantly.",
    },
  ];

  void showStickyCTA;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans selection:bg-primary/30">

      {/* Qualification Overlay */}
      <AnimatePresence>
        {showQualification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md">
              {disqualified ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-6"
                >
                  <h2 className="text-3xl font-bold text-white">Not you? No problem.</h2>
                  <p className="text-[#8b949e] text-lg leading-relaxed">
                    This page is built for restoration pros, but Olexum powers AI systems for all kinds of service businesses.
                  </p>
                  <div className="space-y-2 text-left">
                    <label className="text-[13px] text-[#8b949e] block">What type of business do you run?</label>
                    <select
                      className="w-full h-[48px] px-4 bg-[#161b22] border border-[rgba(99,140,255,0.2)] rounded-[10px] text-white appearance-none focus:outline-none focus:border-[#4f8fff] transition-colors"
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                    >
                      <option value="" disabled>Select your industry</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="hvac">HVAC</option>
                      <option value="roofing">Roofing</option>
                      <option value="electrical">Electrical</option>
                      <option value="landscaping">Landscaping</option>
                      <option value="pest-control">Pest Control</option>
                      <option value="cleaning-janitorial">Cleaning / Janitorial</option>
                      <option value="general-contractor">General Contractor</option>
                      <option value="med-spa-wellness">Med Spa / Wellness</option>
                      <option value="dental-medical">Dental / Medical</option>
                      <option value="legal">Legal</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-4 pt-4">
                    <Button
                      className="w-full h-[48px] text-base font-medium bg-[#4f8fff] hover:bg-[#4f8fff]/90 text-white rounded-[10px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!selectedIndustry}
                      onClick={() => window.location.href = `https://olexum.solutions?industry=${selectedIndustry}`}
                    >
                      See how Olexum works for you →
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={qualStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-center gap-2 mb-8">
                    <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
                      Question {qualStep}/2
                    </span>
                    <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: qualStep === 1 ? "50%" : "100%" }}
                      />
                    </div>
                  </div>
                  {qualStep === 1 ? (
                    <>
                      <h2
                        className="text-2xl font-bold text-center text-white leading-tight"
                        style={{ fontSize: "22px" }}
                      >
                        Are you a mitigation contractor or restoration business owner?
                      </h2>
                      <div className="grid gap-4 pt-4">
                        <Button
                          size="lg"
                          className="h-16 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02]"
                          onClick={() => handleQ1Answer("yes")}
                        >
                          Yes, that's me
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="h-16 text-lg font-medium border-white/10 hover:bg-white/5 hover:text-white transition-all"
                          onClick={() => handleQ1Answer("no")}
                        >
                          No
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-3xl md:text-4xl font-bold text-center text-white leading-tight">
                        What's your biggest growth challenge right now?
                      </h2>
                      <div className="grid gap-4 pt-4">
                        {["Missing Calls/Losing Leads", "Hiring & Scaling My Team", "Inconsistent Follow-Up", "Unqualified Leads"].map((challenge) => (
                          <Button
                            key={challenge}
                            size="lg"
                            variant="outline"
                            className="h-16 text-lg font-medium border-white/10 hover:bg-primary hover:border-primary hover:text-white transition-all hover:scale-[1.02] justify-start px-6"
                            onClick={() => handleQ2Answer(challenge)}
                          >
                            {challenge}
                          </Button>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-transparent border-none">
        <div className="container mx-auto px-4 h-24 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663309562810/xeUVpNNzaWDHjuqd.png"
              alt="Olexum Logo"
              className="h-12 md:h-16 w-auto object-contain drop-shadow-lg"
            />
          </div>
          <Button variant="outline" className="hidden md:flex border-white/20 bg-black/20 backdrop-blur-sm hover:bg-white/10 hover:text-white transition-colors" onClick={() => document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' })}>
            Book Strategy Call
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-2 lg:pt-24 lg:pb-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-full h-full z-0 pointer-events-none bg-background">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-lg bg-blue-600/20 border border-blue-500 text-blue-400 text-sm md:text-base font-black tracking-wide mb-4 shadow-[0_0_25px_-5px_rgba(37,99,235,0.5)] animate-pulse uppercase whitespace-nowrap">
                <span className="hidden md:inline mr-2">2 WEEKS FREE — OFFER ENDS IN:</span>
                <span className="md:hidden mr-1">OFFER ENDS:</span>
                <span className="font-mono text-base md:text-xl text-white">
                  <span className="hidden md:inline">
                    {countdown.days} DAYS : {countdown.hours.toString().padStart(2, "0")} HRS : {countdown.minutes.toString().padStart(2, "0")} MIN : {countdown.seconds.toString().padStart(2, "0")} SEC
                  </span>
                  <span className="md:hidden">
                    {countdown.days}d {countdown.hours.toString().padStart(2, "0")}h {countdown.minutes.toString().padStart(2, "0")}m {countdown.seconds.toString().padStart(2, "0")}s
                  </span>
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-4 leading-[0.9] uppercase">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 whitespace-nowrap">NEVER</span> lose a $10k job again.
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-4 max-w-2xl">
                A Complete AI System - Built for Restoration.
              </p>

              <div className="space-y-4 mb-4 md:mb-8">
                {["Zero Missed Calls 24/7", "Every Lead Screened & Qualified Instantly", "Inspections Booked While You Sleep"].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50, scale: 0.8 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.15, type: "spring", stiffness: 120, damping: 12 }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        boxShadow: ["0 0 0px var(--color-primary)", "0 0 20px var(--color-primary)", "0 0 0px var(--color-primary)"],
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      className="h-3 w-3 shrink-0 rounded-full bg-primary shadow-[0_0_10px_var(--color-primary)]"
                    />
                    <span className="font-bold tracking-wide text-lg md:text-xl text-white">{item}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button size="lg" className="hidden lg:flex text-xl font-bold h-16 px-10 bg-white text-black hover:bg-white/90 shadow-[0_0_40px_-5px_rgba(255,255,255,0.6)] transition-all hover:scale-105 uppercase tracking-wide" onClick={() => document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' })}>
                  CLAIM 2 WEEKS FREE <ChevronRight className="ml-2 w-6 h-6" />
                </Button>
              </div>
            </motion.div>

            {/* Calendar Widget Container - Desktop Right Side */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
              id="calendar-desktop"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-white/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <Card className="relative bg-card/80 backdrop-blur-xl border-white/10 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-white/50 to-primary opacity-50" />
                  <CardContent className="p-0">
                    <div className="w-full h-[900px] overflow-hidden rounded-xl bg-white/5">
                      <iframe
                        src="https://api.leadconnectorhq.com/widget/booking/g5Gko1Ht8zeUQB8XIAbg"
                        style={{ width: '100%', border: 'none', overflow: 'scroll' }}
                        scrolling="yes"
                        id="g5Gko1Ht8zeUQB8XIAbg_1737701234567"
                        className="w-full h-full min-h-[900px]"
                      ></iframe>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Revenue Opportunity Calculator */}
      <section className="py-0 my-0 bg-transparent">
        <div className="container mx-auto px-4 py-0 my-0">
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto py-0 my-0" onValueChange={(value) => setIsCalculatorOpen(value === "calculator")}>
            <AccordionItem value="calculator" className="border-none py-0 my-0">
              <AccordionTrigger className="hover:no-underline py-0 my-0 [&>svg]:hidden">
                <div className="w-full">
                  {isCalculatorOpen ? (
                    <div className="w-full bg-[#0d1117] border border-[rgba(255,107,107,0.15)] rounded-t-xl p-6 pb-2 cursor-pointer text-left border-b-0 rounded-b-none">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-[#ff4d4d] shrink-0" />
                          <span className="text-white font-bold text-base leading-tight">You're losing money right now</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#4f8fff] -rotate-90" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full bg-[#0d1117] border border-[rgba(255,107,107,0.15)] rounded-xl p-6 cursor-pointer text-left">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[#ff4d4d] shrink-0" />
                        <span className="text-white font-bold text-base leading-tight">You're losing money right now</span>
                      </div>
                      <p className="text-[#8b949e] text-[13px] leading-relaxed mb-4 pl-[18px]">
                        The average restoration company bleeds <span className="text-[#ff6b6b] font-semibold">$24K+/mo</span> in missed calls. Most don't even know it.
                      </p>
                      <div className="flex items-center justify-between pl-[18px]">
                        <span className="text-[#4f8fff] font-medium text-sm">See what you're losing →</span>
                        <ChevronRight className="w-5 h-5 text-[#4f8fff] rotate-90" />
                      </div>
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-2">
                <Card className="bg-black/40 border-white/10 backdrop-blur-md">
                  <CardContent className="p-6 md:p-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-white">Calculate Your Missed Revenue</h3>
                          <p className="text-sm text-muted-foreground">
                            See exactly how much revenue you could be capturing with 24/7 AI coverage.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Missed Calls Per Week</label>
                            <input
                              type="range"
                              min="1"
                              max="30"
                              value={missedCalls}
                              onChange={(e) => setMissedCalls(parseInt(e.target.value))}
                              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>1</span>
                              <span className="text-primary font-bold text-base">{missedCalls}</span>
                              <span>30</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Average Job Value</label>
                            <input
                              type="range"
                              min="1500"
                              max="15000"
                              step="250"
                              value={jobValue}
                              onChange={(e) => setJobValue(parseInt(e.target.value))}
                              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>$1,500</span>
                              <span className="text-primary font-bold text-base">${jobValue.toLocaleString()}</span>
                              <span>$15,000</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 py-2 border-t border-white/5 border-b border-white/5">
                            <span className="text-sm font-medium text-white">Avg. Call-to-Job Rate: 25%</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-black border border-white/10 text-white p-2 max-w-xs text-xs">
                                  <p>Industry data shows roughly 1 in 4 restoration inquiry calls convert to a paid job.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>

                        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                          <p className="text-xs text-primary/80 leading-relaxed">
                            <strong className="text-primary">Did you know?</strong> 80% of callers hang up when they reach voicemail, and most won't call back.
                          </p>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-6 border border-white/10 flex flex-col justify-center items-center text-center h-full">
                        <div className="flex items-center bg-black/40 rounded-full p-1 mb-6 border border-white/10">
                          <button
                            onClick={() => setIsMonthly(true)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isMonthly ? "bg-[#4f8fff] text-white shadow-lg" : "text-muted-foreground hover:text-white"}`}
                          >
                            Monthly
                          </button>
                          <button
                            onClick={() => setIsMonthly(false)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isMonthly ? "text-muted-foreground hover:text-white" : "bg-[#4f8fff] text-white shadow-lg"}`}
                          >
                            Yearly
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Estimated {isMonthly ? "Monthly" : "Annual"} Opportunity</p>
                        <p className="text-4xl md:text-5xl font-black mb-4" style={{ background: "linear-gradient(135deg, #ff4d4d, #ff6b6b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                          ${Math.round(displayedRevenue).toLocaleString()}
                        </p>
                        <Button className="w-full bg-white text-black hover:bg-white/90 font-bold text-lg py-6 shadow-lg hover:scale-[1.02] transition-transform" onClick={() => document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' })}>
                          UNLOCK THIS REVENUE
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-0 my-0 pt-0 mt-0 bg-background relative">
        <div className="container mx-auto px-4 pt-20">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Your Entire Lead-to-Job Pipeline — Automated</h2>
            <p className="text-lg text-muted-foreground">
              One system that handles calls, qualifies leads, books jobs, nurtures prospects, and collects reviews — 24/7.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 hover:border-primary/50 transition-colors duration-300 h-full group">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-primary/20">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-background relative border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-8">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-[#4f8fff] mb-2">30</div>
              <div className="text-lg md:text-xl text-muted-foreground font-medium">Days</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-[#4f8fff] mb-2">311</div>
              <div className="text-lg md:text-xl text-muted-foreground font-medium">Calls Answered</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-[#4f8fff] mb-2">29</div>
              <div className="text-lg md:text-xl text-muted-foreground font-medium">Jobs Booked</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Calendar Section (Visible only on mobile/tablet) */}
      <section id="calendar" className="py-20 lg:hidden relative bg-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-white">Book Your Free Strategy Call</h2>
            <div className="max-w-2xl mx-auto text-left bg-white/5 p-6 rounded-lg border border-white/10">
              <h3 className="font-bold text-white mb-2">What happens on the call:</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">A 30-minute strategy call where we learn about your business, figure out how many calls you're leaving on the table, and show you exactly how the AI would save those calls and turn them into booked jobs — built around the way you already operate.</p>
            </div>
          </div>
          <Card className="bg-card border-white/10 overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              <iframe
                src="https://api.leadconnectorhq.com/widget/booking/g5Gko1Ht8zeUQB8XIAbg"
                style={{ width: '100%', border: 'none', overflow: 'scroll' }}
                scrolling="yes"
                id="g5Gko1Ht8zeUQB8XIAbg_mobile"
                className="w-full h-[900px]"
              ></iframe>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-background/95 backdrop-blur-xl border-t border-white/10 z-50 lg:hidden shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.5)]">
        <Button size="lg" className="w-full h-14 relative flex items-center justify-center bg-white text-black shadow-[0_0_20px_-5px_rgba(255,255,255,0.5)] uppercase tracking-wide animate-pulse" onClick={() => {
          const iframe = document.getElementById("g5Gko1Ht8zeUQB8XIAbg_mobile");
          if (iframe) {
            const top = iframe.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }}>
          <span className="text-xl font-bold leading-none text-center mb-1.5">CLAIM 2 WEEKS FREE</span>
          <span className="absolute bottom-1 left-0 w-full text-[9px] font-normal normal-case text-black/60 text-center px-2 whitespace-nowrap overflow-hidden text-ellipsis">No contracts. No fees. Cancel anytime.</span>
        </Button>
      </div>

      {/* FAQ Section */}
      <section className="py-8 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-4xl font-black text-center mb-8 uppercase tracking-tight">Common Questions</h2>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-white/10 rounded-lg bg-white/5 px-4">
                <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 pb-32 md:pb-12 border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <a href="https://olexum.solutions" target="_blank" rel="noopener noreferrer">
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663309562810/xeUVpNNzaWDHjuqd.png"
                alt="Olexum Logo"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </a>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="https://olexum.solutions/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="https://olexum.solutions/terms-of-service" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/60">
            <p className="text-center md:text-left max-w-2xl">
              By booking with Olexum, you consent to receive appointment-related SMS messages. Msg & data rates may apply. Reply STOP to opt out.{" "}
              <a href="https://olexum.solutions/terms-of-service#sms-communications" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors ml-1">SMS Policy</a>
            </p>
            <p>© {new Date().getFullYear()} Olexum Group. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
