const { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType, GraphQLString } = require('graphql');
const { UserError } = require('graphql-errors');

exports.RootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    fields: () => ({
        // registerUser creates a new user account and returns the user id.
        // The username should be as same as the npm username.
        registerUser: {
            type: new GraphQLNonNull(GraphQLString),
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(root, args, ctx) {
                const { username, password } = args;
                const authToken = await ctx.UserService.register(username, password);
                return authToken;
            },
        },

        // resendVerifyEmail sends the verification email again.
        // The username should be as same as the npm username.
        resendVerifyEmail: {
            type: new GraphQLNonNull(GraphQLBoolean),
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(root, args, ctx) {
                const { username, password } = args;
                await ctx.UserService.resendVerifyEmail(username, password);
                return true;
            },
        },

        // verifyUserEmail verifies user email with the given jwt token.
        // The username to verify is included inside the token.
        verifyUserEmail: {
            type: new GraphQLNonNull(GraphQLBoolean),
            args: {
                emailToken: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(root, args, ctx) {
                const { emailToken } = args;
                await ctx.UserService.verifyUserEmail(emailToken);
                return true;
            },
        },

        // createUploadUrl returns a signed URL to upload the bundle to S3/GCS.
        // This bundle will be extracted and deleted after it's uploaded.
        createUploadUrl: {
            type: new GraphQLNonNull(GraphQLString),
            args: {
                authToken: { type: new GraphQLNonNull(GraphQLString) },
                packageName: { type: new GraphQLNonNull(GraphQLString) },
                packageVersion: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(root, args, ctx) {
                const { authToken, packageName, packageVersion } = args;
                const username = await ctx.UserService.getTokenUser(authToken);
                const isAuthor = await ctx.NpmService.isPackageAuthor(username, packageName);
                if (isAuthor !== true) {
                    throw new UserError('User is not an owner of given npm package.');
                }
                return ctx.StorageService.getUploadUrl(packageName, packageVersion);
            },
        },
    }),
});
