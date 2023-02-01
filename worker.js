const throng = require("throng");
const Queue = require("bull");

// let ln = require("ln");
// ln.PIPE_BUF = 512; //Set it in byte unit and based on the ulimit -a.
// var log = new ln({ name: "a", appenders: appenders });
require("dotenv").config({ path: `.env`, override: true });
// Tools for lighthouse scrape

//log.e("ln"); //Android-like logging signature:
const axios = require("axios");
const puppeteer = require("puppeteer");
const lighthouse = require("lighthouse");
const { URL } = require("url");
const { format } = require("date-fns");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require('path');
// Connect to a local redis instance locally, and the Heroku-provided URL in production
let REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// Spin up multiple processes to handle jobs to take advantage of more CPU cores
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
let workers = process.env.WEB_CONCURRENCY || 2;

// The maximum number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
let maxJobsPerWorker = 5;
const JobProgress = {
  Completed: "completed",
  Failed: "failed",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function start() {
  // Connect to the named work queue
  let workQueue = new Queue("work", REDIS_URL);

  workQueue.process(maxJobsPerWorker, async (job) => {
    console.log("Job Starting: ", job.id);
    // This is an example job that just slowly reports on progress
    // while doing no work. Replace this with your own job logic.
    let progress = 0;

    var currEmail = job.data.email;
    var currURL = job.data.url;
    console.log("Job Parameters: ", job.id, " ", currEmail, currURL);
    // if (!currEmail || !currURL) {
    //   job.state = JobProgress.Failed;
    //   return;
    // }
    try {
      // Use Puppeteer to launch headful Chrome and don't use its default 800x600 viewport.
      const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      // Lighthouse will open the URL.
      // Puppeteer will observe `targetchanged` and inject our stylesheet.
      // job.progress(5);
      console.log("Job Lighthouse Started: ", job.id);
      const { lhr } = await lighthouse(currURL, {
        port: new URL(browser.wsEndpoint()).port,
        output: "json",
        logLevel: "info",
        chromeFlags: "ignore-certificate-errors",
      }, {
        extends: 'lighthouse:default',
        passes: [
          {
            passName: 'defaultPass',
            gatherers: [
              'custom-audits/gatherers/h1-elements',
              'custom-audits/gatherers/head-elements',
              'custom-audits/gatherers/content-elements',
            ]
          }
        ],
        settings: {
          onlyCategories: ['technical', 'content', 'experience', 'mobile'],
        },
        audits: [
          // Technical
          "is-on-https",
          "seo/robots-txt",
          "oopif-iframe-test-audit",
          "dobetterweb/uses-http2",
          "seo/http-status-code",
          "redirects",
          "seo/manual/structured-data",
          "dobetterweb/dom-size",
          "metrics/speed-index",
          "third-party-summary",
          "seo/canonical",
          "seo/is-crawlable",
          "seo/crawlable-anchors",
          "custom-audits/audits/meta-og-tags",
          "custom-audits/audits/link-to-http",
          "custom-audits/audits/url-length",
          "custom-audits/audits/url-underscore",
          "custom-audits/audits/url-dynamic-params",

          // Content
          "seo/meta-description",
          "accessibility/frame-title",
          "accessibility/document-title",
          "accessibility/heading-order",
          "custom-audits/audits/h1-tag",
          "custom-audits/audits/meta-description-length",
          "custom-audits/audits/meta-description-count",
          "custom-audits/audits/document-title-length",
          "custom-audits/audits/dead-end-page",
          "custom-audits/audits/unsafe-links",
          "custom-audits/audits/content-word-count",

          // Experience
          "unsized-images",
          "byte-efficiency/uses-optimized-images",
          "accessibility/image-alt",
          "accessibility/input-image-alt",
          "image-size-responsive",
          "byte-efficiency/uses-responsive-images",
          "image-aspect-ratio",

          // Mobile
          "seo/font-size",
          "viewport",
          "accessibility/meta-viewport",
          "content-width",
        ],
        categories: {
          technical: {
            title: 'Technical',
            description: '',
            auditRefs: [
              { id: 'is-on-https', weight: 1 },
              { id: 'robots-txt', weight: 1 },
              { id: 'oopif-iframe-test-audit', weight: 1 },
              { id: 'uses-http2', weight: 1 },
              { id: 'http-status-code', weight: 1 },
              { id: 'redirects', weight: 1 },
              { id: 'structured-data', weight: 0 },
              { id: 'dom-size', weight: 1 },
              { id: 'speed-index', weight: 1 },
              { id: 'third-party-summary', weight: 1 },
              { id: 'canonical', weight: 1 },
              { id: 'is-crawlable', weight: 1 },
              { id: 'crawlable-anchors', weight: 1 },
              { id: 'meta-og-tags', weight: 1 },
              { id: 'link-to-http', weight: 1 },
              { id: 'url-length', weight: 1 },
              { id: 'url-underscore', weight: 1 },
              { id: 'url-dynamic-params', weight: 1 },
            ]
          },
          content: {
            title: 'Content',
            description: '',
            auditRefs: [
              { id: 'meta-description', weight: 1 },
              { id: 'frame-title', weight: 1 },
              { id: 'document-title', weight: 1 },
              { id: 'heading-order', weight: 1 },
              { id: 'h1-tag', weight: 1 },
              { id: 'meta-description-length', weight: 1 },
              { id: 'meta-description-count', weight: 1 },
              { id: 'document-title-length', weight: 1 },
              { id: 'dead-end-page', weight: 1 },
              { id: 'unsafe-links', weight: 1 },
              { id: 'content-word-count', weight: 1 },
            ]
          },
          experience: {
            title: 'Experience',
            description: '',
            auditRefs: [
              { id: 'unsized-images', weight: 1 },
              { id: 'uses-optimized-images', weight: 1 },
              { id: 'image-alt', weight: 1 },
              { id: 'input-image-alt', weight: 1 },
              { id: 'image-size-responsive', weight: 1 },
              { id: 'uses-responsive-images', weight: 1 },
              { id: 'image-aspect-ratio', weight: 1 },
            ]
          },
          mobile: {
            title: 'Mobile',
            description: '',
            auditRefs: [
              { id: 'font-size', weight: 1 },
              { id: 'viewport', weight: 1 },
              { id: 'meta-viewport', weight: 1 },
              { id: 'content-width', weight: 1 }
            ]
          }
        }
      });
      var lighthouseScores = `${Object.values(lhr.categories)
        .map((c) => c.score)
        .join(", ")}`;
      console.log("Job Lighouse Done: ", job.id);
      // job.progress(25);
      //console.log("worker : ", lighthouseScores);
      //log.e("worker thread lighthouse done: ", lighthouseScores);

      var strapiData = {
        data: {
          date_created: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXX"),
          site_email: currEmail,
          site_url: currURL,
          seo_result: lighthouseScores,
          initial_email: true,
        },
      };
      var strapiHeaders = {
        headers: {
          Authorization: process.env.SEO_AUDIT_KEY,
        },
      };
      console.log("Job Creating PDF: ", job.id);
      // Create a new PDF document
      // job.progress(55);
      const doc = new PDFDocument();
      var fileName = generateRandomString(15) + ".pdf";
      // Add some text and a rectangle
      doc.text("SEO Scores for: " + currURL + "\n");
      doc.text(lighthouseScores);

      // Save the PDF to a file
      doc.pipe(fs.createWriteStream(__dirname + '/' + fileName));
      doc.end();
      console.log("__dirname: ", __dirname);
      console.log("Job PDF Done: ", job.id, fileName);
      // job.progress(75);
      // console.log("Posting to Strapi: ", job.id);
      var strapiMsg = "";
      const strapiResults = await axios
        .post(process.env.SEO_AUDIT_RESULTS_URL, strapiData, strapiHeaders)
        .then(function (response) {
          console.log(response.data);
          if (response.data) {
            strapiMsg = "posted to strapi: " + response.data.data.id + "\n";
            sendEmail(currEmail, currURL, fileName);
          } else {
          }
          //res.setHeader("Content-Type", "application/json");
          //res.json(`${strapiMsg}` + `:` + `${lighthouseScores}`);

          browser.close();
          job.progress(100);
          job.state = JobProgress.Completed;
          console.log("Job Done: ", job.id);
        })
        .catch(function (error) {
          console.log("strapi error ", error);
          job.progress = 1;
          job.state = JobProgress.Failed;
          throw new Error("strapi error ", error);
        });
    } catch (err) {
      console.log("worker error: ", err);
      //log.e("worker error: ", err);
      await browser.close();
      job.progress = 1;
      job.state = JobProgress.Failed;
      throw new Error("worker error: ", err);
    }

    // throw an error 5% of the time
    // if (Math.random() < 0.05) {
    //   throw new Error("This job failed!");
    // }

    // while (progress < 100) {
    //   await sleep(50);
    //   progress += 1;
    //   job.progress(progress);
    // }

    // A job can return values that will be stored in Redis as JSON
    // This return value is unused in this demo application.
    return { value: "This will be stored" };
  });
}

async function sendEmail(userEmail, userURL, pdf) {
  try {
    //let testAccount = await nodemailer.createTestAccount();
    // create reusable transporter object using the default SMTP transport

    let transporter = nodemailer.createTransport({
      pool: true,
      host: process.env.EMAIL_HOST, //smtp.ethereal.email
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
      },
    });

    //Verify connection
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"SEO Tools Wunderfauks" <seotest@wunderfauks.com>', // sender address
      to: userEmail + ", " + userEmail, // list of receivers
      subject: "Your SEO Results for " + userURL, // Subject line
      text: "Testing 123", // plain text body
      html: "<b>Testing 123</b>", // html body,
      attachments: [
        {
          filename: pdf,
          path: __dirname + '/' + pdf,
        },
      ],
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (error) {
    console.log(error);
  }
}

function generateRandomString(myLength) {
  const chars =
    "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
  const randomArray = Array.from(
    { length: myLength },
    (v, k) => chars[Math.floor(Math.random() * chars.length)]
  );

  const randomString = randomArray.join("");
  return randomString;
}

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({ workers, start });
