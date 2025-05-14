import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🎧 Proxy server is running!");
});

app.get("/nowplaying", async (req, res) => {
  try {
    const url = "https://cast3.asurahosting.com/proxy/chelmsfo/stats?sid=1&mode=json";
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Upstream fetch failed with status:", response.status);
      return res.status(500).json({ error: "Upstream server error" });
    }

    const data = await response.json();

    console.log("Raw response from SHOUTcast:", JSON.stringify(data, null, 2));
    
    // Return the raw JSON data
    res.json(data);

  } catch (error) {
    console.error("Error in /nowplaying:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
