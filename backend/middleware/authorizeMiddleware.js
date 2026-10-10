const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const Issue = require("../models/issueModel");

const isValid = (id) => mongoose.Types.ObjectId.isValid(id);

// Sirf repo ka owner (route me :id = repo id)
async function authorizeRepoOwner(req, res, next) {
  try {
    if (!isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid Repository ID!" });
    }
    const repo = await Repository.findById(req.params.id);
    if (!repo) return res.status(404).json({ error: "Repository not found!" });
    if (repo.owner.toString() !== String(req.user.id)) {
      return res.status(403).json({ error: "You are not allowed to do this" });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

// Issue ke repo ka owner (route me :id = issue id)
async function authorizeIssueOwner(req, res, next) {
  try {
    if (!isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid Issue ID!" });
    }
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: "Issue not found!" });
    const repo = await Repository.findById(issue.repository);
    if (!repo || repo.owner.toString() !== String(req.user.id)) {
      return res.status(403).json({ error: "You are not allowed to do this" });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

// Sirf apna hi profile (route me :id = user id)
function authorizeSelf(req, res, next) {
  if (req.params.id !== String(req.user.id)) {
    return res.status(403).json({ error: "You are not allowed to do this" });
  }
  next();
}

module.exports = { authorizeRepoOwner, authorizeIssueOwner, authorizeSelf };