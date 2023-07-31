import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGODB: Joi.required(),
  PORT: Joi.number().default(3005),
  DEFAULT_LIMIT_QUERY: Joi.number().default(7),
});
