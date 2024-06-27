// @ts-check
import { spawn } from "child_process";

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

try {
    console.log(`Running tests for ${AFFECTED_JOBS.join(',')} in parallel with ${MAX_JOBS} jobs`);
    await runCommand(`nx run-many  --parallel=${MAX_JOBS} --target=test --projects=${AFFECTED_JOBS.join(',')}`);
} catch (e) {
    console.error(`Failed running ${AFFECTED_JOBS.join(',')}`)
    process.exit(1);

}

process.exit(0);

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


/**
 * Run command in a child process.
 * @param {string} cmd
 * @param {string | undefined} cwd
 */
async function runCommand(cmd, cwd = undefined) {
    return new Promise((resolve, reject) => {
        const options = cwd ? { cwd, encoding: 'utf-8' } : {}
        options.env = env;
        options.encoding = 'utf-8'

        const [command, ...args] = Array.isArray(cmd) ? cmd : cmd.split(' ')

        const childProcess = spawn(command, args, options)
        childProcess.stdout.setEncoding('utf-8')
        const errorChunks = []
        const outputChunks = []

        childProcess.stdout.on('data', (data) => {
            // console.log(data.toString())
            outputChunks.push(data.toString())
        })

        childProcess.stderr.on('data', (data) => {
            console.error(data.toString())
            errorChunks.push(data.toString())
        })

        childProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(errorChunks.join('\n'))
                console.error(`Failed to run command: ${cmd} returning code ${code}`)
                console.log(outputChunks.join('\n'))
                reject(`Error: Process exited with code ${code}`)
                return
            }
            resolve(void 0)
        })

        childProcess.on('error', (error) => {
            console.log(errorChunks.join('\n'))
            // reject(`Error: ${error.message}`)
        })
    })
}