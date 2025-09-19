// @ts-check

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const registryServer = process.env["NPM_REGISTRY_SERVER_PROXY"];

if (!registryServer) {
    throw new Error("NPM_REGISTRY_SERVER_PROXY is not set");
}

const rootDirectory = getRootDirectory();
[join(rootDirectory, ".yarnrc.yml"), join(rootDirectory, "infra", ".yarnrc.yml")].forEach(setYarnRegistry);


function setYarnRegistry(file) {
    const content = readFileSync(file, 'utf-8');
    if (content.includes("npmRegistryServer:")) {
        throw new Error(`File ${file} already has npmRegistryServer set`);
    }
    if (content.includes("unsafeHttpWhitelist:")) {
        throw new Error(`File ${file} already has unsafeHttpWhitelist set`);
    }
    const newContent = `${content}\nnpmRegistryServer: "${registryServer}"\nunsafeHttpWhitelist:\n\t- "${registryServer.replace("http://", "")}"\n`;
    console.log(`Setting registry in ${file}`);
    //console.log(newContent);
    // Write the file
    writeFileSync(file, newContent, "utf-8");
}

function getRootDirectory(currDir = process.env["GITHUB_WORKSPACE"] || process.cwd()) {
    // Check if folder has .git – this is just to being able to test this locally
    if (existsSync(join(currDir, ".git"))) {
        return currDir;
    }

    const parentDir = dirname(currDir);
    if (parentDir === currDir) {
        throw new Error("Could not find root directory");
    }

    return getRootDirectory(parentDir);
}




