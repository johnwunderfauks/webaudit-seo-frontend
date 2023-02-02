import { ThemeProvider } from "@mui/material";
import React from "react";
import Navigation from "./components/Navigation";
import theme from "./theme";
import Home from "./Views/Home/Home";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Navigation>
        <Home />
      </Navigation>
    </ThemeProvider>
  );
}

export default App;
