const fs = require("fs").promises;
const path = require("path");
const { REMOTE_PATH } = require("../config/storage-config");

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".GitNest");
  const commitsPath = path.join(repoPath, "commits");
  const remoteCommitsPath = path.join(REMOTE_PATH, "commits");

  try {
    const commitDirs = await fs.readdir(remoteCommitsPath);

    for (const commitDir of commitDirs) {
      const localCommitDir = path.join(commitsPath, commitDir);
      await fs.mkdir(localCommitDir, { recursive: true });

      const files = await fs.readdir(path.join(remoteCommitsPath, commitDir));
      for (const file of files) {
        await fs.copyFile(
          path.join(remoteCommitsPath, commitDir, file),
          path.join(localCommitDir, file)
        );
      }
    }

    console.log("All commits pulled from remote storage.");
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("Nothing to pull yet. Run push first.");
    } else {
      console.error("Unable to pull : ", err);
    }
  }
}

module.exports = { pullRepo };