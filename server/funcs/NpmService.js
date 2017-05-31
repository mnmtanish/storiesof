const npmUserPackages = require('npm-user-packages');

exports.NpmService = class NpmService {
  async isPackageAuthor(username, packageName) {
    const packages = await this._getNpmUserPackages(username);
    const packageInfo = packages.find(p => p.name === packageName);
    if (!packageInfo) {
      return false;
    }
    if (!packageInfo.permissions !== 'write') {
      return false;
    }
    return true;
  }

  async _getNpmUserPackages(username) {
    try {
      return await npmUserPackages(username);
    } catch (err) {
      return [];
    }
  }
};
