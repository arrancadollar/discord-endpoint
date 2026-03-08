import { verifyKey } from "discord-interactions";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const signature = req.headers["x-signature-ed25519"];
  const timestamp = req.headers["x-signature-timestamp"];

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks);

  const isValid = verifyKey(
    rawBody,
    signature,
    timestamp,
    process.env.DISCORD_PUBLIC_KEY
  );

  if (!isValid) {
    return res.status(401).send("Invalid request signature");
  }

  const body = JSON.parse(rawBody.toString());

  if (body.type === 1) {
    return res.status(200).json({ type: 1 });
  }

  return res.status(200).json({ ok: true });
}
