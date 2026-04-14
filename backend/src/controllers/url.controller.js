const urlService = require("../services/url.service");
const { baseUrl } = require("../config/env");

class UrlController {
  async createShortUrl(req, res) {
    try {
      const { originalUrl } = req.body;
      if (!originalUrl) {
        return res.status(400).json({ error: "originalUrl is required" });
      }

      const result = await urlService.createShortUrl(originalUrl);
      return res.status(201).json({
        shortUrl: `${baseUrl}/${result.short_key}`,
        data: result,
      });
    } catch (err) {
      console.error(`createShortUrl Error: ${err}`);
      return res
        .status(500)
        .json({ error: `Internal Server Error` });
    }
  }

  async redirect(req, res) {
    try {
      const { shortKey } = req.params;
      const url = await urlService.getByShortKey(shortKey);
      if (!url) {
        return res.status(404).json({ error: "URL not found" });
      }
      return res.redirect(url.original_url);
    } catch (err) {
      console.error(`Redirect Error: ${err}`);
      return res
        .status(500)
        .json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new UrlController();
