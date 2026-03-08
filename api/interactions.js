import { verifyKey } from "discord-interactions";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {

  const signature = req.headers["x-signature-ed25519"];
  const timestamp = req.headers["x-signature-timestamp"];

  const rawBody = await buffer(req);

  const isValidRequest = verifyKey(
    rawBody,
    signature,
    timestamp,
    process.env.DISCORD_PUBLIC_KEY
  );

  if (!isValidRequest) {
    return res.status(401).send("Invalid request signature");
  }

  const body = JSON.parse(rawBody.toString("utf8"));

  if (body.type === 1) {
    return res.status(200).json({ type: 1 });
  }

  return res.status(200).json({ ok: true });
}
