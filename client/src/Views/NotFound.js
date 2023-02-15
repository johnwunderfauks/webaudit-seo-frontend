import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const NotFound = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="75vh"
    >
      <Typography variant="h1" component="h3">
        Something went wrong.
      </Typography>
    </Box>
  );
};

export default NotFound;
