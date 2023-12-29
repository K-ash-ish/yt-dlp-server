const express = require("express");
const { exec, spawn } = require("child_process");
const os = require("os");
const path = require("path");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  console.log(os.hostname());
  console.log(os.platform());
  console.log(os.type());
  res.send("Hello world");
  ``;
});

app.get("/yt-dlp", (req, res) => {
  const { url } = req.query;
  const ytDlpPath = path.join(__dirname, "resources", "yt-dlp");

  let command = `${ytDlpPath} -f bv*[ext=mp4]+ba/b -o - ${url}`;
  console.log("path: ", ytDlpPath);
  console.log("command: ", command);
  const ls = spawn(command, [], { shell: true });

  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Disposition", `attachment; filename="video.mp4"`);

  ls.stdout.on("data", (data) => {
    console.log(data.toString());
    res.write(data);
  });

  ls.stderr.on("error", (data) => {
    console.error("err: ", data.toString());
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
