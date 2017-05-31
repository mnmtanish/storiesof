const crypto = require('crypto');
const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const npmEmail = require('npm-email');

exports.UserService = class UserService {
    constructor(userCol, mailer, jwtSecret) {
        this._userCol = userCol;
        this._mailer = mailer;
        this._jwtSecret = jwtSecret;
        this._jwtOptions = { algorithms: ['HS256'] }
    }

    async register(username, password) {
        const userEmail = await npmEmail(username);
        if (!userEmail) {
            throw new Error(`No npm user exists with name ${username}`);
        }
        const passwordSHA1 = this._createPasswordHash(password);
        const _id = this._createNewUserId();
        const doc = { _id, username, userEmail, passwordSHA1, verified: false };
        await this._userCol.insert(doc);
        await this._sendVerifyEmail(username, userEmail);
        return this._createAuthToken(username);
    }

    async verifyUserEmail(emailToken) {
        const token = jwt.verify(emailToken, this._jwtSecret, this._jwtOptions)
        const username = token.data.u;
        await this._userCol.update({ username }, { $set: { verified: true } });
    }

    async resendVerifyEmail(username, password) {
        const user = await this._getUserOrError(username, password);
        await this._sendVerifyEmail(username, userEmail);
    }

    async getAuthToken(username, password) {
        const user = await this._getUserOrError(username, password);
        return this._createAuthToken(username);
    }

    async getTokenUser(authToken) {
        const token = jwt.verify(authToken, this._jwtSecret, this._jwtOptions)
        return token.data.u;
    }

    async _getUserOrError(username, password) {
        const passwordSHA1 = this._createPasswordHash(password);
        const user = await this._userCol.findOne({ username, passwordSHA1, verified: true });
        if (!user) {
            throw new Error('invalid username or password');
        }
        return user;
    }

    _sendVerifyEmail(username, userEmail) {
        const token = this._createEmailToken(username)
        return this._mailer.sendMail({
            from: '"StoriesOf" <noreply@storiesof.io>',
            to: userEmail,
            subject: 'Verify Email',
            text: `Token: ${token}`,
            html: `<pre>Token: ${token}</pre>`,
        });
    }

    _createNewUserId() {
        return uuid();
    }

    _createPasswordHash(password) {
        const sha1 = crypto.createHash('sha1');
        sha1.update(password);
        return sha1.digest('hex');
    }

    _createAuthToken(username) {
        const data = { u: username };
        return jwt.sign({ data }, this._jwtSecret);
    }

    _createEmailToken(username) {
        const data = { u: username };
        return jwt.sign({ data }, this._jwtSecret);
    }
};
