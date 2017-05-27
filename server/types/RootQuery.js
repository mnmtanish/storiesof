const { GraphQLObjectType, GraphQLString } = require('graphql');

exports.RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: () => ({
        version: {
            type: GraphQLString,
            resolve(root, args, ctx) {
                return ctx.version;
            },
        },
    }),
});
