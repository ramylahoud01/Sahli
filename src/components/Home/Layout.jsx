import React from "react";
import Header from "./Header";
import { Typography } from "@mui/material";

const Layout = (props) => {
  return (
    <Typography component="div" variant="div">
      <Header />
      {props.children}
    </Typography>
  );
};

export default Layout;
