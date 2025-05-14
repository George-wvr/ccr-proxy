import express from 'express';
import fetch from 'node-fetch'; // Importing node-fetch for making requests

const app = express();

// Use the dynamic port from Render, or default to 3000 locally
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🎧 Proxy server is running!");
});

app.get("/nowplaying", async (req, res) => {
  try {
    const url = "https://cast3.asurahosting.com/proxy/chelmsfo/stats?sid=1&mode=json";
    
    // Make the request to SHOUTcast API
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`❌ Failed to fetch from SHOUTcast: ${response.status} ${response.statusText}`);
      return res.status(500).json({ error: `Upstream fetch failed: ${response.statusText}` });
    }

    // Get raw XML data
    const rawData = await response.text();
    console.log("🪵 Raw SHOUTcast XML:", rawData);  // Log the raw XML to the console
    
    // Return the raw XML as the response (just for debugging)
    res.type('text/xml');  // Set the response type to XML
    res.send(rawData);  // Send the raw XML data back as response

  } catch (error) {
    console.error("❌ Error in /nowplaying:", error.message);
    res.status(500).json({ error: `Failed to fetch data: ${error.message}` });
  }
});

// Start the server and listen on the provided port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
