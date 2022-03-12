import { useState } from "react";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
function App() {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#bc0927",
      },
      secondary: {
        main: "#3f51b5",
      },
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
