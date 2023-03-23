import React, { useState } from "react";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Link,
  Button,
} from "@mui/material/";
import DragHandleIcon from "@mui/icons-material/DragHandle";

const navItems = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Blogs",
    url: "/blog-list",
  },
];

function Navigation(props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((prevState) => !prevState);  

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Camp
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) =>
          item.name === "Get Started" ? (
            <Button
              key={item}
              disablePadding
              onClick={() => setOpenModal(true)}
            >
              <Button variant="contained" color="secondary">
                Get Started
              </Button>
            </Button>
          ) : (
            <ListItem key={item.name} disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </Box>
  );

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
              color: "whiteColor",
              cursor: "pointer",
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            WebAudit
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            {/* Icon */}
            <DragHandleIcon />
          </IconButton>
        </Box>

        <Toolbar
          sx={{
            display: { xs: "none", sm: "flex" },
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
                color: "whiteColor",
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

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Link
                href={item.url}
                variant="body2"
                key={item.name}
                sx={{
                  color: "whiteColor",
                  fontSize: 15,
                  textDecoration: "none",
                  marginRight: 4,
                  "&:hover": {
                    color: "secondary.main",
                  },
                }}
              >
                {item.name}
              </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box>{props.children}</Box>
    </div>
  );
}

export default Navigation;
