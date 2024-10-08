const express = require("express");
const { exec, spawn } = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  const ytDlpPath = path.join(__dirname, "resources", "yt-dlp_linux");
  console.log(os.hostname());
  console.log(os.platform());
  console.log(os.type());
  res.send("Video Downloader");

  fs.chmodSync(ytDlpPath, 0o755);
  fs.stat(ytDlpPath, (err, stats) => {
    if (err) {
      console.error(`Error checking file permissions: ${err.message}`);
    } else {
      const mode = stats.mode & 0o777; // Extract the permission bits
      console.log(`File permissions for yt-dlp: ${mode.toString(8)}`);

      // Check if execute permission is granted
      const executePermission = Boolean(mode & 0o111); // Check the execute bit
      if (executePermission) {
        console.log("Execute permission is granted.");
      } else {
        console.log("Execute permission is not granted.");
      }
    }
  });
});

app.get("/yt-dlp", (req, res) => {
  const { url } = req.query;
  const ytDlpPath = path.join(__dirname, "resources", "yt-dlp_linux");

  // let command = `${ytDlpPath} -f bv*[ext=mp4]+ba/b -o - ${url}`;

  const ls = spawn(ytDlpPath, ["-o", "-", url], { shell: true });

  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Disposition", `attachment; filename="video.mp4"`);

  ls.stdout.on("data", (data) => {
    res.write(data);
  });

  ls.stderr.on("error", (data) => {
    console.error("err: ", data);
    // res.end();
  });
  ls.on("close", (code) => {
    res.end();
    console.log(`child process exited with code ${code}`);
  });
});

app.listen(PORT, () => {
  console.log("Server started at port, ", PORT);
});
