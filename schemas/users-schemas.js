import Joi from 'joi';
import { emailRegex } from '../constants/user-constants.js';

const userSchema = Joi.object({
  email: Joi.string().required().pattern(emailRegex).messages({
    'any.required': 'missing required email field',
    'string.pattern.base': 'invalid email',
  }),
  password: Joi.string().required().min(6).messages({
    'any.required': 'missing required password field',
    'string.min': 'password length must be at least 6 characters long',
  }),
});

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().required().messages({
    'any.required': 'invalid subscription type',
  }),
});

const userEmailSchema = Joi.object({
  email: Joi.string().required().pattern(emailRegex).messages({
    'any.required': 'missing required email field',
    'string.pattern.base': 'invalid email',
  }),
});

export default {
  userSchema,
  updateSubscriptionSchema,
  userEmailSchema,
};
