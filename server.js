import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_BASE = "https://api.themoviedb.org/3";

app.get("/tmdb/*", async (req, res) => {
  try {
    const path = req.originalUrl.replace(/^\/tmdb/, "");
    const url = new URL(TMDB_API_BASE + path);

    if (!url.searchParams.get("api_key")) {
      url.searchParams.set("api_key", TMDB_API_KEY);
    }

    const response = await fetch(url.toString(), {
      headers: { "User-Agent": "tmdb-proxy" }
    });

    res.set("Access-Control-Allow-Origin", "*");
    res.set("Cache-Control", "public, max-age=600");
    res.status(response.status);

    const data = await response.text();
    res.send(data);
  } catch (err) {
    res.status(500).json({ error: "Proxy error", details: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`TMDB proxy running on ${PORT}`);
});
