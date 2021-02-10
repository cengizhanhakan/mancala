/* eslint-disable no-useless-catch */
const gameModel = require('../models/gameModel');
const gameLib = require('../libs/gameLib');

exports.newGame = async (dto) => {
    try {
        const newGameObj = {
            players: dto.players,
            //sabit olarak 6 tas bulunacagi icin hic ugrasmadim.
            cups: [6,6,6,6,6,6,0,6,6,6,6,6,6,0],
            //randomize edilebilirdi ama bilemedim.
            turn: dto.players[0],
            status:'ongoing',
            winner: null,
        };
        const result = await gameModel.create(newGameObj);
        return {msg:'successfully created a new game',gameInfo:result};
    } catch (err) {
        throw err;
    }
};

//sanirim hayatimda daha once bu kadar fazla faktore bagli olan bir kod yazmamistim. sanirim spaghetti code kavrami boyle birsey. 
exports.makeMove = async (dto) => {
    try {
        let gameRecord = await gameModel.findOne({_id:dto.gameid});
        if(!gameRecord) throw new Error('game not found.');
        if(gameRecord.status == 'ended') throw new Error('game is ended already.');
        if(gameRecord.turn != dto.player) throw new Error('its opponents turn.');
        if(dto.cup === 6 || dto.cup === 13) throw new Error('you cant select houses as your cups');
        if(gameRecord.cups[dto.cup] == 0) throw new Error('you dont have any stones in that cup');
        if((dto.cup < 6 && dto.player === gameRecord.players[1]) || (dto.cup > 7 && dto.cup < 13 && dto.player === gameRecord.players[0])) throw new Error('you cant select opponents cups.');
        let index = dto.cup+1;
        let msg = 'its your opponents turn now.';
        if (gameRecord.turn == gameRecord.players[0])  {
            gameRecord.turn = gameRecord.players.filter(element => element != dto.player)[0];
            while (gameRecord.cups[dto.cup])  {
                if (index === 13) {
                    index = 0;
                }
                if(gameRecord.cups[dto.cup] === 1 && index === 6)  {
                    msg = 'its your turn again';
                    gameRecord.turn = dto.player;
                }
                gameRecord.cups[dto.cup]--;
                gameRecord.cups[index]++;
                index++;
            }
        }
        else if (gameRecord.turn == gameRecord.players[1])  {
            gameRecord.turn = gameRecord.players.filter(element => element != dto.player)[1];
            while (gameRecord.cups[dto.cup])  {
                if (index === 13) {
                    index = 0;
                }
                if (index === 6) {
                    index++;
                }
                if(gameRecord.cups[dto.cup] === 1 && index === 13)  {
                    msg = 'its your turn again';
                    gameRecord.turn = dto.player;
                }
                gameRecord.cups[index]++;
                gameRecord.cups[dto.cup]--;
                index++;
            }
        }
        //Hareket bittikten sonra son gelinen nokta bos mu bossa karsidaki taslari calalim.
        if (index !== 7 && index !== 13 && gameRecord.cups[index] === 0)  {
            if ((gameRecord.players[0] == dto.player && index > -1 && index < 6) || (gameRecord.players[1] == dto.player && index > 6 && index < 13))  {
                let secIndex = gameLib.oppositeIndex(index);
                let sum = gameRecord.cups[index] + gameRecord.cups[secIndex];
                if (gameRecord.cups[secIndex] !== 0)  {
                    if (gameRecord.players[0] == dto.player)  {
                        gameRecord.cups[6] += sum;
                    }
                    if (gameRecord.players[1] == dto.player)  {
                        gameRecord.cups[6] += sum;
                    }
                    gameRecord.cups[index] = 0;
                    gameRecord.cups[secIndex] = 0;
                }

            }
        }
        //Taraflardan birinin taslari bitince oyun bitiyormus onun kontrolu.
        if (gameRecord.cups.slice(0,5).reduce((a,b) => a+b) === 0 || gameRecord.cups.slice(7,12).reduce((a,b) => a+b) === 0) {
            gameRecord.status = 'ended';
            if(gameRecord.cups[6] > gameRecord.cups[13]) {
                msg = `player 1 wins with ${gameRecord.cups[6]}n points`;
                gameRecord.winner = gameRecord.players[0];
            }
            else if(gameRecord.cups[6] < gameRecord.cups[13]) {
                msg = `player 2 wins with ${gameRecord.cups[13]} points.`;
                gameRecord.winner = gameRecord.players[1];
            }
            else if(gameRecord.cups[6] == gameRecord.cups[13]) {
                msg = 'game draw';
                gameRecord.winner = 'draw';
            }
        }
        await gameModel.updateOne({_id:dto.gameid},gameRecord);
        return {msg:msg,gameRecord};
    } catch (err) {
        throw err;
    }
};