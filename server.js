app.get("/nowplaying", async (req, res) => {
  try {
    const url = "https://cast3.asurahosting.com/proxy/chelmsfo/stats?sid=1&mode=json";
    const response = await fetch(url);
    const data = await response.json();

    console.log("Incoming stats:", data);

    const song = data.songtitle || data.icestats?.source?.title || "Song not found";
    res.json({ song });
  } catch (error) {
    console.error("Error fetching now playing:", error);
    res.status(500).json({ error: "Failed to fetch now playing info" });
  }
});
