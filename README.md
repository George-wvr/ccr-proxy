# 📡 CCR Proxy Server

A simple Express-based proxy API that connects to [Chelmsford Community Radio’s (CCR)](https://www.chelmsfordcommunityradio.com/) streaming system to retrieve current broadcast data — including stream stats, now-playing info, and current show metadata. It simplifies frontend access to the SHOUTcast API and adds extra info like show titles and presenters.

---

## 🎯 Features

- 🔊 Now Playing info (current song, listeners, uptime) 
- 🧑‍🤝‍🧑 Current show and presenter details

---

## 🌐URL

https://ccr-proxy.onrender.com

---

## 🚀 API Endpoints

### `GET /nowplaying`
Returns streaming and playback info.

**Sample response:**
```xml
<SHOUTCASTSERVER>
<CURRENTLISTENERS>6</CURRENTLISTENERS>
<PEAKLISTENERS>29</PEAKLISTENERS>
<MAXLISTENERS>99999</MAXLISTENERS>
<UNIQUELISTENERS>6</UNIQUELISTENERS>
<AVERAGETIME>65803</AVERAGETIME>
<SERVERGENRE>Misc</SERVERGENRE>
<SERVERGENRE2/>
<SERVERGENRE3/>
<SERVERGENRE4/>
<SERVERGENRE5/>
<SERVERURL/>
<SERVERTITLE>No Name</SERVERTITLE>
<SONGTITLE>Hallelujah Day by The Jackson Five</SONGTITLE>
<STREAMHITS>18423</STREAMHITS>
<STREAMSTATUS>1</STREAMSTATUS>
<BACKUPSTATUS>0</BACKUPSTATUS>
<STREAMLISTED>0</STREAMLISTED>
<STREAMLISTEDERROR>0</STREAMLISTEDERROR>
<STREAMPATH>/stream</STREAMPATH>
<STREAMUPTIME>246282</STREAMUPTIME>
<BITRATE>128</BITRATE>
<SAMPLERATE>44100</SAMPLERATE>
<CONTENT>audio/mpeg</CONTENT>
<VERSION>2.6.1.777 (posix(linux x64))</VERSION>
</SHOUTCASTSERVER>
```

### `GET /currentshow`
Returns currently airing show and presenter(s).

**Sample response:**
```json
{
  "title": "The CCR Dance Party",
  "presenters": ["George Weaver"]
}
```

## 🏗️ Deployment
Currently hosted on Render. Can be deployed on any Node.js-friendly platform (Vercel, Railway, etc).

## 💡 Motivation
Built to learn Express and backend APIs while contributing to CCR’s digital projects. Intended for reuse in future CCR web and mobile apps.

## 🙌 Acknowledgements
Chelmsford Community Radio
SHOUTcast streaming API

## 🔮 Future Development
- 📄 Changing the format of /nowplaying from XML to JSON for easier handling.
- 📻 Completing the weekly schedule

## 📬 Contact
Questions or contributions? Open an issue or get in touch!
