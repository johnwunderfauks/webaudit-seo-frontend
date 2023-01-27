require("dotenv").config({ path: `.env`, override: true });
const express = require("express");
const Queue = require("bull");
const path = require("path");
const cors = require("cors");
const { currentLineHeight } = require("pdfkit");
// Serve on PORT on Heroku and on localhost:5000 locally
let PORT = process.env.PORT || "5000";
// Connect to a local redis intance locally, and the Heroku-provided URL in production
let REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const app = express();
app.use(cors());

// Create / Connect to a named work queue
let workQueue = new Queue("work", REDIS_URL);

// Serve the two static assets
// app.get("/", (req, res) => res.sendFile("index.html", { root: __dirname }));
// app.get("/client.js", (req, res) =>
//   res.sendFile("client.js", { root: __dirname })
// );
//app.use("/", express.static(path.dirname(__dirname) + "/client/build"));

app.get("/", (req, res) =>
  res.sendFile("/client/build/index.html", {
    root: __dirname,
  })
);
app.use("/static", express.static(__dirname + "/client/build/static"));
app.post("/api/getresults", async (req, res) => {});

// Kick off a new job by adding it to the work queue
app.post("/job", async (req, res) => {
  // This would be where you could pass arguments to the job
  // Ex: workQueue.add({ url: 'https://www.heroku.com' })
  // Docs: https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueadd
  var currURL = "-1";
  var currEmail = "-1";

  if (req.query.url) {
    currURL = req.query.url;
  }
  if (req.query.email) {
    currEmail = req.query.email;
  }
  console.log("worker api request starting on:", currURL, currEmail);

  if (currURL && currEmail) {
    let job = await workQueue.add({ email: "" + currEmail, url: "" + currURL });
    // job.email = currEmail;
    // job.url = currURL;
    //res.json({ id: job.id, email: currEmail, url: currURL });
    res.json({ id: job });
  }
});

// Allows the client to query the state of a background job
app.get("/job/:id", async (req, res) => {
  let id = req.params.id;
  let job = await workQueue.getJob(id);

  if (job === null) {
    res.status(404).end();
  } else {
    let state = await job.getState();
    let progress = job._progress;
    let reason = job.failedReason;
    console.log(reason)
    res.json({ id, state, progress, reason });
  }
});

// You can listen to global events to get notified when jobs are processed
workQueue.on("global:completed", (jobId, result) => {
  console.log(`Job completed with result ${result}`);
});

app.listen(PORT, () => console.log("Server started!"));
