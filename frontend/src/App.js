import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import PaymentSuccess from "./PaymentSuccess";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payment_redirect" element={<PaymentSuccess />} />
      </Routes>
    </Router>
  );
}


export default App;