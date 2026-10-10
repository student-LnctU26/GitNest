const path = require("path");

// Local "remote" storage (S3 ki jagah)
const REMOTE_PATH = path.resolve(__dirname, "..", "remote-storage");

module.exports = { REMOTE_PATH };