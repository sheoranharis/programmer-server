const Joi = require('joi');

const blogSchema = Joi.object({
    blog : Joi.object({
        name:Joi.string().required(),
        write:Joi.string().required()
    }).required()
  
})

module.exports = blogSchema;