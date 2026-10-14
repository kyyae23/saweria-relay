const express = require("express");
const app = express();
app.use(express.json());

const donations = [];
const acked = new Set();

app.post("/saweria", (req, res) => {
  const body = req.body;
  const id = Date.now().toString();
  donations.push({
    id,
    donator_name: body.donator_name || body.name || "Anonim",
    username: body.donator_name || body.name || "Anonim",
    amount: body.amount || 0,
    message: body.message || "",
    avatar: body.donator_avatar || body.avatar || "",
    timestamp: Date.now(),
  });
  if (donations.length > 50) donations.shift();
  res.json({ success: true, id });
});

// Support GET dan POST /api/pull
app.all("/api/pull", (req, res) => {
  const body = req.body || {};
  const limit = parseInt((body.limit) || req.query.limit || "10");
  const pending = donations
    .filter((d) => !acked.has(d.id))
    .slice(0, limit);
  res.json({ ok: true, items: pending });
});

// Support GET dan POST /api/ack
app.all("/api/ack", (req, res) => {
  const body = req.body || {};
  const items = body.items || [];
  for (const item of items) {
    if (item.id) acked.add(item.id);
  }
  res.json({ ok: true });
});

app.get("/", (req, res) => {
  res.json({ status: "OK" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on port", PORT));
