import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Header from "./Header";
import Sidebar from "./Sidebar";
import DrawerHeader from "./DrawerHeader";
import { Outlet } from "react-router-dom";
import ColorConfig from "../constatns/ColorConfig";
import Footer from "./Footer";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  backgroundColor: ColorConfig.mainBg,
  height: "100hv",
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

export default function Layout() {
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: ColorConfig.mainBg,
      }}
    >
      <Header open={open} handler={handleDrawerOpen} />
      <Sidebar open={open} handler={handleDrawerClose} />
      <Main open={open}>
        <DrawerHeader />
        <Outlet />
      </Main>
      <Footer />
    </Box>
  );
}
