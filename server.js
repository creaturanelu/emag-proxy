// server.js
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// --- PROXY UNIVERSAL ---
app.get("/proxy", async (req, res) => {
  try {
    const targetUrl = req.query.url;

    if (!targetUrl) {
      return res.status(400).json({ error: "Missing ?url=" });
    }

    console.log("Proxy fetch ->", targetUrl);

    const response = await axios.get(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    res.send(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Proxy request failed", details: err.toString() });
  }
});

// --- EMAG SEARCH SPECIAL ---
app.get("/emag-search", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "Missing ?q=" });

    const url = `https://www.emag.ro/search/${encodeURIComponent(q)}/sort-priceasc`;

    console.log("EMAG search ->", url);

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        Accept: "text/html",
      },
    });

    res.send(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Emag fetch failed", details: err.toString() });
  }
});

app.get("/", (req, res) => {
  res.send("Backend eMAG Proxy merge! 🎉");
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
