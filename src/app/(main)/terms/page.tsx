import Link from "next/link";

export default function TermsPage() {
  const sections = [
    {
      title: "1. How Booking Works",
      content: `Poach operates as a marketplace connecting diners with independent private chefs. When you submit a booking request, you are making a non-binding inquiry — no payment is charged at this stage.

Once a chef accepts your request, you will receive a notification and have 48 hours to pay a deposit to confirm the booking. If no deposit is received within 48 hours of acceptance, the booking expires automatically and the date is released back to the chef's calendar.

Poach does not guarantee chef availability and is not responsible for requests that are declined or that expire.`,
    },
    {
      title: "2. Payment Schedule",
      content: `All bookings require a two-part payment:

Deposit (25% of total): Due within 48 hours of chef acceptance. This confirms your booking and compensates the chef for reserving the date.

Balance (75% of total): Charged automatically to your payment method on file 48 hours before your scheduled event. You will receive an email reminder 72 hours prior.

All prices shown include Poach's platform fee. Prices are quoted in USD.`,
    },
    {
      title: "3. Cancellation Policy",
      content: `Diner Cancellations:
• 7 or more days before the event: Full deposit refund.
• 3 to 6 days before the event: 50% of the deposit refunded.
• Less than 72 hours before the event: No refund. The deposit is forfeited and the chef is compensated.
• After the balance has been charged: The deposit is non-refundable. The balance may be partially refunded at Poach's discretion depending on circumstances.

Chef Cancellations:
If a chef cancels a confirmed booking for any reason, the diner receives a full refund of all payments made. The chef may be subject to a penalty fee and reputational impact on their Poach profile. Repeated cancellations may result in removal from the platform.`,
    },
    {
      title: "4. Post-Event Payment Release",
      content: `Following your dining experience, Poach holds the chef's payment for 24 hours. During this window, diners may raise a formal dispute through Poach's support team if the experience materially differed from what was agreed (e.g., chef did not show up, significant menu deviations without notice).

If no dispute is raised within 24 hours, funds are released to the chef automatically. Poach's decision on disputes is final.`,
    },
    {
      title: "5. Reviews",
      content: `After your experience, you will be invited to leave a review. Reviews must be honest, based on your direct experience, and comply with Poach's community standards. Poach reserves the right to remove reviews that contain hate speech, personal attacks, or content that violates our policies.

Chefs may not offer incentives in exchange for positive reviews.`,
    },
    {
      title: "6. Dietary Restrictions & Allergies",
      content: `Diners are responsible for accurately disclosing all dietary restrictions and allergies at the time of booking. This information is shared directly with the chef. While chefs make every effort to accommodate, Poach cannot guarantee that meals will be free from all allergens.

Diners with severe allergies are encouraged to confirm directly with the chef prior to the event. Poach is not liable for allergic reactions or dietary incidents arising from inaccurate disclosure or chef error.`,
    },
    {
      title: "7. Liability",
      content: `Poach is a marketplace platform and is not an employer of, or party to agreements with, any chef listed on the platform. Chefs operate as independent contractors.

Poach is not liable for any injury, illness, property damage, or other harm arising from a private dining experience. Both diners and chefs are encouraged to carry appropriate insurance.`,
    },
    {
      title: "8. Changes to These Terms",
      content: `Poach may update these terms from time to time. Continued use of the platform after changes are posted constitutes acceptance of the revised terms. We will notify users of material changes via email.`,
    },
  ];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <Link href="/" style={{ fontSize: 12, color: "var(--text-dim)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 24 }}>
          ← Back to Poach
        </Link>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text-primary)", fontFamily: "Georgia, serif", margin: "0 0 8px" }}>
          Booking Terms & Conditions
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>
          Last updated: May 2026 · Effective for all bookings made on or after this date
        </p>
      </div>

      {/* Intro */}
      <div style={{ padding: "16px 20px", borderRadius: 3, background: "var(--bg-secondary)", border: "1px solid #C8A97E33", marginBottom: 32 }}>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
          These terms govern all booking requests, payments, and experiences made through Poach. By submitting a booking request, you confirm that you have read, understood, and agreed to the terms below.
        </p>
      </div>

      {/* Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {sections.map((s, i) => (
          <div key={i} style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 12px", fontFamily: "Georgia, serif" }}>
              {s.title}
            </h2>
            <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, whiteSpace: "pre-line" }}>
              {s.content}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 40, padding: "16px 20px", borderRadius: 3, background: "var(--bg-secondary)", border: "1px solid var(--border)", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "var(--text-dim)", margin: "0 0 8px" }}>Questions about these terms?</p>
        <a href="mailto:legal@poach.com" style={{ fontSize: 13, color: "#C8A97E", textDecoration: "none" }}>legal@poach.com</a>
      </div>
    </div>
  );
}
