import { HttpError } from '../helpers/index.js';

const validSubscriptions = ['starter', 'pro', 'business'];

const isSubscription = (req, res, next) => {
  const { subscription } = req.body;

  if (!subscription) next(HttpError(400, 'missing field subscription'));

  if (!validSubscriptions.includes(subscription))
    next(HttpError(400, 'subscription must be starter, pro, or business'));

  next();
};

export default isSubscription;
