import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Link } from "react-router-dom";
import FormControlLabel from "@mui/material/FormControlLabel";
export default function Register() {
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            Create an account
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Grid item xs={12} sx={{ m: 3 }} align="center">
            <FormControl>
              <TextField
                label="Username"
                color="secondary"
                focused
                required={true}
                type="text"
              />
              <FormHelperText>
                <div align="center">Please enter your username.</div>
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ m: 3 }} align="center">
            <FormControl>
              <TextField
                label="Password"
                color="secondary"
                focused
                required={true}
                type="password"
              />
              <FormHelperText>
                <div align="center">Please enter your password.</div>
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} align="center">
            <Button color="primary" variant="contained">
              Register
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
