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
    amount: body.amount || 0,
    message: body.message || "",
    avatar: body.donator_avatar || body.avatar || "",
    timestamp: Date.now(),
  });
  if (donations.length > 50) donations.shift();
  res.json({ success: true, id });
});

app.get("/api/pull", (req, res) => {
  const limit = parseInt(req.query.limit || "10");
  const pending = donations.filter((d) => !acked.has(d.id)).slice(0, limit);
  res.json({ donations: pending });
});

app.post("/api/ack", (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "No id" });
  acked.add(id);
  res.json({ success: true });
});

app.get("/", (req, res) => {
  res.json({ status: "OK" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on port", PORT));
