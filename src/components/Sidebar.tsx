import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import UpdateIcon from '@mui/icons-material/Update';
import Forward10Icon from '@mui/icons-material/Forward10';
import { To, Link as ReactRouterLink } from "react-router-dom";
import { PropsWithChildren } from "react";

import { DrawerConfig } from "../constatns/ConfigContexts";
import DrawerHeader from "./DrawerHeader";
import ColorConfig from "../constatns/ColorConfig";

interface MyListItemButtonLinkProps extends ListItemButtonProps {
  to: To;
}
function MyListItemButtonLink({
  children,
  to,
  ...props
}: PropsWithChildren<MyListItemButtonLinkProps>) {
  return (
    <ListItemButton component={ReactRouterLink} to={to} {...props}>
      {children}
    </ListItemButton>
  );
}

type SidebarProps = {
  open: boolean;
  handler: () => void;
};

const drawerWidth = DrawerConfig.drawerWidth;

const menus = [
  {
    name: "日付相互変換",
    path: "/datetime",
    icon: <UpdateIcon />
  },
  {
    name: "基数相互変換",
    path: "/radix",
    icon: <Forward10Icon />
  }
]

function Sidebar(props: SidebarProps) {
  const theme = useTheme();

  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          boxShadow: "unset",
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: ColorConfig.sidebar.bg,
            color: ColorConfig.sidebar.color,
          },
        }}
        variant="persistent"
        anchor="left"
        open={props.open}
      >
        <DrawerHeader>
          <IconButton
            onClick={props.handler}
            sx={{ color: ColorConfig.sidebar.color }}
          >
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menus.map((menu, index) => (
            <ListItem key={index} disablePadding>
              <MyListItemButtonLink
                to={menu.path}
                sx={{
                  "&: hover": {
                    backgroundColor: ColorConfig.sidebar.hoverBg,
                  },
                  paddingY: "12px",
                  paddingX: "24px",
                }}
              >
                <ListItemIcon sx={{ color: ColorConfig.sidebar.color }}>
                  {menu.icon}
                </ListItemIcon>
                <ListItemText primary={menu.name} />
              </MyListItemButtonLink>
            </ListItem>
          ))}
          {/* {["日付相互変換"].map((text, index) => (
            <ListItem key={index} disablePadding>
              <MyListItemButtonLink
                to="/datetime"
                sx={{
                  "&: hover": {
                    backgroundColor: ColorConfig.sidebar.hoverBg,
                  },
                  paddingY: "12px",
                  paddingX: "24px",
                }}
              >
                <ListItemIcon sx={{ color: ColorConfig.sidebar.color }}>
                  {index % 2 === 0 ? (
                    <ManageHistoryIcon />
                  ) : (
                    <ManageHistoryIcon />
                  )}
                </ListItemIcon>
                <ListItemText primary={text} />
              </MyListItemButtonLink>
            </ListItem>
          ))} */}
        </List>
      </Drawer>
    </>
  );
}

export default Sidebar;
