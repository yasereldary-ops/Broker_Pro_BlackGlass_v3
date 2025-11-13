import https from "https";
import fs from "fs";
import next from "next";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const options = {
  key: fs.readFileSync(path.resolve(__dirname, "./brokerpro.local-key.pem")),
  cert: fs.readFileSync(path.resolve(__dirname, "./brokerpro.local.pem")),
};

app.prepare().then(() => {
  const server = express();
  server.all("*", (req, res) => handle(req, res));

  https.createServer(options, server).listen(3000, (err) => {
    if (err) throw err;
    console.log("✅ Secure Broker Pro running at: https://brokerpro.local:3000");
  });
});
