const { GraphQLNonNull, GraphQLObjectType, GraphQLString } = require('graphql');

exports.RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: () => ({
        // version returns the API version
        version: {
            type: GraphQLString,
            resolve(root, args, ctx) {
                return ctx.version;
            },
        },

        // getAuthToken returns a JWT for the user
        getAuthToken: {
            type: new GraphQLNonNull(GraphQLString),
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(root, args, ctx) {
                const { username, password } = args;
                return ctx.UserService.getAuthToken(username, password);
            },
        },
    }),
});
