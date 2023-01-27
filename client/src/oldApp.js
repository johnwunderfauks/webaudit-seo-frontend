import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  // const [jobs, setJobs] = useState([]);

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  const [currURL, setURL] = useState("");
  const [currentEmail, setEmail] = useState("");
  useEffect(() => {});
  // Store for all of the jobs in progress
  let jobs = {};
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleURLChange = (event) => {
    setURL(event.target.value);
  };

  const handleClick = async () => {
    setData("");
    if (currentEmail.trim() === "" && currURL.trim() === "") {
      setErr("Please input email and url to receive your results");
      return;
    }
    // Check if nodejs is down ?
    setIsLoading(true);

    addJob(currentEmail, currURL);
  };

  // Kick off a new job by POST-ing to the server
  async function addJob() {
    const res = await fetch(
      `job/?email=${encodeURIComponent(currentEmail)}&url=${encodeURIComponent(
        currURL
      )}`,
      { method: "POST" }
    );
    const job = await res.json();
    jobs[job.id] = { id: job.id, state: "queued" };
    // setJobs({ id: job.id, state: "queued" });

    render();
  }

  // Fetch updates for each job
  async function updateJobs() {
    for (const id of Object.keys(jobs)) {
      const res = await fetch(`/job/${id}`);
      const result = await res.json();
      if (jobs[id]) {
        jobs[id] = result;
      }
      render();
    }
  }

  // Delete all stored jobs
  function clear() {
    // setJobs(null);
    jobs = [];
    render();
  }

  // Update the UI
  function render() {
    let s = "";
    for (const id of Object.keys(jobs)) {
      s += renderJob(jobs[id]);
    }

    // For demo simplicity this blows away all of the existing HTML and replaces it,
    // which is very inefficient. In a production app a library like React or Vue should
    // handle this work
    // document.querySelector("#job-summary").innerHTML = s;
    renderUI(s);
  }

  // Renders the HTML for each job object
  function renderJob(job) {
    let progress = job.progress || 0;
    let color = "bg-light-purple";

    if (job.state === "completed") {
      color = "bg-purple";
      progress = 100;
    } else if (job.state === "failed") {
      color = "bg-dark-red";
      progress = 100;
    }

    return (
      <div className="job-item">
        <div style={{ display: "inline-block" }}>{job.id}</div>
        <div style={{ display: "inline-block" }}>{job.progress}</div>
        <div style={{ display: "inline-block" }}>{job.state}</div>
      </div>
    );

    // return document
    //   .querySelector("#job-template")
    //   .innerHTML.replace("{{id}}", job.id)
    //   .replace("{{state}}", job.state)
    //   .replace("{{color}}", color)
    //   .replace("{{progress}}", progress);
  }

  // Attach click handlers and kick off background processes
  // window.onload = function () {
  //   document.querySelector("#add-job").addEventListener("click", addJob);
  //   document.querySelector("#clear").addEventListener("click", clear);

  //   setInterval(updateJobs, 200);
  // };

  function renderUI(s) {
    return (
      <div className="App">
        <header className="App-header">
          <p>{!isLoading ? "" : "Loading"}</p>
          <p>Current URL: {currURL}</p>
          {err && <p>Errors: {err}</p>}
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleEmailChange}
          />
          <label htmlFor="url">url</label>
          <input type="text" id="url" name="url" onChange={handleURLChange} />
          {data && <p>{data}</p>}
          <button onClick={handleClick}>Fetch data</button>
        </header>
        <div className="job-template">
          {s}
          {/* {jobs &&
            jobs.map((currJob) => (
              <div className="job-item">
                {currJob.id} - {currJob.status}
              </div>
            ))} */}
          {/* jobs.forEach((currJob) => {
               <div className="job-item">
                 {currJob.id} - {currJob.status}
               </div>;
             }
             )} */}
        </div>
      </div>
    );
  }

  return renderUI();
}
export default App;
