import Contact from '../models/contact.js';
import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite, ...query } = req.query;
  const skip = (page - 1) * limit;
  const searchConditions = { owner, ...query };
  if (favorite === 'true') searchConditions.favorite = true;
  const result = await Contact.find(searchConditions, '-createdAt -updatedAt', {
    skip,
    limit,
  });
  res.json(result);
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id, '-createdAt -updatedAt');
  if (!result) throw HttpError(404);
  res.json(result);
};

const addNewContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndRemove(id);
  if (!result) throw HttpError(404);
  res.status(200).json({
    message: 'Contact deleted',
  });
};

const updateContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) throw HttpError(404);
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) throw HttpError(404);
  res.json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  addNewContact: ctrlWrapper(addNewContact),
  deleteContactById: ctrlWrapper(deleteContactById),
  updateContactById: ctrlWrapper(updateContactById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
