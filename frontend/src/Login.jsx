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
export default function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  useEffect(() => {
    const logged = localStorage.getItem("logged");
    if (logged) {
      window.location.href = "/";
    }
  }, []);
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            Login
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
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <FormHelperText>
                <div align="center">Please enter your password.</div>
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} align="center">
            <Button
              color="primary"
              variant="contained"
              onClick={async (e) => {
                e.preventDefault();
                const opt = {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    username: username,
                    password: password,
                  }),
                };
                await fetch("http://127.0.0.1:8080/v1/users/login", opt)
                  .then((resp) => resp.json())
                  .then(async (data) => {
                    if (data.status == "ok") {
                      localStorage.setItem("logged", true);
                      localStorage.setItem("refresh_token", data.refresh_token);
                      localStorage.setItem("token", data.token);
                      window.location.href = "/";
                    }
                  })
                  .catch((err) => console.log(err));
              }}
            >
              Enter
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
