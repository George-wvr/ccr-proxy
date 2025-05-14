import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors()); // Allow requests from any origin

const port = process.env.PORT || 3000;

//Main landing page information
app.get("/", (req, res) => {
  res.send("<h1>Chelmsford Community Radio Proxy Server (ccr-proxy)</h1><br><p>Welcome to the CCR proxy server. This server provides information about Chelmsford Community Radio</p><p>Add /nowplaying to the URL to access information about the stream");
});

// the /nowplaying page (SHOUTcast request)
app.get("/nowplaying", async (req, res) => {
  try {
    //main server data url
    const url = "https://cast3.asurahosting.com/proxy/chelmsfo/stats?sid=1&mode=json";
    
    // Make the request to SHOUTcast API
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Failed to fetch station information from SHOUTcast: ${response.status} ${response.statusText}`);
      return res.status(500).json({ error: `Upstream fetch failed: ${response.statusText}` });
    }

    // Get raw XML data
    const rawData = await response.text();
    console.log("Raw SHOUTcast XML for Chelmsford Community Radio:", rawData);  // Log the raw XML to the console
    
    // Return the raw XML as the response (just for debugging)
    res.type('text/xml');  // Set the response type to XML
    res.send(rawData);  // Send the raw XML data back as response

  } catch (error) {
    console.error("Error in /nowplaying:", error.message);
    res.status(500).json({ error: `Failed to fetch data: ${error.message}` });
  }
});

// Start the server and listen on the provided port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
