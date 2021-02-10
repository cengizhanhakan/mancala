const express = require('express');
const router = express();
const gameServiceInstance = require('../services/gameService');
const { validateMove, validateNewGame } = require('../validators/gameValidator');


router.post('/newgame', validateNewGame , async (req, res) => {
    try {
        const result = await gameServiceInstance.newGame(req.body);
        return res.json(result);
    } catch (err) {
        return res.status(400).send({msg:err.message});
    }
});

router.put('/makemove', validateMove , async (req, res) => {
    try {
        const result = await gameServiceInstance.makeMove(req.body);
        return res.json(result);
    } catch (err) {
        return res.status(400).send({msg:err.message});
    }
});


module.exports = router;