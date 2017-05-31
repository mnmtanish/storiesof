const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');
const { NpmService } = require('./NpmService');
const { StorageService } = require('./StorageService');
const { UserService } = require('./UserService');

exports.createContext = async options => {
    const ctx = {};

    const db = await MongoClient.connect(options.mongoUrl);
    const userCol = db.collection('user');
    await userCol.createIndexes([
        { key: { username: 1 }, unique: true },
    ]);

    const mailer = nodemailer.createTransport(options.smtpUrl);

    ctx.version = options.package.version;
    ctx.NpmService = new NpmService();
    ctx.StorageService = new StorageService();
    ctx.UserService = new UserService(userCol, mailer, options.jwtSecret);

    return ctx;
};
