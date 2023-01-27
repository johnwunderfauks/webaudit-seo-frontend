import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: ["Poppins", "cursive"].join(","),
  },
  palette: {
    primary: {
      main: "#6415FF",
    },
    textDarkColor: "#243E63",
  },
});

export default theme;
