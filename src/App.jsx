import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Checkin from "./Checkin";
import Checkout from "./Checkout";
import Thanks from "./Thanks";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkin" element={<Checkin />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/thanks" element={<Thanks />} />
      </Routes>
    </Router>
  );
}