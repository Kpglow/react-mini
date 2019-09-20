import express from "express";
import graphqlHTTP from 'express-graphql';
const mongoose = require('mongoose');

const schema = require('./schema/schema');

const startServer = async () => {
    const app = express();
    // use middleware
    app.use('/graphql', graphqlHTTP({
    //options
    //takes in schema to describe the graph
        schema,
        graphiql:true
    }));

    await mongoose.connect('mongodb+srv://tester:12345@gql-mongo-test-ka3zr.mongodb.net/test?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
    mongoose.connection.once('open', () => {
        console.log('connected to database')
    })

    app.listen(4000, function() {
        console.log('listening on port 4000');
    })
}

startServer();  