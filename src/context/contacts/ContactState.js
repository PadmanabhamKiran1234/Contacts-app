import { useState } from "react";
import ContactContext from "./contactContext";

const ContactState = (props) => {
  const host = "http://localhost:5000";
  const contactsInitial = [];
  const [contacts, setContacts] = useState(contactsInitial);

  // Get all contacts
  const getAllContacts = async () => {
    //API Call
    const response = await fetch(`${host}/api/contacts/fetchAllContacts`, {
      method: "GET",
      headers: {
        "auth-token":
          localStorage.getItem('token'),
      },
    });
    const json = await response.json();
    setContacts(json);
  };

  // Add a contact
  const addContact = async (
    companyName,
    contactPerson,
    email,
    phoneNumber1,
    phoneNumber2,
    address,
    image
  ) => {
    try {
      const formData = new FormData();
      formData.append('companyName', companyName);
      formData.append('contactPerson', contactPerson);
      formData.append('email', email);
      formData.append('phoneNumber1', phoneNumber1);
      formData.append('phoneNumber2', phoneNumber2);
      formData.append('address', JSON.stringify(address));
      if (image) {
        formData.append('image', image); 
      }
  
      const response = await fetch(`${host}/api/contacts/addContact`, {
        method: 'POST',
        headers: {
          'auth-token': localStorage.getItem('token')
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to add contact');
      }
  
      const newContact = await response.json();
      // Update the contacts state
      setContacts((prevContacts) => [...prevContacts, newContact.contact]);
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  //Delete a contact
  const deleteContact = async (id) => {
    //API Call
    //API Call
    const response = await fetch(`${host}/api/contacts/deleteContact/${id}`, {
      method: "DELETE",
      headers: {
        "auth-token":
          localStorage.getItem('token'),
      },
    });
    const json = response.json();
    console.log(json);
    console.log("Deleting note with id " + id);
    const newContacts = contacts.filter((contact) => {
      return contact._id !== id;
    });
    setContacts(newContacts);
    
  };

  //Edit a contact
  // const editContact = async (id,companyName, contactPerson, email, phoneNumber1, phoneNumber2, address, image)=>{

  //   //API Call
  //   const response = await fetch(`${host}/api/contacts/updateContact/${id}` , {
  //     method: 'PUT',
  //     headers: {
  //       "auth-token": localStorage.getItem('token')
  //     },
  //     body: JSON.stringify({companyName, contactPerson, email, phoneNumber1, phoneNumber2, address, image})
  //   });
  //   const json = await response.json();
  //   if (!response.ok) {
  //     throw new Error("Network response was not ok");
  //   }

  //   let newContacts = JSON.parse(JSON.stringify(contacts))
  //   for (let index = 0; index < contacts.length; index++) {
  //     const element = newContacts[index];
  //     if(element._id === id){
  //       newContacts[index].companyName = companyName;
  //       newContacts[index].contactPerson = contactPerson;
  //       newContacts[index].email = email;
  //       newContacts[index].phoneNumber1 = phoneNumber1;
  //       newContacts[index].phoneNumber2 = phoneNumber2;
  //       newContacts[index].address.street = address.street;
  //       newContacts[index].address.city = address.city;
  //       newContacts[index].address.state = address.state;
  //       newContacts[index].address.zipCode = address.zipCode;
  //       newContacts[index].address.country = address.country;
  //       newContacts[index].image = image;
  //       break;
  //     }

  //   }
  //   console.log(newContacts);
  //   setContacts(newContacts)
  // }

  const editContact = async (
    id,
    companyName,
    contactPerson,
    email,
    phoneNumber1,
    phoneNumber2,
    address,
    image
  ) => {
    try {
      const formData = new FormData();
      formData.append("companyName", companyName);
      formData.append("contactPerson", contactPerson);
      formData.append("email", email);
      formData.append("phoneNumber1", phoneNumber1);
      formData.append("phoneNumber2", phoneNumber2);
      formData.append("address", JSON.stringify(address));
      if (image) {
        formData.append("image", image);
      }
  
      const response = await fetch(`${host}/api/contacts/updateContact/${id}`, {
        method: "PUT",
        headers: {
          "auth-token":
            localStorage.getItem('token'),
        },
        body: formData,
      });
  
      if (response.ok) {
        const updatedContact = await response.json();
        console.log("Updated successfully", updatedContact.contact.image); // Verify the updated image filename
  
        // Update the contact state
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact._id === id ? updatedContact.contact : contact
          )
        );
        console.log("UpdatedContact state", updatedContact.contact); // Verify the updated contact state
      } else {
        throw new Error("Failed to update contact");
      }
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };
  

  return (
    <ContactContext.Provider
      value={{
        contacts,
        addContact,
        deleteContact,
        editContact,
        getAllContacts,
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};

export default ContactState;
