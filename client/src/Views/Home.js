import React, { useState } from "react";
import {
  Grid,
  Typography,
  Box,
  TextField,
  Paper,
  FormControl,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Living_Room from "../assets/Living_Room.svg";

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

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    let gotError = false;
    const errorObject = {
      emailError: false,
      urlError: false,
    };
    const regexEmail =
      // eslint-disable-next-line no-useless-escape
      /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;

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
      return;
    }
    gotError = false;
    setError({ ...error, emailError: false, urlError: false });
    setSubmit(true);

    const res = await fetch(
      `job/?email=${formData.email}&url=${formData.url}`,
      { method: "POST" }
    );
    const job = await res.json();

    setSubmit(false);
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
                <FormControl fullWidth>
                  <TextField
                    name="email"
                    error={error.emailError}
                    placeholder="Your E-mail Address"
                    sx={{ marginBottom: 3 }}
                    helperText={error.emailError && "Enter a valid email"}
                    onChange={handleChangeForm}
                  />
                  <TextField
                    placeholder="URL"
                    name="url"
                    onChange={handleChangeForm}
                    error={error.urlError}
                    helperText={error.urlError && "Required Field."}
                  />
                  <LoadingButton
                    loading={submit}
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
                  </LoadingButton>
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
