app.get("/nowplaying", async (req, res) => {
  try {
    const url = "https://cast3.asurahosting.com/proxy/chelmsfo/stats?sid=1&mode=json";
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Failed to fetch from SHOUTcast:", response.status);
      return res.status(500).json({ error: "Upstream fetch failed" });
    }

    const data = await response.json();

    console.log("Raw SHOUTcast data:", JSON.stringify(data, null, 2));

    const song = data.songtitle || data.icestats?.source?.title || "Song not found";
    res.json({ song });

  } catch (error) {
    console.error("Error in /nowplaying:", error.message);
    res.status(500).json({ error: "Failed to fetch now playing info" });
  }
});
