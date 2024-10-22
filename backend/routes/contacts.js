const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser"); 
const Contact = require("../models/Contacts"); 

const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    const dir = path.join(__dirname, "..", "..", "public", "images");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // File name will be a timestamp
  },
});

const upload = multer({ storage: storage });


router.use('/images', express.static(path.join(__dirname, "..", "..", "public", "images")));


// Route 1: Getting all the contacts using GET: "/api/contacts/fetchAllContacts". Login Required
router.get("/fetchAllContacts", fetchuser, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id });
    res.json(contacts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Route 2: Upload image for a profile picture and add a contact
router.post(
  "/addContact",
  fetchuser,
  upload.single("image"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        companyName,
        contactPerson,
        email,
        phoneNumber1,
        phoneNumber2,
        address,
      } = req.body;

      const image = req.file ? req.file.filename : null; 

      let addressObj;
      try {
        addressObj = JSON.parse(address);
      } catch (e) {
        return res.status(400).send("Invalid address format");
      }

      // Create a new contact
      const contact = new Contact({
        companyName,
        contactPerson,
        email,
        phoneNumber1,
        phoneNumber2,
        address: addressObj,
        user: req.user.id,
        image, 
      });

      await contact.save();
      res.json({ contact });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// Route 3: Updating an existing contact using PUT: "/api/contacts/updateContact/:id". Login Required
router.put(
  "/updateContact/:id",
  fetchuser,
  upload.single("image"),
  async (req, res) => {
    const {
      companyName,
      contactPerson,
      email,
      phoneNumber1,
      phoneNumber2,
      address,
    } = req.body;

    // Create newContact object, if any update has been made
    const newContact = {};
    if (companyName) newContact.companyName = companyName;
    if (contactPerson) newContact.contactPerson = contactPerson;
    if (email) newContact.email = email;
    if (phoneNumber1) newContact.phoneNumber1 = phoneNumber1;
    if (phoneNumber2) newContact.phoneNumber2 = phoneNumber2;
    if (address) {
      try {
        newContact.address = JSON.parse(address);
      } catch (e) {
        return res.status(400).send("Invalid address format");
      }
    }

    if (req.file) {
      newContact.image = req.file.filename; // Save the new filename in MongoDB
    }

    try {
      let contact = await Contact.findById(req.params.id);
      if (!contact) {
        return res.status(404).send("Contact not found");
      }

      // Check if the contact belongs to the user
      if (contact.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed to update this contact");
      }

      // Update the contact
      contact = await Contact.findByIdAndUpdate(
        req.params.id,
        { $set: newContact },
        { new: true }
      );

      res.json({ contact });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// Route 4: Deleting an existing contact using DELETE: "/api/contacts/deleteContact/:id". Login Required
router.delete(
  "/deleteContact/:id",
  fetchuser,
  async (req, res) => {
    try {
      // Find the contact to be deleted
      let contact = await Contact.findById(req.params.id);
      if (!contact) {
        return res.status(404).send("Contact not found");
      }

      // Check if the contact belongs to the user
      if (contact.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed to delete this contact");
      }

      // Delete the contact
      contact = await Contact.findByIdAndDelete(req.params.id);

      res.json({
        Success: "This contact has been successfully deleted",
        contact: contact,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

module.exports = router;
