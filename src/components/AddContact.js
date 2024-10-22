import React, { useState, useContext, useRef } from 'react';
import contactContext from '../context/contacts/contactContext';

const AddContact = ({ onClose }) => {
  const context = useContext(contactContext);
  const { addContact } = context;
  const fileInputRef = useRef(null);
  const [contact, setContact] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phoneNumber1: '',
    phoneNumber2: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    image: null,
  });
  const [imageSrc, setImageSrc] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setContact({
        ...contact,
        address: { ...contact.address, [addressField]: value },
      });
    } else {
      setContact({ ...contact, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setContact({ ...contact, image: file });

    // Creating a preview for the image that has been added
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    await addContact(
      contact.companyName,
      contact.contactPerson,
      contact.email,
      contact.phoneNumber1,
      contact.phoneNumber2,
      contact.address,
      contact.image
    );
    if (onClose) {
      onClose(); // Close the modal
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <form className="form-container">
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
        <button type="button" className="add-photo-button" onClick={triggerFileInput}>
          Add Photo
        </button>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
      </div>
      <div className="form-group">
        <label>Company Name</label>
        <input
          type="text"
          name="companyName"
          value={contact.companyName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Contact Person</label>
        <input
          type="text"
          name="contactPerson"
          value={contact.contactPerson}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={contact.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Phone Number 1</label>
        <input
          type="tel"
          name="phoneNumber1"
          value={contact.phoneNumber1}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Phone Number 2</label>
        <input
          type="tel"
          name="phoneNumber2"
          value={contact.phoneNumber2}
          onChange={handleChange}
        />
      </div>

      <h5>Address</h5>
      <div className="form-group">
        <label>Street</label>
        <input
          type="text"
          name="address.street"
          value={contact.address.street}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>City</label>
        <input
          type="text"
          name="address.city"
          value={contact.address.city}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>State</label>
        <input
          type="text"
          name="address.state"
          value={contact.address.state}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Zip Code</label>
        <input
          type="text"
          name="address.zipCode"
          value={contact.address.zipCode}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Country</label>
        <input
          type="text"
          name="address.country"
          value={contact.address.country}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="submit-button" onClick={handleClick}>
        Submit
      </button>
    </form>
  );
};

export default AddContact;
