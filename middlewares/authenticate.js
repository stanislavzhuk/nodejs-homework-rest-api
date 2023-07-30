import jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from '../models/user.js';
import HttpError from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') next(HttpError(401));
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || !user.token) next(HttpError(401));
    req.user = user;
    next();
  } catch {
    next(HttpError(401));
  }
};

export default ctrlWrapper(authenticate);
