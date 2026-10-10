const express = require("express");
const repoController = require("../controllers/repoController");
const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRepoOwner } = require("../middleware/authorizeMiddleware");

const repoRouter = express.Router();

repoRouter.post("/repo/create", authMiddleware, repoController.createRepository);
repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/repo/user/:userID", repoController.fetchRepositoriesForCurrentUser);
repoRouter.put("/repo/update/:id", authMiddleware, authorizeRepoOwner, repoController.updateRepositoryById);
repoRouter.patch("/repo/toggle/:id", authMiddleware, authorizeRepoOwner, repoController.toggleVisibilityById);
repoRouter.delete("/repo/delete/:id", authMiddleware, authorizeRepoOwner, repoController.deleteRepositoryById);

module.exports = repoRouter;