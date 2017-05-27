const express = require('express');
const graphqlHTTP = require('express-graphql');
const packageJSON = require('./package.json');
const { createSchema } = require('./types');
const { createContext } = require('./funcs');

const app = express();
const schema = createSchema();
const context = createContext({
    package: packageJSON,
    mongoUrl: process.env.MONGO_URL,
});

app.use('/v1', graphqlHTTP({ context, schema, graphiql: true }));
app.listen(process.env.PORT);
