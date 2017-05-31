exports.StorageService = class StorageService {
  constructor(bucket) {
    this._bucket = bucket;
    this._expiresIn = 1000 * 60 * 60;
  }

  async createUploadUrls(packageHost, packageName, packageVersion, bundleFiles) {
    const expires = Date.now() + this._expiresIn;
    const promises = bundleFiles.map(path => {
      const filePath = `${packageHost}/${packageName}/${packageVersion}/${path}`;
      return this._createSignedUrl(filePath, expires);
    });
    return Promise.all(promises);
  }

  async _createSignedUrl(filePath, expires) {
    const file = this._bucket.file(filePath);
    return file.getSignedUrl({ action: 'write', expires });
  }
};
