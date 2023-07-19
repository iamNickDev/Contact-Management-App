const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModels");

//@desc Get all contacts
//@route Get /api/contacts
//@access public
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find();
  res.status(200).json({ contacts });
});

//@desc Create new contacts
//@route Post /api/contacts
//@access public
const createContact = asyncHandler(async (req, res) => {
  console.log("the request body is: ", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("all fields are required !");
  }
  const contacts = await Contact.create({
    name,
    email,
    phone,
  });
  res.status(201).json({ contacts });
});

//@desc Get contacts
//@route Get /api/contacts
//@access public
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  console.log(
    "🚀 ~ file: contactController.js:35 ~ getContact ~ contact:",
    contact
  );
  if (!contact) {
    res.status(404);
    throw new Error("Contacts not found");
  }
  res.status(200).json(contact);
});

//@desc Update new contacts
//@route Put /api/contacts
//@access public
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  console.log(
    "🚀 ~ file: contactController.js:51 ~ updateContact ~ contact:",
    contact
  );

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user contacts");
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

//@desc delete contact
//@route delete /api/contacts
//@access private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  console.log(
    "🚀 ~ file: contactController.js:79 ~ deleteContact ~ contact:",
    contact
  );
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user contacts");
  }
  await Contact.deleteOne({ _id: req.params.id });
  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
