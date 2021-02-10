const mongoose = require('mongoose');

const gamesSchema = new mongoose.Schema({
    //gercekci bir durumda userID kullanirdik mongodb oldugu icinde direk string koydum.
    players:{
        type:[String],
        required:true,
        trim:true,
    },
    cups:{
        type:[Number],
        required:true,
    },
    turn:{
        type:String,
        required:true,
        trim:true,
    },
    status:{
        type: String,
        enum: ['ongoing','ended'],
        default: 'ongoing',
        trim:true
    },
    winner:{
        type:String,
        trim:true,
    }
});
//versionKey'i kasitli olarak kapamadim movecount gibi gorunebilir hos olabilir.
const gameModel = mongoose.model('gameModel',gamesSchema,'games');

module.exports = gameModel;