import { Resend } from "resend";

interface SendEmail {
  to: string;
  messageBody: string;
  subject: string;
}

export const sendEmail = async ({
  subject,
  to,
  messageBody,
}: SendEmail): Promise<void> => {
  console.log("✉️ Sending email to", to);

  if (process.env.NODE_ENV === "development") {
    console.log("Not sending in development:");
    console.log(messageBody);
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "ops@danphilibin.com",
    to,
    subject,
    text: messageBody,
  });
};
