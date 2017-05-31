const { GraphQLSchema } = require('graphql');
const { RootQuery } = require('./RootQuery');
const { RootMutation } = require('./RootMutation');

exports.createSchema = () =>
  new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
  });
