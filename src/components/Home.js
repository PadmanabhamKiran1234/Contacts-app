import React, { useState } from "react";
import Contacts from "./Contacts";
import { Modal, Button } from "react-bootstrap";
import AddContact from "../components/AddContact";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleLogoutModalShow = () => setShowLogoutModal(true);
  const handleLogoutModalClose = () => setShowLogoutModal(false);

  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    navigate("/");
  };

  return (
    <motion.div 
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.7 }}
      className="home-page"
    >
      <div className="header-container">
        <div className="header-left">
          <button className="info-button" onClick={handleLogoutModalShow}>
            <i className="fa-solid fa-circle-info"></i>
          </button>
          <h1 className="title">Contacts</h1>
        </div>
        
        <button className="add-button" onClick={handleShow}>
          +
        </button>
        
      </div>

      <Modal
        show={showModal}
        onHide={handleClose}
        size="lg"
        dialogClassName="modal-slide-up"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddContact onClose={handleClose} />
        </Modal.Body>
      </Modal>

      <Modal
        show={showLogoutModal}
        onHide={handleLogoutModalClose}
        size="sm"
        dialogClassName="modal-overlay"
      >
        <Modal.Header closeButton>
          <Modal.Title>Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant="danger" onClick={logout}>Log out</Button>
        </Modal.Body>
      </Modal>

      <Contacts />
    </motion.div>
  );
};

export default Home;
