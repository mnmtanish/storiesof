const npmUserPackages = require('npm-user-packages');

exports.NpmService = class NpmService {
  async isPackageAuthor(username, packageName) {
    const packages = await npmUserPackages(username);
    if (!packages) {
      throw new Error(`No npm user exists with name ${username}`);
    }
    const packageInfo = packages.find(p => p.name === packageName);
    if (!packageInfo) {
      throw new Error(`No npm package exists with name ${packageName} for user ${username}`);
    }
    if (!packageInfo.permissions !== 'write') {
      throw new Error(`User ${username} doesn't have write access for package ${packageName}`);
    }
    return true;
  }
};
