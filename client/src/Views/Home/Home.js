import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  Typography,
  Box,
  TextField,
  Paper,
  FormControl,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import Living_Room from "../../assets/Living_Room.svg";

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="textWhiteColor">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

function Home() {
  const [submit, setSubmit] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    url: "",
  });
  const [error, setError] = useState({
    emailError: false,
    urlError: false,
  });
  const [jobs, setJobs] = useState({});
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const intervalRef = useRef(null);

  const regexEmail =
    /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;
  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const emailValidation = () => {
    if (!regexEmail.test(formData.email)) {
      setError({ ...error, emailError: true });
    } else {
      setError({ ...error, emailError: false });
    }
  };

  const urlValidation = () => {
    if (formData.url.trim() === "") {
      setError({ ...error, urlError: true });
    } else {
      setError({ ...error, urlError: false });
    }
  };

  useEffect(() => {
    if (progress >= 100) {
      clearInterval(intervalRef.current);
      setMessage("Success");
      intervalRef.current = null;
      setSubmit(false);
      setProgress(0);
    }
  }, [progress]);

  const updateJob = async (data) => {
    if (jobs) {
      const res = await fetch(`job/${data.id}`);
      const result = await res.json();
      setJobs(jobs);
      setProgress(result.progress);
    }
  };

  const handleSubmit = async () => {
    let gotError = false;
    setMessage("");
    setProgress(0);
    const errorObject = {
      emailError: false,
      urlError: false,
    };

    if (!regexEmail.test(formData.email)) {
      gotError = true;
      errorObject.emailError = true;
    }
    if (formData.url.trim() === "") {
      gotError = true;
      errorObject.urlError = true;
    }
    if (gotError) {
      setError({ ...errorObject });
      gotError = false;
      return;
    }
    gotError = false;
    setError({ ...error, emailError: false, urlError: false });
    setSubmit(true);

    const res = await fetch(
      `job/?email=${encodeURIComponent(
        formData.email
      )}&url=${encodeURIComponent(formData.url)}`,
      { method: "POST" }
    );
    const job = await res.json();
    const data = { id: job.id.id, state: "queued", progress: job.id.progress };
    setJobs({ id: job.id.id, state: "queued", progress: job.id.progress });
    intervalRef.current = setInterval(() => {
      updateJob(data);
    }, 1000);
  };
  return (
    <>
      {/* Landing Page */}
      <Box
        sx={{
          paddingTop: "5rem",
          marginBottom: 10,
        }}
      >
        <Grid container>
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                maxWidth: "32rem",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: "2.25rem",
                  fontWeight: 700,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Welcome!
              </Typography>
              <Paper elevation={2} sx={{ padding: 3, marginTop: 3 }}>
                {message && (
                  <Snackbar
                    open={message}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                  >
                    <Alert
                      severity="error"
                      onClose={() => {
                        setMessage("");
                      }}
                    >
                      Success
                    </Alert>
                  </Snackbar>
                )}
                <FormControl fullWidth>
                  <TextField
                    name="email"
                    error={error.emailError}
                    placeholder="Your E-mail Address"
                    sx={{ marginBottom: error.emailError ? 1 : 3 }}
                    helperText={error.emailError && "Enter a valid email"}
                    onChange={handleChangeForm}
                    onBlur={emailValidation}
                    data-testid="form-field-email"
                  />
                  <TextField
                    placeholder="URL"
                    name="url"
                    onChange={handleChangeForm}
                    error={error.urlError}
                    helperText={error.urlError && "Required Field."}
                    onBlur={urlValidation}
                    data-testid="form-field-url"
                  />
                  {!submit && (
                    <Button
                      // loading={submit}
                      type="submit"
                      variant="contained"
                      sx={{
                        borderRadius: 99999,
                        width: "100%",
                        paddingTop: "1rem",
                        paddingBottom: "1rem",
                        fontWeight: 700,
                        textTransform: "none",
                        fontSize: 16,
                        marginTop: 2,
                      }}
                      onClick={handleSubmit}
                    >
                      Add data
                    </Button>
                  )}
                  {submit && (
                    <Box
                      alignItems="center"
                      display="flex"
                      justifyContent="center"
                      mt={2}
                    >
                      <CircularProgressWithLabel value={progress} />
                    </Box>
                  )}
                </FormControl>
              </Paper>
            </Box>
          </Grid>
          <Grid item sm={12} md={1} />
          <Grid item sm={12} md={6}>
            <Box
              sx={{
                maxWidth: { xs: "32rem", lg: "100%" },
                height: "100%",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <img
                src={Living_Room}
                alt="landing"
                width="500px"
                height="800px"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Home;
