const endpoint = "https://api.emailjs.com/api/v1.0/email/send";

export const isEmailConfigured = Boolean(
  import.meta.env.VITE_EMAILJS_SERVICE_ID &&
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID &&
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
);

export async function sendBusinessEmail(subject: string, message: string, replyTo?: string) {
  if (!isEmailConfigured) return { skipped: true };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
      template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      user_id: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      template_params: {
        subject,
        message,
        reply_to: replyTo || "primepolo03@gmail.com",
        to_email: "primepolo03@gmail.com",
      },
    }),
  });

  if (!response.ok) throw new Error("Email notification could not be sent.");
  return { skipped: false };
}