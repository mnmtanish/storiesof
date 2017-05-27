const { GraphQLEnumType } = require('graphql');

exports.StorybookSourceValues = {
    GITHUB: { value: 'GITHUB' },
};

exports.StorybookSource = new GraphQLEnumType({
    name: 'StorybookSource',
    values: exports.StorybookSourceValues,
});
