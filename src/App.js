import "./App.css";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/Home";
import ContactState from "./context/contacts/ContactState";
import 'bootstrap/dist/css/bootstrap.min.css';
import ContactDetail from "./components/ContactDetail";
import EditContact from "./components/EditContact";
import Login from "./components/Login";
import IpBlocked from "./components/IpBlocked";
import Header from "./components/Header";
import { AnimatePresence } from "framer-motion";

function App() {
  
  return (
    <ContactState>
      <Router>
        <HeaderLocation />
        <div className="container">
          <AnimatePresence mode="wait">
          <Routes>
            <Route exact path="/home" element={<Home />} />
            <Route exact path="/contact/:id" element={<ContactDetail />} />
            <Route exact path="/editcontact/:id" element={<EditContact />} />
            <Route path="/ip-blocked" element={<IpBlocked />} />
            <Route exact path="/" element={<Login />} />
          </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </ContactState>
  );
}


function HeaderLocation() {
  const location = useLocation();
  return location.pathname !== "/" ? <Header /> : null;
}

export default App;
