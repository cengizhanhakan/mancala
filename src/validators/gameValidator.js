const Joi = require('joi');

/* dto için validation */
module.exports = {
    async validateMove(req, res, next) {
        const moveValidator = Joi.object({
            //trim onemli sql injection tarzi seylerden korunmak adina.
            player: Joi.string().required().trim().messages({
                'string.empty': 'player cant be empty',
                'string.base': 'player needs to be a string',
                'any.required': 'player is a required field',
            }),
            cup: Joi.number().integer().min(0).max(13).required().messages({
                'number.empty': 'cup cant be empty',
                'number.base': 'cup should be a number',
                'number.min': 'cup should be equal or greater than 0',
                'any.required': 'cup is a required field',
            }),
            gameid: Joi.string().required().trim().messages({
                'string.empty': 'gameid cant be empty',
                'string.base': 'gameid needs to be string',
                'any.required': 'gameid is a required field',
            }),
        });
        try {
            await moveValidator.validateAsync(req.body,{abortEarly:false});
            next();
        } catch (err) {
            const errors = [];
            /* obje olarak aldim cunku her validation componentinin dondurdugu error farkliyken
            msg kismi genelde sabit oluyor
            stringde alabilirdim */
            err.details.forEach((error) => errors.push({msg:error.message}));
            res.status(422).json(errors);
        }
    },

    async validateNewGame(req, res, next) {
        const newGameValidator = Joi.object({
            players: Joi.array().items(Joi.string().required().trim(), Joi.string().required().trim()).required()
        });
        try {
            await newGameValidator.validateAsync(req.body,{abortEarly:false});
            next();
        } catch (err) {
            const errors = [];
            /* obje olarak aldim cunku her validation componentinin dondurdugu error farkliyken
            msg kismi genelde sabit oluyor
            stringde alabilirdim */
            err.details.forEach((error) => errors.push({msg:error.message}));
            res.status(422).json(errors);
        }
    }
};