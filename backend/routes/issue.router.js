const express = require("express");
const issueController = require("../controllers/issueController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  authorizeRepoOwner,
  authorizeIssueOwner,
} = require("../middleware/authorizeMiddleware");

const issueRouter = express.Router();

issueRouter.post("/issue/create/:id", authMiddleware, authorizeRepoOwner, issueController.createIssue);
issueRouter.put("/issue/update/:id", authMiddleware, authorizeIssueOwner, issueController.updateIssueById);
issueRouter.delete("/issue/delete/:id", authMiddleware, authorizeIssueOwner, issueController.deleteIssueById);
issueRouter.get("/issue/all/:id", issueController.getAllIssues);
issueRouter.get("/issue/:id", issueController.getIssueById);

module.exports = issueRouter;