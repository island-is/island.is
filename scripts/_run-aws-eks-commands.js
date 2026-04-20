#!/usr/bin/env node

const yargs = require('yargs')
const { execSync } = require('child_process')
const { defaultProvider } = require('@aws-sdk/credential-provider-node')

function commandExistsSync(cmd) {
  try {
    execSync(`command -v ${cmd}`)
    return true
  } catch {
    return false
  }
}
// Determine the command for container operations
const containerer = (() => {
  if (commandExistsSync('podman')) {
    return 'podman'
  } else if (commandExistsSync('docker')) {
    return 'docker'
  }
  console.error('Please install podman or docker')
  return 'docker'
  // process.exit(1)
})()

function diffObjects(a, b) {
  const diff = { 'diff+': {}, 'diff-': {} }
  if (a === b) {
    return null
  }
  if (typeof a !== typeof b) {
    diff['diff-']['type'] = typeof a
    diff['diff+']['type'] = typeof b
    return diff
  }
  // Check if objects are arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      diff['diff-']['length'] = a.length
      diff['diff+']['length'] = b.length
    }
    a = [...a].sort()
    b = [...b].sort()
  }

  const secretPattern = /(key|token|secret)/i

  const arrayDiff = (a, b) => {
    diff['diff-'] = []
    diff['diff+'] = []
    for (const i in a) {
      if (!secretPattern.test(a[i]) && !b.includes(a[i])) {
        diff['diff-'].push(a[i])
      }
    }
    for (const i in b) {
      if (!secretPattern.test(b[i]) && !a.includes(b[i])) {
        diff['diff+'].push(b[i])
      }
    }
    if (diff['diff-'].length === 0 && diff['diff+'].length === 0) {
      return null
    }
    return diff
  }

  const objectDiff = (a, b) => {
    for (let key in a) {
      if (!secretPattern.test(a[key]) && a[key] !== b[key]) {
        diff['diff-'][key] = a[key]
      }
    }
    for (let key in b) {
      if (!secretPattern.test(b[key]) && a[key] !== b[key]) {
        diff['diff+'][key] = b[key]
      }
    }
    if (
      Object.keys(diff['diff-']).length === 0 &&
      Object.keys(diff['diff+']).length === 0
    ) {
      return null
    }
    return diff
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return arrayDiff(a, b)
  }
  return objectDiff(a, b)
}

/**
 * Asynchronously retrieves AWS credentials for a given profile.
 * If the credentials cannot be loaded, an error message is logged and the process is terminated.
 *
 * @param {Object} profile - The profile object to retrieve AWS credentials for.
 * @returns {Promise} A promise that resolves to the AWS credentials for the given profile.
 * @throws {CredentialsProviderError} If no AWS credentials could be loaded from any providers.
 */
const getCredentials = async (profile) => {
  return defaultProvider({ profile })().catch((err) => {
    if (err.name === 'CredentialsProviderError') {
      console.error(
        'Could not load AWS credentials from any providers. Did you forget to configure environment variables, aws profile or run `aws sso login`?',
      )
    } else {
      console.error(err)
    }
    process.exit(1)
  })
}

const argv = yargs(process.argv.slice(2))

const error = (errorMessage) => {
  console.error(errorMessage)
  process.exit(1)
}

async function mkRunCommand({
  profile,
  service,
  builder,
  cluster,
  namespace,
  port,
  proxyPort,
  containerImage,
}) {
  const credentials = await getCredentials(profile)
  const cmd = [
    builder ?? containerer,
    `run`,
    `--rm`,
    `--name ${service}`,
    `-e AWS_ACCESS_KEY_ID="${credentials.accessKeyId}"`,
    `-e AWS_SECRET_ACCESS_KEY="${credentials.secretAccessKey}"`,
    `-e AWS_SESSION_TOKEN="${credentials.sessionToken}"`,
    `-e CLUSTER="${cluster}"`,
    `-e TARGET_SVC="${service}"`,
    `-e TARGET_NAMESPACE="${namespace}"`,
    `-e TARGET_PORT="${port}"`,
    `-e PROXY_PORT="${proxyPort}"`,
    `-p "${proxyPort}:${proxyPort}"`,
    containerImage,
  ]
  return cmd
}

/**
 * This function builds a Docker image using the provided parameters.
 * It logs the start of the process and then executes a Docker build command.
 *
 * @param {string} containerImage - The name of the Docker image to be built.
 * @param {string} builder - The Docker builder to use for building the image.
 * @param {string} target - The target stage in the Dockerfile to build.
 */
function buildDockerImage(containerImage, builder, target) {
  if (!builder) {
    builder = containerer
  }
  console.log(
    `Preparing docker image for restarting deployments - \uD83D\uDE48`,
  )
  const dirnameSafe = `"${__dirname}"`
  const buildCmd = [
    builder,
    'buildx', // Require buildx to prevent accidental legacy building
    'build',
    '--load',
    `-f ${dirnameSafe}/Dockerfile.proxy`,
    `--target ${target}`,
    `-t ${containerImage}`,
    dirnameSafe,
  ]
  execSync(buildCmd.join(' '))
}

/**
 * Asynchronously restarts a service using Docker.
 *
 * This function first retrieves the AWS credentials for the specified profile.
 * It then builds a Docker image with a name based on the service to be restarted.
 * After logging a message, it executes a Docker run command with the necessary environment variables set,
 * including AWS credentials, cluster, target service, and namespace.
 * The Docker container is removed after execution.
 *
 * @param {Object} args - An object containing the necessary arguments.
 * @param {string} args.profile - The AWS profile to use for retrieving credentials.
 * @param {string} args.service - The name of the service to restart.
 * @param {string} args.builder - The command to run the Docker container.
 * @param {string} args.cluster - The cluster in which the service is located.
 * @param {string} args.namespace - The namespace in which the service is located.
 */
const restartService = async ({
  profile,
  service,
  builder,
  cluster,
  namespace,
}) => {
  const credentials = await getCredentials(profile)
  let containerImage = `restart-${service}`
  buildDockerImage(containerImage, `restart-deployment`)
  console.log(`Now running the restart - \uD83D\uDE31`)
  const runCmd = [
    builder,
    'run',
    '--rm',
    `--name ${service}`,
    `-e AWS_ACCESS_KEY_ID=${credentials.accessKeyId}`,
    `-e AWS_SECRET_ACCESS_KEY=${credentials.secretAccessKey}`,
    `-e AWS_SESSION_TOKEN=${credentials.sessionToken}`,
    `-e CLUSTER=${cluster}`,
    `-e TARGET_SVC=${service}`,
    `-e TARGET_NAMESPACE=${namespace}`,
    containerImage,
  ]
  if (
    diffObjects(
      mkRunCommand({ profile, service, builder, cluster, namespace }),
      runCmd,
    )
  ) {
    console.error(
      'New run command does not match previous run command, debug plz...',
    )
  }
  execSync(runCmd.join(' '), { stdio: 'inherit' })
}

/**
 * Asynchronously runs a proxy using Docker.
 *
 * This function first retrieves AWS credentials for a given profile, then builds a Docker image for a specified service.
 * It then logs that the proxy is running and the port it will be listening on.
 * The function then constructs a Docker run command with various environment variables and executes it.
 * If the command fails, it logs an error message and suggests stopping the proxy if it's already running.
 *
 * @param {Object} args - An object containing various arguments needed to run the proxy.
 * @param {string} args.profile - The AWS profile to retrieve credentials for.
 * @param {string} args.service - The service to build the Docker image for and run.
 * @param {string} args.builder - The Docker builder to use.
 * @param {string} args.cluster - The AWS cluster to use.
 * @param {string} args.namespace - The namespace to use.
 * @param {string} args.port - The port to use.
 * @param {string} args.proxyPort - The port for the proxy to listen on.
 */
const runProxy = async ({
  profile,
  service,
  builder,
  cluster,
  namespace,
  port,
  proxyPort,
}) => {
  if (!builder) {
    builder = containerer
  }
  if (!port || !proxyPort) {
    throw new Error(
      `Missing required arguments for running the proxy (port=${port}, proxyPort=${proxyPort})`,
    )
  }
  if (!service) {
    throw new Error(
      `Missing required argument for running the proxy (service=${service})`,
    )
  }
  const credentials = await getCredentials(profile)
  const dockerBuild = `proxy-${service}`
  buildDockerImage(dockerBuild, builder, 'proxy')
  console.log(`Now running the proxy - \uD83D\uDE31`)
  console.log(
    `Proxy will be listening on http://localhost:${proxyPort} - \uD83D\uDC42`,
  )
  const runCmd = await mkRunCommand({
    profile,
    service,
    builder,
    cluster,
    namespace,
    port,
    proxyPort,
    containerImage: dockerBuild,
  })
  const oldRunCmd = [
    builder,
    'run',
    '--rm',
    `--name ${service}`,
    `-e AWS_ACCESS_KEY_ID="${credentials.accessKeyId}"`,
    `-e AWS_SECRET_ACCESS_KEY="${credentials.secretAccessKey}"`,
    `-e AWS_SESSION_TOKEN="${credentials.sessionToken}"`,
    `-e CLUSTER="${cluster}"`,
    `-e TARGET_SVC="${service}"`,
    `-e TARGET_NAMESPACE="${namespace}"`,
    // Not in the old runCmd
    `-e PROXY_PORT="${proxyPort}"`,
    `-e TARGET_PORT="${port}"`,
    `-p "${proxyPort}:${proxyPort}"`,
    dockerBuild,
  ]
  const cmdDiff = diffObjects(runCmd, oldRunCmd)
  if (cmdDiff) {
    console.error(
      'New run command does not match previous run command, debug plz...',
      { cmdDiff },
    )
  }
  try {
    execSync(runCmd.join(' '), { stdio: 'inherit' })
  } catch (err) {
    console.error("Couldn't run the proxy - \uD83D\uDE31")
    console.error(`If the proxy is already running, try stopping it first with`)
    console.error(`\n    ${builder} stop ${service}\n`)
  }
}

async function main() {
  try {
    await argv
      .command(
        'proxy',
        'Run proxy',
        (yargs) =>
          yargs
            .option('port', {
              description:
                'Port number on which the Kubernetes service is listening on',
              default: 80,
            })
            .option('proxy-port', {
              description: 'Port number the local proxy is listening on',
              default: 8080,
            })
            .option('cluster', {
              description: 'Name of Kubernetes cluster',
              default: 'dev-cluster02',
            })
            .option('builder', {
              description: 'docker or podman',
              default: 'docker',
            })
            .demandOption(
              'namespace',
              'Name of the Kubernetes namespace the service is part of',
            )
            .option('profile', {
              description: 'AWS profile to use',
            })
            .demandOption('service', 'Name of the Kubernetes service')
            .check(function (argv) {
              if (!['docker', 'podman'].includes(argv.builder)) {
                throw new Error('Only docker or podman allowed')
              }
              return true
            }),
        runProxy,
      )
      .command(
        'restart-service',
        'Restart service (rolling update on the deployment)',
        (yargs) =>
          yargs
            .option('cluster', {
              description: 'Name of Kubernetes cluster',
              default: 'dev-cluster02',
            })
            .option('profile', {
              description: 'AWS profile to use',
            })
            .option('builder', {
              description: 'docker or podman',
              default: 'docker',
            })
            .demandOption(
              'namespace',
              'Name of the Kubernetes namespace the service is part of',
            )
            .demandOption('service', 'Name of the Kubernetes service'),
        restartService,
      )
      .parserConfiguration({
        'camel-case-expansion': true,
      })
      .showHelpOnFail(true)
      .demandCommand().argv
  } catch (e) {
    throw e
  }
}

module.exports = {
  runProxy,
  restartService,
  containerer,
}
if (require.main === module) {
  main()
}
