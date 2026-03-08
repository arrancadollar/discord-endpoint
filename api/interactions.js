import { verifyKey } from "discord-interactions";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const signature = req.headers["x-signature-ed25519"];
  const timestamp = req.headers["x-signature-timestamp"];

  if (!signature || !timestamp) {
    return res.status(401).send("Missing signature headers");
  }

  const rawBody = await readRawBody(req);

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
