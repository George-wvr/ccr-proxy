import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import { schedule } from './schedule.js';
import { DateTime } from 'luxon';
import fs from 'fs';
import bodyParser from 'body-parser';
import { parseStringPromise } from 'xml2js';

const app = express();
app.use(cors());

// Allow XML POSTs
app.use(bodyParser.text({ type: 'application/xml' }));

const port = process.env.PORT || 3000;
const DATA_FILE = 'nowplaying.json';

// --- Load any saved track data on startup ---
let nowPlaying = {};
if (fs.existsSync(DATA_FILE)) {
  try {
    const saved = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    nowPlaying = saved;
    console.log('Loaded saved nowPlaying:', nowPlaying);
  } catch (err) {
    console.error('Error reading saved data:', err);
  }
}

// Root endpoint with HTML info
app.get("/", (req, res) => {
  res.send("<h1>Chelmsford Community Radio Proxy Server (ccr-proxy)</h1><br><p>Welcome to the CCR proxy server. This server provides information about Chelmsford Community Radio</p><p>Add <a href='/nowplaying'>/nowplaying</a> Is being DEPRICATED on 01/09/2025 in XML format to use JSON. This will also provide more accurate song information. Use /api/nowplaying untill then to test the JSON formats</p><p>Add <a href='/api/nowplaying'>/api/nowplaying</a> to get the latest pushed track info in JSON format until 01/09/2025 (Use for testing ONLY, this will be deprecated after 01/09/2025)</p><p>Add <a href='/currentshow'>/currentshow</a> to get the current show and presenter(s)</p><p>For full documentation please see the <a href='https://george-wvr.github.io/website/ccr-proxy.html'>Documentation</a></p>");
});

// Shoutcast now playing endpoint (to be deprecated) uses XML
app.get("/nowplaying", async (req, res) => {
  try {
    const url = "https://cast3.asurahosting.com/proxy/chelmsfo/stats?sid=1&mode=json";
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Failed to fetch station information from SHOUTcast: ${response.status} ${response.statusText}`);
      return res.status(500).json({ error: `Upstream fetch failed: ${response.statusText}` });
    }

    const rawData = await response.text();
    console.log("Raw SHOUTcast XML for Chelmsford Community Radio:", rawData);

    res.type('text/xml');
    res.send(rawData);

  } catch (error) {
    console.error("Error in /nowplaying:", error.message);
    res.status(500).json({ error: `Failed to fetch data: ${error.message}` });
  }
});

// get current show and presenters
app.get('/currentshow', (req, res) => {
  const now = DateTime.now().setZone('Europe/London');
  const currentDay = now.toFormat('EEEE');
  const currentTime = now.toFormat('HH:mm');

  const currentShow = schedule.find(show =>
    show.day === currentDay &&
    show.start <= currentTime &&
    show.end > currentTime
  );

  if (currentShow) {
    res.json({
      title: currentShow.title,
      presenters: currentShow.presenters
    });
  } else {
    res.json({ title: "No scheduled show", presenters: [] });
  }
});

// POST endpoint for playout system to push now playing info in XML
app.post('/api/nowplaying', async (req, res) => {
  try {
    const xml = req.body;
    const result = await parseStringPromise(xml);

    // Extract relevant fields
    const artist = result?.track?.artist?.[0] || "";
    const title = result?.track?.title?.[0] || "";
    const show = result?.track?.show?.[0] || "";

    // Update nowPlaying object
    const updated = {
      previous: nowPlaying.current || null,
      current: {
        artist,
        title,
        show,
        timestamp: new Date().toISOString()
      }
    };

    nowPlaying = updated;

    // Save to file
    fs.writeFileSync(DATA_FILE, JSON.stringify(nowPlaying, null, 2));
    console.log("Now playing updated:", nowPlaying);

    res.status(200).send("OK");
    
    //error handling
  } catch (err) {
    console.error("Error parsing XML:", err);
    res.status(400).send("Bad XML");
  }
});

// GET endpoint to retrieve now playing info in JSON
app.get('/api/nowplaying', (req, res) => {
  res.json(nowPlaying);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
