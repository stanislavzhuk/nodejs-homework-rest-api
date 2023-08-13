import express from 'express';
import schema from '../../schemas/users-schemas.js';
import ctrl from '../../controllers/auth-controller.js';
import {
  isEmptyReq,
  isEmptyBody,
  authenticate,
  isSubscription,
  upload,
} from '../../middlewares/index.js';

const authRouter = express.Router();

authRouter.post(
  '/register',
  isEmptyReq,
  isEmptyBody(schema.userSchema),
  ctrl.signup
);

authRouter.get('/verify/:verificationToken', ctrl.verify);

authRouter.post(
  '/verify',
  isEmptyBody(schema.userEmailSchema),
  ctrl.resendVerifyEmail
);

authRouter.post(
  '/login',
  isEmptyReq,
  isEmptyBody(schema.userSchema),
  ctrl.signin
);

authRouter.get('/current', authenticate, ctrl.getCurrent);

authRouter.post('/logout', authenticate, ctrl.logout);

authRouter.patch(
  '/',
  authenticate,
  isSubscription,
  isEmptyBody(schema.updateSubscriptionSchema),
  ctrl.updateSubscription
);

authRouter.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  ctrl.updateAvatar
);

export default authRouter;
