import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import DateTimeConverter from "./pages/DateTimeConverter";
import Layout from "./components/Layout";
import { CssBaseline } from "@mui/material";

function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="datetime" element={<DateTimeConverter />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
