# Refinement Todo List

- [ ] **Landing Page**: Fix "Claim 2 Weeks Free" button scroll behavior (ensure it works on desktop & mobile)
- [ ] **Landing Page**: Update CRM FAQ text to be generic ("all major CRM platforms")
- [ ] **Landing Page**: Update "Hear Demo" button to call `+1 (720)-734-1044`
- [ ] **Landing Page**: Fix Calendar loading issue (increase height, enable scrolling fallback)
- [ ] **Thank You Page**: Fix "Booking Confirmed" header clipping (add padding)
- [ ] **Thank You Page**: Change button text to "Visit Our Website"
- [ ] **Assets**: Generate 4 professional logos for "Trusted By" section
- [ ] **Optimization**: Add sticky mobile CTA (optional but recommended)
- [ ] **Optimization**: Add urgency text above calendar (optional but recommended)

- [ ] **High Impact**: Change main headline to ALL CAPS and increase size for "in your face" effect
- [ ] **High Impact**: Replace "Accepting New Partners" badge with pulsing "LIMITED OFFER: 2 WEEKS FREE"
- [ ] **High Impact**: Add bold sub-headline: "WE BUILD IT. WE DEPLOY IT. YOU TRY IT FREE FOR 14 DAYS."
- [ ] **High Impact**: Increase size and glow of "Claim 2 Weeks Free" button
- [ ] **High Impact**: Update sticky mobile CTA text to "CLAIM 2 WEEKS FREE"
- [ ] **High Impact**: Ensure "2 Weeks Free" is mentioned prominently in the hero section text

- [ ] **Verification**: Double-check Meta Pixel (ID: 919217794115418) is correctly implemented in `index.html`
- [ ] **Mobile Fix**: Force "VOICE AI" to stay on the same line in the main headline on mobile devices

- [ ] **Mobile Fix**: Force "VOICE AI" to stay on the same line by using `whitespace-nowrap` on the span containing it.

- [ ] **Design Update**: Generate new "minimal and flowy" background image (liquid chrome/deep blue gradient)
- [ ] **Code Update**: Replace landing page background reference with the new image

- [ ] **Design Update**: Switch landing page background to `hero-bg-flow-3.png` (Deep space silk texture)

- [ ] **Feature**: Create `/calculator-demo` page with 3 interactive prototypes:
    - "Revenue Bleed" (Missed Calls x Value = Lost Revenue)
    - "Growth Engine" (Leads x Close Rate = Potential Revenue)
    - "Human vs AI" (Cost Comparison)

- [ ] **Fix**: Restart dev server to resolve "Invalid hook call" error caused by dependency optimization (Slider component)

- [ ] **Feature**: Update `/calculator-demo` with 3 refined prototypes:
    - "24/7 Coverage Calculator" (Cost Savings vs $600/mo)
    - "Speed-to-Lead Estimator" (Conversion Lift)
    - "Revenue Opportunity Estimator" (Opportunity vs Loss)
- [ ] **Content**: Research and integrate industry stats (missed call rates, lead churn) into the calculators

- [ ] **Feature**: Integrate "Revenue Opportunity Calculator" into `Home.tsx`
    - Place above FAQ section
    - Implement as expandable/collapsible section (Accordion or Button toggle)
    - Style to match "Chrome Horizon" theme (dark, blue accents)
    - Include Forbes citation link for 80% hang-up rate
    - Ensure mobile responsiveness

- [ ] **Fix**: Replace nested `Button` inside `AccordionTrigger` with `div` styled as button to resolve HTML validation error
