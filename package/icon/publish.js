const shelljs = require("shelljs");

shelljs.config.fatal = true;

async function main() {
  // 版本+1
  shelljs.exec("npm version patch");

  // 发布npm
  shelljs.exec(
    `pnpm publish -F ${
      require("./package.json").name
    } --access public --no-git-checks`
  );

  // 更新git
  shelljs.exec("git add package.json");
  const packageJson = require("./package.json");
  shelljs.exec(`git commit -m "${packageJson.name} ${packageJson.version}"`);
  shelljs.exec(`git push origin main`);
}

main();