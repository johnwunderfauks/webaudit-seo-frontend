import { ThemeProvider } from "@mui/material";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import theme from "./theme";
import Home from "./Views/Home/Home";
import NotFound from "./Views/NotFound";
import Page from "./Views/Page/Page";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Navigation>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/page/:id" element={<Page />}/>
          <Route exact path="*" element={<NotFound />}/>
        </Routes>
      </Navigation>
    </ThemeProvider>
  );
}

export default App;
