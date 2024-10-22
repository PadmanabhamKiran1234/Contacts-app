import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import contactContext from "../context/contacts/contactContext";
import { Image } from "react-bootstrap";
import { motion } from "framer-motion";

const ContactDetail = () => {
  const { id } = useParams();
  const context = useContext(contactContext);
  const { contacts } = context;
  const [contact, setContact] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContact = () => {
      const foundContact = contacts.find((contact) => contact._id === id);
      setContact(foundContact);
      if (foundContact && foundContact.image) {
        setImageSrc(`/images/${foundContact.image}`);
      }
    };

    // Ensure that contacts is available before trying to fetch the contact
    if (contacts.length > 0) {
      fetchContact();
    } else {
      // Fetch contacts if they are not already loaded
      context.getAllContacts();
    }
  }, [contacts, id, context]);

  if (!contact) {
    return <div>Loading...</div>;
  }

  const handleClick = () => {
    navigate(`/editcontact/${contact._id}`);
  };

  const handleBackClick = () => {
    navigate("/home"); 
  };

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.7 }}
    >
      <div className="back-edit">
        <h6 className="font-title">
          <div className="back" onClick={handleBackClick}>
            <i className="fa-solid fa-chevron-left"></i>
          </div> 
        </h6>
        <button className="edit-button" onClick={handleClick}>
          Edit
        </button>
      </div>

      <div className="contact-detail">
        <div className="contact-header">
          <div className="avatar-container1">
            <div className="contact-avatar1">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  roundedCircle
                  style={{ width: "140px", height: "140px" }}
                />
              ) : (
                <i className="fa-solid fa-user"></i>
              )}
            </div>
          </div>
          <h3>{contact.contactPerson}</h3>
        </div>
        <div className="contact-buttons">
          <button>
            <i className="fa-solid fa-comment"></i>
            <span>Message</span>
          </button>
          <button>
            <i className="fa-solid fa-phone"></i>
            <span>Call</span>
          </button>
          <button>
            <i className="fa-solid fa-video"></i>
            <span>Video</span>
          </button>
          <button>
            <i className="fa-solid fa-envelope"></i>
            <span>Mail</span>
          </button>
        </div>
      </div>

      <div className="contact-detailss">
        <div className="contact-info-section">
          <div className="contact-info">
            <span>Mobile</span>
            <a href={`tel:${contact.phoneNumber1}`}>{contact.phoneNumber1}</a>
          </div>
          <div className="contact-info">
            <span>Home</span>
            <a href={`tel:${contact.phoneNumber2}`}>{contact.phoneNumber2}</a>
          </div>
        </div>

        <div className="contact-info-section">
          <div className="contact-info">
            <span>Work</span>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
        </div>
        
        <h6>Address</h6>
        <div className="contact-info-section">
          <div className="contact-info">
            <span>Street</span>
            <p>{contact.address.street}</p>
          </div>
          <div className="contact-info">
            <span>City</span>
            <p>{contact.address.city}</p>
          </div>
          <div className="contact-info">
            <span>State</span>
            <p>{contact.address.state}</p>
          </div>
          <div className="contact-info">
            <span>Country</span>
            <p>{contact.address.country}</p>
          </div>
          <div className="contact-info">
            <span>Zipcode</span>
            <p>{contact.address.zipCode}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactDetail;
