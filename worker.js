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
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      // Lighthouse will open the URL.
      // Puppeteer will observe `targetchanged` and inject our stylesheet.
      job.progress(5);
      console.log("Job Lighthouse Started: ", job.id);
      const { lhr } = await lighthouse(
        currURL,
        {
          port: new URL(browser.wsEndpoint()).port,
          output: "json",
          logLevel: "info",
          chromeFlags: "ignore-certificate-errors",
        },
        {
          extends: "lighthouse:default",
          passes: [
            {
              passName: "defaultPass",
              gatherers: [
                "custom-audits/gatherers/h1-elements",
                "custom-audits/gatherers/head-elements",
                "custom-audits/gatherers/content-elements",
                "custom-audits/gatherers/cssinline-element",
                "custom-audits/gatherers/cdn-tags",
                "custom-audits/gatherers/img-elements",
                "custom-audits/gatherers/deprecated-html-tags-element",
                "custom-audits/gatherers/keywords-elements",
                'custom-audits/gatherers/nested-table-elements',
                'custom-audits/gatherers/frameset-elements',
                'custom-audits/gatherers/ads-txt',
              ],
            },
          ],
          settings: {
            onlyCategories: [
              "common_seo",
              "speed",
              "security",
              "mobile",
              "advanced_seo",
            ],
          },
          audits: [
            // Common SEO
            "accessibility/document-title", // Meta Title test
            "custom-audits/audits/google-preview",
            "custom-audits/audits/most-common-keywords",
            "custom-audits/audits/keywords-cloud",
            "custom-audits/audits/keywords-usuage",
            "custom-audits/audits/related-keyword",
            "custom-audits/audits/competitor-domain",
            "custom-audits/audits/document-title-length",
            "seo/meta-description", // Meta Description test
            "custom-audits/audits/meta-description-length",
            "custom-audits/audits/meta-description-count",
            "custom-audits/audits/meta-og-tags", // Social Media Meta Tags test
            "accessibility/heading-order", // Headings Tags test
            "custom-audits/audits/h1-tag",
            "seo/robots-txt", // Robots.txt Test
            "custom-audits/audits/sitemap", // Sitemap test
            "accessibility/image-alt", // Image alt test
            "byte-efficiency/uses-responsive-images", // Responsive Image test
            "image-aspect-ratio", // Image Aspect Ratio test
            "custom-audits/audits/cssinline",
            "custom-audits/audits/deprecated-html-tags",
            "custom-audits/audits/backlink",
            "custom-audits/audits/seofriendly-url",
            "custom-audits/audits/ga-tag", // GA test
            "custom-audits/audits/favicon", // Favicon test
            "errors-in-console", // Console Errors test
            "dobetterweb/charset", // Charset Declaration test

            // Speed Optimizations
            "dobetterweb/dom-size", // DOM Size test
            "custom-audits/audits/html-compression", // HTML Compression/GZIP test
            "metrics/speed-index", // Site Loading Speed test
            'bootup-time', // JS Execution Time test
            'custom-audits/audits/page-cache', // Page Cache test
            'custom-audits/audits/cdn-usuage', // CDN Usage Test
            'custom-audits/audits/img-metadata', // Image MetaData Test
            'custom-audits/audits/flash-elements', // Flash test
            "byte-efficiency/modern-image-formats", // Modern Image Format test
            "custom-audits/audits/image-caching", // Image Caching test
            "custom-audits/audits/js-caching", // JS Caching test
            "custom-audits/audits/css-caching", // CSS Caching test
            "byte-efficiency/unminified-javascript", // JavaScript Minification test
            "byte-efficiency/unminified-css", // CSS Minification test
            "byte-efficiency/render-blocking-resources", // Render Blocking Resources test
            "dobetterweb/doctype", // Doctype test
            "redirects", // Redirects test
            "metrics/largest-contentful-paint", // Largest Contentful Paint test
            "metrics/cumulative-layout-shift", // Cumulative Layout Shift test
            "custom-audits/audits/nested-tables", // Nested Tables test
            "custom-audits/audits/frameset-elements", // Frameset test

            // Security
            "is-on-https", // SSL Checker and HTTPS test
            "dobetterweb/uses-http2", // HTTP2 test
            "custom-audits/audits/unsafe-links", // Unsafe Cross-Origin Links test
            "custom-audits/audits/mixed-content", // Mixed Content test

            // Mobile
            "accessibility/meta-viewport", // Meta Viewport test
            "custom-audits/audits/media-query-responsive", // Media Query Responsive test

            // Advanced SEO
            "custom-audits/audits/custom-404-page", // Custom 404 Error Page test
            "seo/is-crawlable", // Noindex Tag test
            "seo/canonical", // Canonical Tag test
            "seo/crawlable-anchors", // Nofollow Tag test
            "accessibility/meta-refresh", // Meta Refresh test
            "custom-audits/audits/disallow-directive", // Disallow Directive test
            "custom-audits/audits/ads-txt", // Ads.txt Validation test
            "custom-audits/audits/spf-records", // SPF Records test
          ],
          categories: {
            common_seo: {
              title: "Common SEO",
              description: "",
              auditRefs: [
                { id: "document-title", weight: 1 }, // Meta Title test
                { id: "google-preview", weight: 1 },
                { id: "most-common-keywords", weight: 1 },
                { id: "keywords-cloud", weight: 1 },
                { id: "keywords-usuage", weight: 1 },
                { id: "related-keyword", weight: 1 },
                { id: "competitor-domain", weight: 1 },
                { id: "document-title-length", weight: 1 },
                { id: "meta-description", weight: 1 }, // Meta Description test
                { id: "meta-description-length", weight: 1 },
                { id: "meta-description-count", weight: 1 },
                { id: "meta-og-tags", weight: 1 }, // Social Media Meta Tags test
                { id: "heading-order", weight: 1 }, // Headings Tags test
                { id: "h1-tag", weight: 1 },
                { id: "robots-txt", weight: 1 }, // Robots.txt Test
                { id: "sitemap", weight: 1 }, // Sitemap Test
                { id: "image-alt", weight: 1 }, // Image alt test
                { id: "css-inline", weight: 1 },
                { id: "backlink", weight: 1 },
                { id: "seo-friendly-url", weight: 1 },
                { id: "deprecated-html-tags", weight: 1 },
                { id: "uses-responsive-images", weight: 1 }, // Responsive Image test
                { id: "image-aspect-ratio", weight: 1 }, // Image Aspect Ratio test
                { id: "ga-tag", weight: 1 }, // GA test
                { id: "favicon", weight: 1 }, // Favicon test
                { id: "errors-in-console", weight: 1 }, // Console Errors test
                { id: "charset", weight: 1 }, // Charset Declaration test
              ],
            },
            speed: {
              title: "Speed Optimizations",
              description: "",
              auditRefs: [
                { id: 'dom-size', weight: 1 }, // DOM Size test
                { id: 'html-compression', weight: 1 }, // HTML Compression/GZIP test
                { id: 'speed-index', weight: 1 }, // Site Loading Speed test
                { id: 'bootup-time', weight: 1 }, // JS Execution Time test
                { id: 'page-cache', weight: 1 }, // Page Cache test
                { id: 'flash-elements', weight: 1 }, // Flash test
                { id: "cdn-usuage", weight: 1 }, // CDN Usage Test
                { id: "img-metadata", weight: 1 }, // Image MetaData Test
                { id: 'modern-image-formats', weight: 1 }, // Modern Image Format test
                { id: 'image-caching', weight: 1 }, // Image Caching test
                { id: 'js-caching', weight: 1 }, // JS Caching test
                { id: 'css-caching', weight: 1 }, // CSS Caching test
                { id: 'unminified-javascript', weight: 1 }, // JavaScript Minification test
                { id: 'unminified-css', weight: 1 }, // CSS Minification test
                { id: 'render-blocking-resources', weight: 1 }, // Render Blocking Resources test
                { id: 'doctype', weight: 1 }, // Doctype test
                { id: 'redirects', weight: 1 }, // Redirects test
                { id: 'largest-contentful-paint', weight: 1 }, // Largest Contentful Paint test
                { id: 'cumulative-layout-shift', weight: 1 }, // Cumulative Layout Shift test
                { id: 'nested-tables', weight: 1 }, // Nested Tables test
                { id: 'frameset-elements', weight: 1 }, // Frameset test
              ],
            },
            security: {
              title: "Security",
              description: "",
              auditRefs: [
                { id: 'is-on-https', weight: 1 }, // SSL Checker and HTTPS test
                { id: 'uses-http2', weight: 1 }, // HTTP2 test
                { id: 'unsafe-links', weight: 1 }, // Unsafe Cross-Origin Links test
                { id: 'mixed-content', weight: 1 }, // Mixed Content test
              ],
            },
            mobile: {
              title: "Mobile",
              description: "",
              auditRefs: [
                { id: 'meta-viewport', weight: 1 }, // Meta Viewport test
                { id: 'media-query-responsive', weight: 1 }, // Media Query Responsive test
              ],
            },
            advanced_seo: {
              title: "Advanced SEO",
              description: "",
              auditRefs: [
                { id: 'custom-404-page', weight: 1 }, // Custom 404 Error Page test
                { id: 'is-crawlable', weight: 1 }, // Noindex Tag test
                { id: 'canonical', weight: 1 }, // Canonical Tag test
                { id: 'crawlable-anchors', weight: 1 }, // Nofollow Tag test
                { id: 'meta-refresh', weight: 1 }, // Meta Refresh test
                { id: 'disallow-directive', weight: 1 }, // Disallow Directive test
                { id: 'ads-txt', weight: 1 }, // Ads.txt Validation test
                { id: 'spf-records', weight: 1 }, // SPF Records test
              ],
            },
          },
        }
      );
      // var lighthouseScores = `${Object.values(lhr.categories)
      //   .map((c) => c.score)
      //   .join(", ")}`;

      var lighthouseScores = Object.values(lhr.categories).map((c) => {
        var audits = c.auditRefs.map((audit) => lhr.audits[audit.id]);

        return {
          id: c.title,
          score: c.score,
          audits: audits,
        };
      });
      console.log("Job Lighouse Done: ", job.id);
      job.progress(25);
      //console.log("worker : ", lighthouseScores);
      //log.e("worker thread lighthouse done: ", lighthouseScores);

      var strapiData = {
        data: {
          date_created: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXX"),
          site_email: currEmail,
          site_url: currURL,
          seo_result: JSON.stringify(lighthouseScores),
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
      job.progress(55);
      const doc = new PDFDocument();
      var fileName = generateRandomString(15) + ".pdf";
      // Add some text and a rectangle
      doc.fontSize(14);
      doc.text(`SEO Scores for: ${currURL}`);
      // doc.text(lighthouseScores);
      doc.fontSize(11);
      Object.values(lhr.categories).map((c) => {
        doc.moveDown();

        if (c.title !== "google-preview") {
          doc.text(`${c.title}: ${c.score}`, {
            underline: true,
          });
        }

        c.auditRefs.map((audit) => {
          doc.moveDown();
          if (audit.id === "google-preview") {
            doc
              .fillColor("blue")
              .text(lhr.audits[audit.id]?.details?.items[0]?.url, {
                link: lhr.audits[audit.id]?.details?.items[0]?.url,
                underline: true,
              });
            doc
              .fillColor("black")
              .text(
                `${
                  lhr.audits[audit.id].details?.items[0].title?.textContent
                }\n${
                  lhr.audits[audit.id]?.details.items[0]?.description?.content
                }`
              );
            doc.moveDown();
          }
          else if (audit.id === "errors-in-console") {
            // Js Error Test
            doc.fillColor("black").text("Javascript Error Test");
            lhr.audits[audit.id].details.items.map((item) => {
              if (item.source === "javascript" || item.source === "exception") {
                doc.fillColor("black").text(item.description);
              }
            });
          }
          else if (
            audit.id === "most-common-keywords" ||
            audit.id === "keywords-cloud"
          ) {
            doc
              .fillColor("black")
              .text(
                audit.id === "most-common-keywords"
                  ? "Most Common Keywords Test"
                  : "Keywords Cloud Test"
              );
            lhr.audits[audit.id]?.details?.items.map((item) => {
              doc.fillColor("black").text(`${item.name} - ${item.count}`);
            });
          }
          else if (audit.id === "keywords-usuage") {
            doc.fillColor("black").text("Keywords Usuage Test");
            lhr.audits[audit.id]?.details?.items.map((item) => {
              doc.fillColor("black").text(`${item.name}`, { underline: true });
              doc.fillColor("black").text(`title - ${item.titleSearch}`);
              doc
                .fillColor("black")
                .text(`description - ${item.descriptionSearch}`);
              doc.fillColor("black").text(`Headings - ${item.headingSearch}`);
            });
          }
          else if (audit.id === "related-keyword") {
            doc.fillColor("black").text("Related Keywords Test");
            lhr.audits[audit.id]?.details?.items.map((item) => {
              doc.fillColor("blue").text(item.content, {
                link: item.link,
              });
            });
            doc.moveDown();
          }
          else if (audit.id === "competitor-domain") {
            doc.fillColor("black").text("Competitor Domain Test");
            lhr.audits[audit.id]?.details?.items.map((item) => {
              let competitorUrl = item.link
              competitorUrl = competitorUrl.slice(0, competitorUrl.lastIndexOf('/')).replace(/\/\/|.+\/\//, '').replace("www.", "")
              doc.fillColor("blue").text(competitorUrl, {
                link: item.link,
              });
            });
            doc.moveDown();
          }
          else if (audit.id === "meta-og-tags") {
            doc.fillColor("black").text("Social Media Meta Tags Test");
            lhr.audits[audit.id]?.details?.items.map((item) => {
              doc
                .fillColor("black")
                .text(
                  `${item.property} - ${item.content ? item.content : "null"}`
                );
            });
          }
          else {
            doc
              .fillColor("black")
              .text(
                `${audit.id}: ${lhr.audits[audit.id].score}\n${
                  lhr.audits[audit.id].title
                }`
              );
          }
        });

        doc.moveDown();
      });

      // Save the PDF to a file
      doc.pipe(fs.createWriteStream(__dirname + "/uploads/" + fileName));
      doc.end();
      console.log("Job PDF Done: ", job.id, fileName);
      job.progress(75);
      console.log("Posting to Strapi: ", job.id);
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
          path: __dirname + "/uploads/" + pdf,
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
