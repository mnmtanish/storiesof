const { GraphQLNonNull, GraphQLObjectType, GraphQLString } = require('graphql');
const { UserError } = require('graphql-errors')

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
            async resolve(root, args, ctx) {
                const { username, password } = args;
                try {
                    const authToken = await ctx.UserService.getAuthToken(username, password);
                    return authToken;
                } catch(e) {
                    throw new UserError('Unable to create a token. Please check the username and password.')
                }
            },
        },
    }),
});
