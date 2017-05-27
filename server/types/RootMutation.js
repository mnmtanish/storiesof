const { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType, GraphQLString } = require('graphql');
const { StorybookSource, StorybookSourceValues } = require('./StorybookSource');
const { StorybookBuilder } = require('../funcs/StorybookBuilder');

exports.RootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    fields: () => ({
        build: {
            type: GraphQLBoolean,
            args: {
                source: { type: new GraphQLNonNull(StorybookSource) },
                repoUrl: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(root, args, ctx) {
                switch (args.source) {
                    case StorybookSourceValues.GITHUB.value:
                        const [ user, repo, hash ] = args.repoUrl.split('/');
                        return ctx.StorybookBuilder.buildFromGithub(user, repo, hash);
                    default:
                        throw new Error('unknown storybook source');
                }
            }
        },
    }),
});
