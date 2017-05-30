const { NpmService } = require('./NpmService');
const { StorageService } = require('./StorageService');
const { UserService } = require('./UserService');

exports.createContext = options => {
    const ctx = {};
    ctx.version = options.package.version;
    ctx.NpmService = new NpmService();
    ctx.StorageService = new StorageService();
    ctx.UserService = new UserService();
    return ctx;
};
