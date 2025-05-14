import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

app.get("/nowplaying", async (req, res) => {
  try {
    const url = "https://cast3.asurahosting.com/proxy/chelmsfo/stats?sid=1";
    const response = await fetch(url);

    // Check if the response was successful
    if (!response.ok) {
      console.error(`Failed to fetch from SHOUTcast: ${response.status} ${response.statusText}`);
      return res.status(500).json({ error: `Upstream fetch failed: ${response.statusText}` });
    }

    const data = await response.json();
    console.log("🪵 Raw SHOUTcast data:", JSON.stringify(data, null, 2));
    
    // Return the raw JSON data for debugging
    res.json(data);

  } catch (error) {
    console.error("Error in /nowplaying:", error.message);
    res.status(500).json({ error: `Failed to fetch data: ${error.message}` });
  }
});
