const express = require('express');
const graphqlHTTP = require('express-graphql');
const { maskErrors } = require('graphql-errors');
const packageJSON = require('./package.json');
const { createSchema } = require('./types');
const { createContext } = require('./funcs');

async function main() {
  const app = express();

  const schema = createSchema();
  if (process.env.NODE_ENV === 'production') {
    maskErrors(schema);
  }

  const context = await createContext({
    package: packageJSON,
    mongoUrl: process.env.MONGO_URL,
    jwtSecret: process.env.JWT_SECRET,
    smtpUrl: process.env.SMTP_URL,
  });

  app.use('/v1', graphqlHTTP({ context, schema, graphiql: true }));
  app.listen(process.env.PORT);
}

main()
  .then(() => console.log(`Listening on http://localhost:${process.env.PORT}`))
  .catch(err => console.error((err && err.stack) || err));
