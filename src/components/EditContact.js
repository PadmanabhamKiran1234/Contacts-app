import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import contactContext from "../context/contacts/contactContext";

const EditContact = () => {
  const { id } = useParams();
  const context = useContext(contactContext);
  const { contacts, deleteContact, editContact } = context;
  const contact = contacts.find((contact) => contact._id === id);

  const [contactss, setContact] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phoneNumber1: "",
    phoneNumber2: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    image: "", // Initialize as empty string
  });

  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    if (contact) {
      setContact(contact);
      if (contact.image) {
        setImageSrc(`/images/${contact.image}`);
      }
    }
  }, [contact]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setContact((prevContact) => ({
        ...prevContact,
        address: { ...prevContact.address, [addressField]: value },
      }));
    } else if (name === "image" && files.length > 0) {
      const file = files[0];
      setContact((prevContact) => ({ ...prevContact, image: file }));
      setImageSrc(URL.createObjectURL(file));
    } else {
      setContact((prevContact) => ({ ...prevContact, [name]: value }));
    }
  };
  
  

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(`/contact/${id}`);

  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await deleteContact(contactss._id);
      navigate("/home");
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    

    try {
      await editContact(
        contactss._id,
        contactss.companyName,
        contactss.contactPerson,
        contactss.email,
        contactss.phoneNumber1,
        contactss.phoneNumber2,
        contactss.address,
        contactss.image
      );
      console.log("Updating contact:", contactss); 
      navigate(`/contact/${id}`);
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  return (
    <>
      <div className="back-edit">
        <h6 className="font-title">
          <button className="done-button" onClick={handleCancel}>
            cancel
          </button>
        </h6>
        <button className="done-button" onClick={handleClick}>Done</button>
      </div>
      <div className="contact-detail1">
        <form className="form-container1">
          <div className="avatar-container1">
            <div className="contact-avatar1">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Contact Avatar"
                  style={{ width: "140px", height: "140px", borderRadius: "50%" }}
                />
              ) : (
                <i className="fa-solid fa-user"></i>
              )}
            </div>
            <button type="button" className="add-photo-button" onClick={() => document.getElementById("imageInput").click()}>
              Edit Photo
            </button>
            <input
              id="imageInput"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              style={{ display: "none" }}
            />
          </div>
          <div className="form-group1">
            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              value={contactss.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group1">
            <label>Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={contactss.contactPerson}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group1">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={contactss.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group1">
            <label>Phone Number 1</label>
            <input
              type="tel"
              name="phoneNumber1"
              value={contactss.phoneNumber1}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group1">
            <label>Phone Number 2</label>
            <input
              type="tel"
              name="phoneNumber2"
              value={contactss.phoneNumber2}
              onChange={handleChange}
            />
          </div>

          <h5>Address</h5>
          <div className="form-group1">
            <label>Street</label>
            <input
              type="text"
              name="address.street"
              value={contactss.address.street}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group1">
            <label>City</label>
            <input
              type="text"
              name="address.city"
              value={contactss.address.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group1">
            <label>State</label>
            <input
              type="text"
              name="address.state"
              value={contactss.address.state}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group1">
            <label>Zip Code</label>
            <input
              type="text"
              name="address.zipCode"
              value={contactss.address.zipCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group1">
            <label>Country</label>
            <input
              type="text"
              name="address.country"
              value={contactss.address.country}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="delete-button"
            onClick={handleDelete}
          >
            Delete
          </button>
        </form>
      </div>
    </>
  );
};

export default EditContact;
