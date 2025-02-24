// @ts-check
import fs from "node:fs";
import { execSync } from "node:child_process";
import core from "@actions/core";
import github from "@actions/github";

const context = github.context;
const branch = getBranch();
const typeOfDeployment = getTypeOfDeployment();
const sha = context.sha;
const name = getArtifactname();
const url = `https://api.github.com/repos/island-is/island.is/actions/artifacts?name=${name}`;

const _KEY_HAS_OUTPUT = 'MQ_HAS_OUTPUT';
const _KEY_OUTPUT = 'MQ_OUTPUT';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

await download();

async function download() {
    const value = await (await fetch(url)).json();
    if (value.total_count === 0) {
        console.error(`No artifacts found for ${name}`);
        core.setOutput(_KEY_HAS_OUTPUT, "false");
        core.setOutput(_KEY_OUTPUT, "[]");
        process.exit(0);
    }
    const artifact = value.artifacts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    const downloadUrl = artifact.archive_download_url;
    console.log(`Downloading from ${downloadUrl}...`);
    const artifactZipResponse = await fetch(downloadUrl, {
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: 'application/json',
        },
    });
    const zipBuffer = Buffer.from(await artifactZipResponse.arrayBuffer());
    const zipFileName = '/tmp/artifact.zip';
    console.log(`Saved artifact to ${zipFileName}.`);

    const outputDir = '/tmp/artifact_unzip';
    fs.writeFileSync(zipFileName, zipBuffer);

    try {
        execSync(`unzip -o ${zipFileName} -d ${outputDir}`, { stdio: 'inherit' });
        console.log(`Unzipped artifact to ${outputDir}/`);
    } catch (err) {
        console.error('Failed to unzip artifact:', err);
        process.exit(1);
    }
    const fileName = `${outputDir}/data.json`;
    if (!fs.existsSync(fileName)) {
        console.error(`File "${fileName}" not found in unzipped artifact.`);
        process.exit(0);
    }

    const fileData = fs.readFileSync(fileName, 'utf-8');
    const parsedData = JSON.parse(fileData);
    console.log(JSON.stringify(parsedData, null, 2));
    core.setOutput(_KEY_HAS_OUTPUT, "true");
    core.setOutput(_KEY_OUTPUT, parsedData);
}

function getBranch() {
    if (context.eventName === "push") {
        return context.ref.replace('refs/heads/', '');
    }
    throw new Error(`Unsupported event: ${context.eventName}`);
}

function getTypeOfDeployment() {
    if (branch === 'main') {
        return {
            dev: true,
            prod: false
        }
    }
    if (branch.startsWith('release')) {
        return {
            dev: false,
            prod: true
        }
    }
    return {
        dev: false,
        prod: false
    }
}

function getArtifactname() {
    if (typeOfDeployment.dev) {
        return `main-${sha}`;
    }
    if (typeOfDeployment.prod) {
        return `release-${sha}`;
    }
    console.error(`UNSUPPORTED - WILL BE USING TEST CONST`);
    return 'pr-18084';
}