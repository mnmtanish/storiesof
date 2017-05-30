exports.UserService = class UserService {
    async register(username, password) {
        return 'test-user-id';
    }

    async getAuthToken(username, password) {
        return 'test-auth-token';
    }

    async parseToken(authToken) {
        return { username: '' };
    }
};
