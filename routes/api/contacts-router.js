import express from 'express';
import ctrl from '../../controllers/contacts-controllers.js';
import schema from '../../schemas/contacts-schemas.js';
import {
  isEmptyReq,
  isEmptyBody,
  isValidId,
  isEmptyFavorite
} from "../../middlewares/index.js";

const contactsRouter = express.Router();

contactsRouter.get('/', ctrl.getAllContacts);

contactsRouter.get('/:id', isValidId, ctrl.getContactById);

contactsRouter.post('/',
  isEmptyReq,
  isEmptyBody(schema.contactSchema),
  ctrl.addNewContact
);

contactsRouter.delete('/:id',
  isValidId,
  ctrl.deleteContactById
);

contactsRouter.put('/:id',
  isValidId,
  isEmptyReq,
  isEmptyBody(schema.contactSchema),
  ctrl.updateContactById
);

contactsRouter.patch("/:id/favorite",
  isValidId,
  isEmptyFavorite,
  isEmptyBody(schema.contactUpdateFavoriteSchema),
  ctrl.updateStatusContact
);

export default contactsRouter;
