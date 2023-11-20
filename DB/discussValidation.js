const Joi = require('joi');

const discussionSchema = Joi.object({
    discuss:Joi.string().required()
})

module.exports = discussionSchema;