// @ts-check

import githubAppJwt from "universal-github-app-jwt";
import core from "@actions/core";

const APP_ID = process.env.APP_ID;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!APP_ID || !PRIVATE_KEY) {
    throw new Error("Missing required environment variables");
}

const authData = await githubAppJwt({
    id: APP_ID,            // GitHub App's ID (or Client ID)
    privateKey: PRIVATE_KEY  // the PEM private key string
});


const installationRest = await fetch(`https://api.github.com/app/installations/${APP_ID}/access_tokens`, {
    headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${authData.token}`
    }
});

const installationJson = await installationRest.json();
core.setOutput('NEW_TOKEN', installationJson.token);

