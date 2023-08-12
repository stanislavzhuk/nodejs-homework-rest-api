import bcript from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import path from 'path';
import fs from 'fs/promises';
import Jimp from 'jimp';
import gravatar from 'gravatar';
import { nanoid } from 'nanoid';
import User from '../models/user.js';
import { HttpError, sendEmail } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';
import { emailStyle, buttonStyle } from '../constants/ctrl-constants.js';

const { JWT_SECRET, BASE_URL } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) throw HttpError(409, 'Email in use');

  const hashPassword = await bcript.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `
    <div style="${emailStyle}">
        <a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}" style="${buttonStyle}">Click to verify email</a>
    </div>
  `,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      // verify: newUser.verify,
      // verificationToken: newUser.verificationToken,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) throw HttpError(404, 'User not found');

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: '',
  });

  res.status(202).json({
    message: 'Verification successful',
  });
};

const resendVerifyEmail = async (req, res) => {

};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw HttpError(401, 'Email or password is wrong');
  if (!user.verify) throw HttpError(401, 'Email not verified');

  const passwordCompare = await bcript.compare(password, user.password);
  if (!passwordCompare) throw HttpError(401, 'Email or password is wrong');
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });

  res.status(204).send();
};

const updateSubscription = async (req, res) => {
  const { id } = req.user;
  const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

  res.status(200).json({
    email: updatedUser.email,
    subscription: updatedUser.subscription,
  });
};

const avatarPath = path.resolve('public', 'avatars');

const updateAvatar = async (req, res) => {
  const { id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);
  const image = await Jimp.read(oldPath);
  image.resize(250, 250).write(oldPath);
  await fs.rename(oldPath, newPath);
  const avatar = path.join('avatars', filename);
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { avatarURL: avatar },
    { new: true }
  );

  res.status(200).json({ avatarURL: updatedUser.avatarURL });
};

export default {
  signup: ctrlWrapper(signup),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
