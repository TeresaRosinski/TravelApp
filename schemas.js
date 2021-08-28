const { number } = require("joi");
const Joi = require("joi");
//pattern for javascript object

module.exports.destinationSchema = Joi.object({
  destination: Joi.object({
    title: Joi.string(),
    city: Joi.string(),
    images: Joi.string(),
  }).required(),
});

/*
  module.exports.experienceSchema = Joi.object({
    experience: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      type: Joi.string().required(),
      cost: Joi.number().required().min(0),
      details: Joi.string(),
      images: Joi.string(),
    }).required()
  }); */
