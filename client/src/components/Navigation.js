import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Link,
} from "@mui/material/";

function Navigation(props) {
  return (
    <div style={{ maxWidth: 1280, marginLeft: "auto", marginRight: "auto" }}>
      <AppBar
        position="static"
        component="nav"
        color="transparent"
        sx={{
          boxShadow: "none",
          padding: { sm: 0 },
          paddingLeft: { xs: "24px" },
          paddingTop: { xs: "11px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              display: { sm: "none" },
              fontWeight: 900,
              fontSize: 26,
              color: "textDarkColor",
              cursor: "pointer",
            }}
          >
            WebAudit
          </Typography>
        </Box>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Link
              href="#"
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                display: { xs: "none", sm: "block" },
                fontWeight: 900,
                fontSize: 26,
                color: "textDarkColor",
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              WebAudit
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ paddingX: { xs: "24px" } }}>{props.children}</Box>
    </div>
  );
}

export default Navigation;
