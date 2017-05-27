const { StorybookBuilder } = require('./StorybookBuilder');

exports.createContext = options => {
    const ctx = {};
    ctx.version = options.package.version;
    ctx.StorybookBuilder = new StorybookBuilder();
    return ctx;
};
