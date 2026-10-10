const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const Issue = require("../models/issueModel");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

async function createIssue(req, res) {
  const { title, description } = req.body || {};
  const { id } = req.params; // repository id

  try {
    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid Repository ID!" });
    }
    if (!title) {
      return res.status(400).json({ error: "Issue title is required!" });
    }

    const repoExists = await Repository.exists({ _id: id });
    if (!repoExists) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    const issue = new Issue({
      title,
      description,
      repository: id,
    });
    await issue.save();

    await Repository.updateOne({ _id: id }, { $push: { issues: issue._id } });

    res.status(201).json(issue);
  } catch (err) {
    console.error("Error during issue creation : ", err.message);
    res.status(500).send("Server error");
  }
}

async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body || {};

  try {
    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid Issue ID!" });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    if (title !== undefined) issue.title = title;
    if (description !== undefined) issue.description = description;
    if (status !== undefined) issue.status = status;

    await issue.save();

    res.json({ message: "Issue updated", issue });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    console.error("Error during issue updation : ", err.message);
    res.status(500).send("Server error");
  }
}

async function deleteIssueById(req, res) {
  const { id } = req.params;

  try {
    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid Issue ID!" });
    }

    const issue = await Issue.findByIdAndDelete(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    await Repository.updateOne(
      { _id: issue.repository },
      { $pull: { issues: issue._id } }
    );

    res.json({ message: "Issue deleted" });
  } catch (err) {
    console.error("Error during issue deletion : ", err.message);
    res.status(500).send("Server error");
  }
}

async function getAllIssues(req, res) {
  const { id } = req.params; // repository id

  try {
    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid Repository ID!" });
    }

    const issues = await Issue.find({ repository: id });

    res.status(200).json(issues);
  } catch (err) {
    console.error("Error during issue fetching : ", err.message);
    res.status(500).send("Server error");
  }
}

async function getIssueById(req, res) {
  const { id } = req.params;

  try {
    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid Issue ID!" });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    res.json(issue);
  } catch (err) {
    console.error("Error during issue fetching : ", err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};