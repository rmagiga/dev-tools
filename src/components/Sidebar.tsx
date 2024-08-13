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
import { DrawerConfig } from "../constatns/ConfigContexts";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DrawerHeader from "./DrawerHeader";
import ColorConfig from "../constatns/ColorConfig";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";

import { To, Link as ReactRouterLink } from "react-router-dom";
import { PropsWithChildren } from "react";
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
          {["日付相互変換"].map((text, index) => (
            <ListItem key={text} disablePadding>
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
          ))}
        </List>
      </Drawer>
    </>
  );
}

export default Sidebar;
