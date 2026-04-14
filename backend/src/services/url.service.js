const urlRepo = require("../repositories/url.repository");
const {encodeBase62} = require("../utils/base62");

class UrlService {
    async createShortUrl(originalUrl){
        const url = await urlRepo.create(originalUrl);
        const shortKey = encodeBase62(url.id);
        const updated = await urlRepo.updateShortKey(url.id, shortKey);

        return updated;
    }

    async getByShortKey(shortKey){
        return urlRepo.findByShortKey(shortKey);
    }
}
module.exports = new UrlService();