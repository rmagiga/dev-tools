import { Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import "./App.css";
import Home from "./pages/Home";
import DateTimeConverter from "./pages/DateTimeConverter";
import Layout from "./components/Layout";
import RadixConverter from "./pages/RadixConverter";

function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="datetime" element={<DateTimeConverter />} />
          <Route path="radix" element={<RadixConverter />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
