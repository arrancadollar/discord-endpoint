export default function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(200).send("Endpoint online");
  }

  const body = req.body;

  if (body?.type === 1) {
    return res.status(200).json({ type: 1 });
  }

  return res.status(200).json({ ok: true });

}
