// @ts-check
import fs from "node:fs";
import { execSync } from "node:child_process";
import core from "@actions/core";

const name = 'pr-18084';
const url = `https://api.github.com/repos/island-is/island.is/actions/artifacts?name=${name}`;
const _KEY_HAS_OUTPUT = 'MQ_HAS_OUTPUT';
const _KEY_OUTPUT = 'MQ_OUTPUT';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;


async function download() {
    const value = await (await fetch(url)).json();
    console.log(value);
    if (value.total_count === 0) {
        console.error(`No artifacts found for ${name}`);
        core.setOutput(_KEY_HAS_OUTPUT, "false");
        core.setOutput(_KEY_OUTPUT, "[]");
        process.exit(0);
    }
    const artifact = value.artifacts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    const downloadUrl = artifact.archive_download_url;
    const artifactZipResponse = await fetch(downloadUrl, {
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github+json',
        },
    });
    const zipBuffer = Buffer.from(await artifactZipResponse.arrayBuffer());
    const zipFileName = 'artifact.zip';
    fs.writeFileSync(zipFileName, zipBuffer);
    console.log(`Saved artifact to ${zipFileName}.`);

    const outputDir = '/tmp/artifact_unzip';
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

download();
