import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { useContext } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge } from "@mui/material";
import { CartContext } from "../cart/context/CartContext";
import { Link } from "react-router-dom";
import SwitchDarkMode from "../SwitchDarkMode";

// const Search = styled("div")(({ theme }) => ({
//   position: "relative",
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: alpha(theme.palette.common.white, 0.15),
//   "&:hover": {
//     backgroundColor: alpha(theme.palette.common.white, 0.25),
//   },
//   marginLeft: 0,
//   width: "100%",
//   [theme.breakpoints.up("sm")]: {
//     marginLeft: theme.spacing(1),
//     width: "auto",
//   },
// }));

// const SearchIconWrapper = styled("div")(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: "100%",
//   position: "absolute",
//   pointerEvents: "none",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: "inherit",
//   "& .MuiInputBase-input": {
//     padding: theme.spacing(1, 1, 1, 0),
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//     transition: theme.transitions.create("width"),
//     width: "100%",
//     [theme.breakpoints.up("sm")]: {
//       width: "12ch",
//       "&:focus": {
//         width: "20ch",
//       },
//     },
//   },
// }));
interface SearchAppBarProps {
  openDrawer: () => void;
  handleSearchText: (text: string) => void;
  searchText: string;
  setOpenCart: (value: boolean) => void;
  openCart: boolean;
  page: string;
  handlePageChange: React.Dispatch<React.SetStateAction<string>>;
  themeMode: boolean;
  handleTheme: () => void;
}

export default function SearchAppBar({
  openDrawer,
  handleSearchText,
  searchText,
  setOpenCart,
  page,
  handlePageChange,
  openCart,
  themeMode,
  handleTheme,
}: SearchAppBarProps) {
  const { cartState } = useContext(CartContext);
  React.useEffect(() => {
    console.log(page);
  });
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <IconButton
            size="large"
            className="menu-button"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={openDrawer}
            sx={{ mr: 2, display: { lg: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            className="navigation"
            sx={{ display: { xs: "none", lg: "flex" } }}
            justifyContent="space-between"
            width="14rem"
          >
            <Box
              display="flex"
              borderBottom={page === "counts" ? "none" : "3px solid blue"}
              alignContent="center"
              alignItems="center"
            >
              <Link
                to="products"
                style={{ textDecoration: "none" }}
                onClick={() => {
                  handlePageChange("products");
                }}
              >
                <Typography
                  variant="h6"
                  color={page === "products" ? "primary" : "inherit"}
                >
                  Productos
                </Typography>
              </Link>
            </Box>
            <Box
              display="flex"
              borderBottom={page === "counts" ? "3px solid blue" : "none"}
              alignContent="center"
              textAlign="center"
            >
              <Link
                style={{ textDecoration: "none" }}
                to="counts"
                onClick={() => {
                  handlePageChange("counts");
                }}
              >
                <Typography
                  variant="h6"
                  color={page === "counts" ? "primary" : "inherit"}
                >
                  Cuentas
                </Typography>
              </Link>
            </Box>
          </Box>
          <Typography
            color="primary"
            variant="h5"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              width: "1rem",
              display: { xs: "none", sm: "block" },
            }}
          >
            Sanitarios Jimenez
          </Typography>
          {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              onChange={(e) => {
                handleSearchText(e.target.value);
                console.log(text);
              }}
              onKeyPress={(e: any) => {
                handleKeyPress(e);
              }}
              placeholder="Buscar..."
              inputProps={{ "aria-label": "buscar" }}
            />
          </Search> */}

          <SwitchDarkMode themeMode={themeMode} handleThemeMode={handleTheme} />
          <IconButton
            color={openCart ? "primary" : "default"}
            onClick={(e) => {
              setOpenCart(!openCart);
            }}
          >
            <Badge badgeContent={cartState.products.length} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
