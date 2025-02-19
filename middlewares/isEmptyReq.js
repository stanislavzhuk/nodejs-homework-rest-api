import { HttpError } from '../helpers/index.js';

const isEmptyReq = (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    next(HttpError(400, 'missing fields'));
  next();
};

export default isEmptyReq;
