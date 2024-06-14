// @ts-check

const NX_BASE_KEY = "NX_BASE";
const NX_HEAD_KEY = "NX_HEAD";
const GITHUB_EVENT_NAME = "GITHUB_EVENT_NAME";

const REQUIRED_KEYS = [NX_BASE_KEY, NX_HEAD_KEY, GITHUB_EVENT_NAME];

export const IS_PULLREQUEST = process.env[GITHUB_EVENT_NAME] === "pull_request";
export const BASE = process.env[NX_BASE_KEY];
export const HEAD = process.env[NX_HEAD_KEY];

// For typeguarding
if (!BASE || !HEAD || !process.env[GITHUB_EVENT_NAME]) {
    const missingKeys = REQUIRED_KEYS.filter((key) => {
            return !process.env[key];
    }, []); 
    throw new Error(`Missing required environment variables: ${missingKeys.join(', ')}`);
}