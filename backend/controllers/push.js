const fs = require("fs").promises;
const path = require("path");
const { REMOTE_PATH } = require("../config/storage-config");

async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".GitNest");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDirs = await fs.readdir(commitsPath);

    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const remoteCommitPath = path.join(REMOTE_PATH, "commits", commitDir);
      await fs.mkdir(remoteCommitPath, { recursive: true });

      const files = await fs.readdir(commitPath);
      for (const file of files) {
        await fs.copyFile(
          path.join(commitPath, file),
          path.join(remoteCommitPath, file)
        );
      }
    }

    console.log("All commits pushed to remote storage.");
  } catch (err) {
    console.error("Error pushing : ", err);
  }
}

module.exports = { pushRepo };