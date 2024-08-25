import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { DRAWER_WIDTH } from "../Constants";
import { IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ColorConfig from "../constatns/ColorConfig";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

type HeaderProps = {
  open: boolean;
  handler: () => void;
};

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    marginLeft: `${DRAWER_WIDTH}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function Header(props: HeaderProps) {
  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: "unset",
        backgroundColor: ColorConfig.appbar.bg,
        color: ColorConfig.appbar.color,
      }}
      open={props.open}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={props.handler}
          edge="start"
          sx={{ mr: 2, ...(props.open && { display: "none" }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          開発ツール
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
