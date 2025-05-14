import express from 'express';
import fetch from 'node-fetch'; // Importing node-fetch for making requests

const app = express();

// Use the dynamic port from Render, or default to 3000 locally
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("This is the proxy server for information about the CCR Stream. Add /nowplaying to the url to access the information.");
});

app.get("/nowplaying", async (req, res) => {
  try {
    const url = "https://cast3.asurahosting.com/proxy/chelmsfo/stats?sid=1&mode=json";
    
    // Make the request to SHOUTcast API
    const response = await fetch(url);

    // Check if the response was successful
    if (!response.ok) {
      console.error(`❌ Failed to fetch from SHOUTcast: ${response.status} ${response.statusText}`);
      return res.status(500).json({ error: `Upstream fetch failed: ${response.statusText}` });
    }

    const data = await response.json();

    // Log the raw data from SHOUTcast for debugging
    console.log("🪵 Raw SHOUTcast data:", JSON.stringify(data, null, 2));
    
    // Return the raw JSON data (for debugging purposes)
    res.json(data);

  } catch (error) {
    console.error("❌ Error in /nowplaying:", error.message);
    res.status(500).json({ error: `Failed to fetch data: ${error.message}` });
  }
});

// Start the server and listen on the provided port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
