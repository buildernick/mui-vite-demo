import * as React from "react";
import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";

const StyledButton = styled(Button)(({ theme, variant }) => ({
  textTransform: "none",
  fontWeight: 500,
  borderRadius: 8,
  padding: "8px 16px",
  ...(variant === "contained" && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(variant === "outlined" && {
    borderWidth: 2,
    "&:hover": {
      borderWidth: 2,
    },
  }),
}));

export default function RakutenButton(props: ButtonProps) {
  return <StyledButton {...props} />;
}
