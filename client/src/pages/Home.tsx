import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Phone,
  Calendar,
  Sparkles,
  Info,
  ArrowRight,
} from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";

// ── Config ──────────────────────────────────────────────────────────
const MUX_PLAYBACK_ID = "S01UN02sQh7iQLh5eZVwM2bu5B00A8701TXcl363KNkHHfw";
const GHL_CALENDAR_URL =
  "https://api.leadconnectorhq.com/widget/booking/g5Gko1Ht8zeUQB8XIAbg";

const FONT_HEADING = "'Cormorant Garamond', Georgia, serif";
const FONT_BODY = "'DM Sans', system-ui, sans-serif";

// ── Types (see globals.d.ts) ─────────────────────────────────────────

// ── Animated Counter ────────────────────────────────────────────────
function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 1.5,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const end = start + duration * 1000;
    const step = () => {
      const now = Date.now();
      const progress = Math.min((now - start) / (end - start), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

// ── Main Component ──────────────────────────────────────────────────
export default function Home() {
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [showQualifier, setShowQualifier] = useState(false);
  const [disqualified, setDisqualified] = useState(false);
  const [missedCalls, setMissedCalls] = useState(8);
  const [treatmentValue, setTreatmentValue] = useState(475);
  const heroRef = useRef<HTMLElement>(null);
  const calendarRef = useRef<HTMLElement>(null);
  const finalCtaRef = useRef<HTMLElement>(null);
  const qualifierTriggeredRef = useRef(false);

  // Pixel one-time flags
  const firedViewContent = useRef(false);
  const firedSchedule = useRef(false);
  const firedCalcInteraction = useRef(false);
  const firedVSLPlay = useRef(false);
  const firedVSL50 = useRef(false);
  const firedVSLComplete = useRef(false);
  const firedScroll50 = useRef(false);
  const firedScroll75 = useRef(false);

  // Revenue calculator
  const bookingRate = 0.3;
  const monthlyMissedRevenue = Math.round(
    missedCalls * treatmentValue * bookingRate * 4.33
  );
  const yearlyMissedRevenue = monthlyMissedRevenue * 12;

  // ── Scroll to calendar ──────────────────────────────────────────
  const scrollToCalendar = useCallback(() => {
    calendarRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleCTAClick = useCallback(() => {
    window.fbq?.("trackCustom", "CTAClick");
    scrollToCalendar();
  }, [scrollToCalendar]);

  // ── Qualifier handlers ──────────────────────────────────────────
  const handleQ1Yes = () => {
    if (window.fbq && !window._leadFired) {
      window.fbq("track", "Lead");
      window._leadFired = true;
    }
    setShowQualifier(false);
    scrollToCalendar();
  };

  const handleQ1No = () => {
    setDisqualified(true);
  };

  // ── Lock scroll when qualifier is open ──────────────────────────
  useEffect(() => {
    document.body.style.overflow = showQualifier ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showQualifier]);

  // ── Qualifier trigger: 30s timeout OR scroll past hero (whichever first) ──
  useEffect(() => {
    if (sessionStorage.getItem("qualifierSeen")) return;

    const trigger = () => {
      if (qualifierTriggeredRef.current) return;
      qualifierTriggeredRef.current = true;
      setShowQualifier(true);
      sessionStorage.setItem("qualifierSeen", "1");
      cleanup();
    };

    const handleScroll = () => {
      const hero = heroRef.current;
      if (!hero) return;
      if (hero.getBoundingClientRect().bottom <= 0) trigger();
    };

    const timerId = setTimeout(trigger, 30_000);
    window.addEventListener("scroll", handleScroll, { passive: true });

    function cleanup() {
      clearTimeout(timerId);
      window.removeEventListener("scroll", handleScroll);
    }

    return cleanup;
  }, []);

  // ── Sticky CTA visibility ──────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 0;
      const calendarTop =
        calendarRef.current?.getBoundingClientRect().top ?? Infinity;
      const calendarBottom =
        calendarRef.current?.getBoundingClientRect().bottom ?? Infinity;
      const inCalendarZone =
        calendarTop < window.innerHeight && calendarBottom > 0;
      const finalCtaTop =
        finalCtaRef.current?.getBoundingClientRect().top ?? Infinity;
      const inFinalCtaZone = finalCtaTop < window.innerHeight;
      setShowStickyCTA(heroBottom < 0 && !inCalendarZone && !inFinalCtaZone);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Load GHL widget script ─────────────────────────────────────
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://link.msgsndr.com/js/form_embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // ── Meta Pixel: ViewContent (scroll past hero) ────────────────
  useEffect(() => {
    const el = calendarRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !firedViewContent.current) {
          firedViewContent.current = true;
          window.fbq?.("track", "ViewContent");
          observer.disconnect();
        }
      },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Meta Pixel: Schedule (calendar visible) ──────────────────
  useEffect(() => {
    const el = calendarRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !firedSchedule.current) {
          firedSchedule.current = true;
          window.fbq?.("track", "Schedule");
          observer.disconnect();
        }
      },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Meta Pixel: ScrollDepth50 & ScrollDepth75 ────────────────
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = scrollTop / docHeight;
      if (pct >= 0.5 && !firedScroll50.current) {
        firedScroll50.current = true;
        window.fbq?.("trackCustom", "ScrollDepth50");
      }
      if (pct >= 0.75 && !firedScroll75.current) {
        firedScroll75.current = true;
        window.fbq?.("trackCustom", "ScrollDepth75");
      }
      if (firedScroll50.current && firedScroll75.current) {
        window.removeEventListener("scroll", handleScroll);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── VSL pixel event handlers ─────────────────────────────────
  const handleVSLPlay = useCallback(() => {
    if (!firedVSLPlay.current) {
      firedVSLPlay.current = true;
      window.fbq?.("trackCustom", "VSLPlay");
    }
  }, []);

  const handleVSLTimeUpdate = useCallback(
    (e: Event) => {
      const el = e.target as HTMLMediaElement;
      if (!el.duration) return;
      const pct = el.currentTime / el.duration;
      if (pct >= 0.5 && !firedVSL50.current) {
        firedVSL50.current = true;
        window.fbq?.("trackCustom", "VSL50");
      }
      if (pct >= 0.95 && !firedVSLComplete.current) {
        firedVSLComplete.current = true;
        window.fbq?.("trackCustom", "VSLComplete");
      }
    },
    [],
  );

  const handleVSLEnded = useCallback(() => {
    if (!firedVSLComplete.current) {
      firedVSLComplete.current = true;
      window.fbq?.("trackCustom", "VSLComplete");
    }
  }, []);

  // ── Fade-in animation variant ──────────────────────────────────
  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
    }),
  };

  return (
    <div
      className="min-h-screen bg-white text-[#1a1a2e] overflow-x-hidden selection:bg-primary/20"
      style={{ fontFamily: FONT_BODY }}
    >
      {/* ════════════════════════════════════════════════════════════
          SECTION 1: HERO
      ════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative bg-gradient-to-b from-[#f8f8fa] to-white"
      >
        <div className="container max-w-2xl lg:max-w-4xl mx-auto pt-4 sm:pt-6 pb-12 sm:pb-20 px-5">
          {/* Logo */}
          <div className="mb-6 sm:mb-12">
            <img
              src="/olexum-logo.png"
              alt="Olexum"
              className="h-5 sm:h-6 w-auto"
            />
          </div>

          {/* Headline — centered */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[32px] sm:text-[44px] lg:text-[56px] font-semibold leading-[1.1] tracking-[-0.01em] mb-4 sm:mb-5 text-center"
            style={{ fontFamily: FONT_HEADING }}
          >
            Stop Paying for Clients You Never See.
          </motion.h1>

          {/* Subheadline — centered */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[15px] sm:text-lg text-[#6b7280] leading-[1.65] mb-8 sm:mb-10 max-w-xl mx-auto text-center"
          >
            SpaFlow is a full client acquisition system built around your
            day spa — from first call to confirmed booking to five-star review.{" "}
            <span className="text-[17px] sm:text-[21px] font-bold text-[#1a1a2e] whitespace-nowrap">You only pay per booked appointment.</span>
          </motion.p>

          {/* VSL Video Player */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-4xl mx-auto shadow-2xl rounded-xl overflow-hidden mb-8 sm:mb-10"
          >
            <MuxPlayer
              playbackId={MUX_PLAYBACK_ID}
              autoPlay="muted"
              muted
              loop={false}
              playsInline
              onPlay={handleVSLPlay}
              onTimeUpdate={handleVSLTimeUpdate}
              onEnded={handleVSLEnded}
              style={{ aspectRatio: "16/9", width: "100%" }}
            />
          </motion.div>

          {/* Value props — left-aligned */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-2.5 sm:gap-7 mb-8 sm:mb-10"
          >
            {[
              { icon: Phone, text: "Every call answered, qualified, and converted — 24/7" },
              {
                icon: Calendar,
                text: "Appointments booked, confirmed, and followed up automatically",
              },
              {
                icon: Sparkles,
                text: "Custom-built around your services in 48 hours",
              },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-[13px] sm:text-sm text-[#4b5563] leading-[1.6]">
                  {text}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Primary CTA — centered */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-center"
          >
            <Button
              onClick={handleCTAClick}
              size="lg"
              className="w-full sm:w-auto text-[15px] font-semibold px-9 h-13 bg-primary hover:bg-[#a67d56] text-white rounded-xl shadow-[0_4px_20px_rgba(184,146,106,0.35)] transition-all hover:shadow-[0_6px_28px_rgba(184,146,106,0.45)] active:scale-[0.98]"
            >
              Book Your Free Growth Audit
            </Button>
            <p className="text-xs text-[#9ca3af] mt-3 sm:mt-4 text-center">
              No setup fees &middot; No retainers &middot; Only pay per booked appointment
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 2: Q1 QUALIFIER (Scroll-triggered modal)
      ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showQualifier && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-md px-5"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] p-8 sm:p-10 max-w-md w-full border border-[#e5e7eb]/40"
            >
              {!disqualified ? (
                <>
                  <p className="text-[11px] font-medium text-[#9ca3af] uppercase tracking-[0.1em] mb-3">
                    Question 1 of 1
                  </p>
                  <h3
                    className="text-2xl sm:text-[28px] font-semibold mb-8 leading-[1.2]"
                    style={{ fontFamily: FONT_HEADING }}
                  >
                    Do you own or manage a day spa?
                  </h3>
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={handleQ1Yes}
                      size="lg"
                      className="w-full h-13 bg-primary hover:bg-[#a67d56] text-white rounded-xl font-semibold text-[15px]"
                    >
                      Yes, that's me
                    </Button>
                    <Button
                      onClick={handleQ1No}
                      variant="outline"
                      size="lg"
                      className="w-full h-13 rounded-xl font-medium text-[15px] border-[#e5e7eb] text-[#6b7280] hover:bg-[#f9fafb]"
                    >
                      No
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h3
                    className="text-2xl font-semibold mb-3 leading-[1.2]"
                    style={{ fontFamily: FONT_HEADING }}
                  >
                    Thanks for your interest
                  </h3>
                  <p className="text-[#6b7280] text-sm leading-[1.65] mb-7">
                    This offer is specifically designed for day spa owners. If
                    you run a different type of business, reach out to us at{" "}
                    <a
                      href="mailto:hello@olexum.solutions"
                      className="text-primary hover:underline"
                    >
                      hello@olexum.solutions
                    </a>
                    .
                  </p>
                  <Button
                    onClick={() => {
                      setShowQualifier(false);
                      setDisqualified(false);
                    }}
                    variant="outline"
                    className="w-full h-11 rounded-xl border-[#e5e7eb] text-[#6b7280]"
                  >
                    Close
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════
          SECTION 3: CALENDAR BOOKING
      ════════════════════════════════════════════════════════════ */}
      <section
        ref={calendarRef}
        id="calendar"
        className="bg-[#fafafa] py-20 sm:py-24 lg:py-28"
      >
        <div className="container max-w-2xl lg:max-w-4xl mx-auto px-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <h2
              className="text-[28px] sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.01em] leading-[1.1] mb-5"
              style={{ fontFamily: FONT_HEADING }}
            >
              Book Your Free Growth Audit
            </h2>
            <p className="text-[#6b7280] text-[15px] sm:text-lg max-w-lg mx-auto leading-[1.65]">
              We'll show you exactly how much revenue is slipping
              through your current process — and how SpaFlow captures it from first call to five-star review.
            </p>
            <p className="text-sm text-[#9ca3af] mt-4">
              You'll speak with one of Olexum's co-founders.
            </p>
          </motion.div>

          {/* GHL Calendar Embed */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb]/60 overflow-hidden">
            <iframe
              src={GHL_CALENDAR_URL}
              style={{ width: "100%", border: "none", overflow: "scroll" }}
              scrolling="yes"
              id="g5Gko1Ht8zeUQB8XIAbg_1737701234567"
              className="w-full h-[700px] sm:h-[750px]"
              title="Book a call"
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 4: THE PROBLEM — Revenue Calculator
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-24 lg:py-28">
        <div className="container max-w-2xl lg:max-w-4xl mx-auto px-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={0}
          >
            <h2
              className="text-[28px] sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.01em] leading-[1.1] mb-5 text-center"
              style={{ fontFamily: FONT_HEADING }}
            >
              Your Clients Are Calling.
              <br className="hidden sm:block" />
              <span className="text-[#9ca3af]">
                {" "}
                Are They Booking?
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            custom={1}
          >
            <Card className="mt-12 bg-[#fafafa] border-[#e5e7eb]/60 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-6 sm:p-10">
                {/* Slider 1: Missed Calls */}
                <div className="mb-9">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-[#4b5563]">
                      Missed Calls Per Week
                    </label>
                    <span
                      className="text-xl font-semibold text-[#1a1a2e]"
                      style={{ fontFamily: FONT_HEADING }}
                    >
                      {missedCalls}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={30}
                    value={missedCalls}
                    onChange={(e) => {
                      setMissedCalls(Number(e.target.value));
                      if (!firedCalcInteraction.current) {
                        firedCalcInteraction.current = true;
                        window.fbq?.("trackCustom", "CalculatorInteraction");
                      }
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-[#9ca3af] mt-1.5">
                    <span>3</span>
                    <span>30</span>
                  </div>
                </div>

                {/* Slider 2: Treatment Value */}
                <div className="mb-9">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-[#4b5563]">
                      Average Treatment Value
                    </label>
                    <span
                      className="text-xl font-semibold text-[#1a1a2e]"
                      style={{ fontFamily: FONT_HEADING }}
                    >
                      ${treatmentValue}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={1000}
                    step={25}
                    value={treatmentValue}
                    onChange={(e) => {
                      setTreatmentValue(Number(e.target.value));
                      if (!firedCalcInteraction.current) {
                        firedCalcInteraction.current = true;
                        window.fbq?.("trackCustom", "CalculatorInteraction");
                      }
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-[#9ca3af] mt-1.5">
                    <span>$200</span>
                    <span>$1,000</span>
                  </div>
                </div>

                {/* Fixed Rate */}
                <div className="flex items-center gap-2 mb-9 text-sm text-[#6b7280]">
                  <span>Call-to-Booking Rate: 30%</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3.5 h-3.5 text-[#9ca3af] cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[240px] text-sm">
                      Industry average conversion rate from phone call to booked
                      appointment for day spas.
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Revenue Output */}
                <div className="bg-white rounded-xl p-7 sm:p-8 border border-[#e5e7eb]/60 text-center">
                  <p className="text-xs text-[#9ca3af] uppercase tracking-[0.08em] mb-2">
                    Estimated Monthly Missed Revenue
                  </p>
                  <p
                    className="text-4xl sm:text-5xl font-bold text-primary mb-5"
                    style={{ fontFamily: FONT_HEADING }}
                  >
                    <AnimatedNumber
                      value={monthlyMissedRevenue}
                      prefix="$"
                    />
                  </p>
                  <p className="text-xs text-[#9ca3af] uppercase tracking-[0.08em] mb-2">
                    Estimated Yearly Missed Revenue
                  </p>
                  <p
                    className="text-2xl sm:text-3xl font-bold text-[#1a1a2e]"
                    style={{ fontFamily: FONT_HEADING }}
                  >
                    <AnimatedNumber value={yearlyMissedRevenue} prefix="$" />
                  </p>
                </div>

                {/* Stat callout */}
                <p className="text-center text-sm text-[#6b7280] mt-7 leading-[1.65]">
                  79% of day spa clients have skipped booking entirely because
                  they couldn't get through.
                </p>

                {/* CTA */}
                <div className="text-center mt-7">
                  <Button
                    onClick={scrollToCalendar}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/5 rounded-xl font-semibold h-11 px-7"
                  >
                    Stop Leaving Revenue on the Table
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 5: HOW IT WORKS — 3 Feature Cards
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#f8f8fa] py-20 sm:py-24 lg:py-28">
        <div className="container max-w-2xl lg:max-w-5xl mx-auto px-5">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={0}
            className="text-[28px] sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.01em] leading-[1.1] text-center mb-14 sm:mb-16"
            style={{ fontFamily: FONT_HEADING }}
          >
            Your Spa, Fully Covered — In 48 Hours
          </motion.h2>

          <div className="grid gap-6 sm:gap-7 lg:grid-cols-3">
            {[
              {
                icon: Phone,
                title: "Every Lead Captured",
                description:
                  "SpaFlow answers every call instantly — during treatments, after hours, weekends. It qualifies each caller, collects their information, and moves them into your pipeline. No voicemail. No missed opportunities.",
              },
              {
                icon: Calendar,
                title: "Booked, Confirmed & Followed Up",
                description:
                  "Qualified leads are booked directly into your calendar, confirmed via text, and automatically followed up if they don't show. No-shows get re-engaged. Nothing falls through the cracks.",
              },
              {
                icon: Sparkles,
                title: "Built Around Your Spa",
                description:
                  "SpaFlow isn't a generic tool you plug in. We build it around your services, pricing, availability, and workflow — then handle ongoing nurture and review collection so every client becomes a repeat client.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                custom={i}
              >
                <Card className="bg-white border-[#e5e7eb]/40 shadow-[0_2px_16px_rgba(0,0,0,0.05)] rounded-2xl h-full transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1">
                  <CardContent className="p-7 sm:p-8">
                    <div className="w-12 h-12 rounded-xl bg-[#f5f5f7] flex items-center justify-center mb-6">
                      <feature.icon className="w-5 h-5 text-[#4b5563]" />
                    </div>
                    <h3
                      className="text-xl sm:text-[22px] font-semibold mb-3 leading-[1.2]"
                      style={{ fontFamily: FONT_HEADING }}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#6b7280] leading-[1.7]">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 6: SOCIAL PROOF / RESULTS
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-24 lg:py-28">
        <div className="container max-w-2xl lg:max-w-4xl mx-auto px-5 text-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={0}
            className="text-[11px] font-medium text-[#9ca3af] uppercase tracking-[0.12em] mb-10"
          >
            Real results from a real client
          </motion.p>

          <div className="grid grid-cols-3 gap-4 sm:gap-10 mb-12">
            {[
              { value: 311, label: "Calls Answered" },
              { value: 29, label: "Appointments Booked" },
              { value: 30, label: "Days" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                custom={i}
              >
                <p
                  className="text-[40px] sm:text-5xl lg:text-6xl font-bold text-primary"
                  style={{ fontFamily: FONT_HEADING }}
                >
                  <AnimatedNumber value={stat.value} />
                </p>
                <p className="text-xs sm:text-sm text-[#6b7280] mt-2">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={3}
          >
            <Button
              onClick={handleCTAClick}
              size="lg"
              className="bg-primary hover:bg-[#a67d56] text-white rounded-xl font-semibold h-12 px-9 shadow-[0_4px_20px_rgba(184,146,106,0.35)] transition-all hover:shadow-[0_6px_28px_rgba(184,146,106,0.45)]"
            >
              Book Your Free Growth Audit
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 7: FAQ
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#f8f8fa] py-20 sm:py-24 lg:py-28">
        <div className="container max-w-2xl lg:max-w-3xl mx-auto px-5">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={0}
            className="text-[28px] sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.01em] leading-[1.1] text-center mb-12 sm:mb-14"
            style={{ fontFamily: FONT_HEADING }}
          >
            Frequently Asked Questions
          </motion.h2>

          <Accordion type="single" collapsible className="space-y-3.5">
            {[
              {
                q: "Will it sound robotic?",
                a: "No. We customize the voice, tone, and responses to match your brand. Your callers won't know the difference.",
              },
              {
                q: "How long does setup take?",
                a: "48 hours from onboarding to live. We handle everything.",
              },
              {
                q: "What if a caller needs a real person?",
                a: "The system can transfer to your team anytime during business hours. After hours, it handles everything — booking, rescheduling, answering questions.",
              },
              {
                q: "Does it work with my booking software?",
                a: "Yes. SpaFlow integrates directly with your existing calendar and booking system.",
              },
              {
                q: "How does pricing work?",
                a: "You only pay per booked appointment. No setup fees, no monthly retainers. If SpaFlow doesn't book appointments, you don't pay.",
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-20px" }}
                variants={fadeUp}
                custom={i}
              >
                <AccordionItem
                  value={`faq-${i}`}
                  className="bg-white border border-[#e5e7eb]/50 rounded-xl px-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)] data-[state=open]:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow"
                >
                  <AccordionTrigger
                    className="text-left font-medium text-[15px] py-5 hover:no-underline"
                    style={{ fontFamily: FONT_HEADING, fontSize: "17px" }}
                  >
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-[#6b7280] leading-[1.7] pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 8: FINAL CTA
      ════════════════════════════════════════════════════════════ */}
      <section ref={finalCtaRef} className="bg-white py-20 sm:py-24 lg:py-28">
        <div className="container max-w-2xl mx-auto px-5 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={0}
          >
            <h2
              className="text-[28px] sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.01em] leading-[1.1] mb-5"
              style={{ fontFamily: FONT_HEADING }}
            >
              Your Competitors Are Already Picking Up.
            </h2>
            <p className="text-[#6b7280] text-[15px] sm:text-lg mb-10 max-w-lg mx-auto leading-[1.65]">
              Every day without SpaFlow is another day of leads that don't convert,
              clients that don't book, and revenue you don't collect.
            </p>
            <Button
              onClick={handleCTAClick}
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-[#a67d56] text-white rounded-xl font-semibold text-[15px] h-13 px-9 shadow-[0_4px_20px_rgba(184,146,106,0.35)] transition-all hover:shadow-[0_6px_28px_rgba(184,146,106,0.45)] active:scale-[0.98]"
            >
              Book Your Free Growth Audit
            </Button>
            <p className="text-xs text-[#9ca3af] mt-4">
              No setup fees &middot; No retainers &middot; Only pay per booked appointment
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          STICKY MOBILE CTA
      ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-sm border-t border-[#e5e7eb] px-4 py-3"
            style={{
              paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
            }}
          >
            <Button
              onClick={handleCTAClick}
              size="lg"
              className="w-full bg-primary hover:bg-[#a67d56] text-white rounded-xl font-semibold text-[15px] h-12 shadow-[0_4px_20px_rgba(184,146,106,0.35)]"
            >
              Book Your Free Growth Audit
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
