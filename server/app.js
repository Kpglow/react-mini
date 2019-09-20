import express from "express";
import graphqlHTTP from 'express-graphql';
const schema = require('./schema/schema')

const app = express();


// use middleware
app.use('/graphql', graphqlHTTP({
    //options
    //takes in schema to describe the graph
    schema,
    graphiql:true
}))

app.listen(4000, function() {
    console.log('listening on port 4000');
})