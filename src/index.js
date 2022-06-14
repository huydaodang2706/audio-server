const express = require("express");
const path = require("path");
const fs = require('fs');
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const httpLogger = require("http-logger");
require("dotenv").config();
const { PORT } = require("./configs");

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(httpLogger());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/audios/:type/:sourceId/:audioId/:audioName", (req, res) => {
  const filePath = path.join(
    __dirname,
    "..",
    "assets",
    req.params.type,
    req.params.sourceId,
    req.params.audioId,
    req.params.audioName
  );
  const { start, end } = req.query;
  const fileSize = fs.statSync(filePath).size;
  console.log(`request part of audio from ${start}:${end}`);
  if (start && end) {
    console.log(`request part of audio from ${start}:${end}`);
  } else {
    const range = req.headers.range;
    if (range) {
      console.log("Request range ne");
      const parts = range.replace(/bytes=/, "").split("-");
      
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      
      const file = fs.createReadStream(filePath, { start, end });
      
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "audio/wav",
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      console.log("Request no range ne");
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "audio/wav",
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  }
});

app.get('/hello-world', (req, res) => {
  return res.send({status: 1, result: 'Hello World'});
});

app.listen(8081, () => {
  console.log(`Server is running on port 8081`);
  console.log(path.join(__dirname, "assets"));
});
