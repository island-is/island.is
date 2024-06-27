// @ts-check
import { spawnSync } from "child_process";

const MAX_JOBS = getNumberFromEnv("MAX_JOBS") ?? 2;
const AFFECTED_JOBS = getArrayFromEnv("AFFECTED_PROJECTS");
const DD_CIVISIBILITY_AGENTLESS_ENABLED = process.env.DD_CIVISIBILITY_AGENTLESS_ENABLED || 'true';
const DD_SITE = process.env.DD_SITE || 'datadoghq.eu';
const DD_ENV = process.env.DD_ENV || 'ci';
const DD_SERVICE = process.env.DD_SERVICE || 'unit-test';
const DD_API_KEY = process.env.DD_API_KEY || '';
const NODE_OPTIONS = `--max-old-space-size=8193 --unhandled-rejections=warn ${process.env.NODE_OPTIONS ?? ""}`;

const SERVERSIDE_FEATURES_ON = ""; 

const env = {
    ...process.env,
    NODE_OPTIONS,
    DD_CIVISIBILITY_AGENTLESS_ENABLED,
    DD_SITE,
    DD_ENV,
    DD_SERVICE,
    DD_API_KEY,
    SERVERSIDE_FEATURES_ON
};


spawnSync("nx", ["run-many", `--parallel=${MAX_JOBS}`, "--target=test", `--projects=${AFFECTED_JOBS}`], { stdio: "inherit", env });


function getArrayFromEnv(key) {
    const envValue = process.env[key];
    if (envValue === undefined) {
        return []
    }

    return envValue.split(/[,\n]/);
}

function getNumberFromEnv(key) {
    const envValue = process.env[key];
    if (envValue === undefined) {
        return undefined
    }
    const value = parseInt(envValue, 10)
    if (isNaN(value)) {
        return undefined
    }
    return value
}
