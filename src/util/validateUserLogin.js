const Joi = require('joi');

function validateUserLogin(userLogin) {
    const schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
     })
     return schema.validate(userLogin);
}

module.exports = validateUserLogin;
