const { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType, GraphQLString } = require('graphql');

exports.RootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    fields: () => ({
        // register creates a new user account and returns the user id.
        // The username should be as same as the npm username.
        // TODO: send a verification email to the npm user
        registerUser: {
            type: new GraphQLNonNull(GraphQLString),
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(root, args, ctx) {
                const { username, password } = args;
                return ctx.UserService.register(username, password);
            },
        },

        // upload returns a signed URL to upload the bundle to S3/GCS.
        // This bundle will be extracted and deleted after it's uploaded.
        getUploadUrl: {
            type: new GraphQLNonNull(GraphQLString),
            args: {
                authToken: { type: new GraphQLNonNull(GraphQLString) },
                packageName: { type: new GraphQLNonNull(GraphQLString) },
                packageVersion: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(root, args, ctx) {
                const { authToken, packageName, packageVersion } = args;
                const { username } = await ctx.UserService.parseToken(authToken);
                const isAuthor = await ctx.NpmService.isPackageAuthor(username, packageName);
                if (isAuthor !== true) {
                    throw new Error('user is not an owner of the given npm package');
                }
                return ctx.StorageService.getUploadUrl(packageName, packageVersion);
            },
        },
    }),
});
