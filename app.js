/* eslint-disable no-undef */
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const gameController = require('./src/controllers/gameController');


require('dotenv').config();

const mongoConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rapsodo',{ useNewUrlParser: true,useUnifiedTopology:true, useFindAndModify:false });
        return console.log('Mongo connected.');
    } catch (err) {
        console.log(err);
        return process.exit(1);
    }
};

mongoConnection();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(gameController);

app.use('/', swaggerUi.serve, swaggerUi.setup(require('./swagger.json')));

module.exports = app;