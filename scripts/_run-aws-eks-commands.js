#!/usr/bin/env node

const yargs = require('yargs')
const { execSync } = require('child_process')
const { defaultProvider } = require('@aws-sdk/credential-provider-node')

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

/**
 * This function builds a Docker image using the provided parameters.
 * It logs the start of the process and then executes a Docker build command.
 *
 * @param {string} containerImage - The name of the Docker image to be built.
 * @param {string} builder - The Docker builder to use for building the image.
 * @param {string} target - The target stage in the Dockerfile to build.
 */
function buildDockerImage(containerImage, builder, target) {
  console.log(
    `Preparing docker image for restarting deployments - \uD83D\uDE48`,
  )
  const dirnameSafe = `"${__dirname}"`
  execSync(
    `${builder} build -f ${dirnameSafe}/Dockerfile.proxy --target ${target} -t ${containerImage} ${dirnameSafe}`,
  )
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
const restartService = async (args) => {
  const credentials = await getCredentials(args.profile)
  let containerImage = `restart-${args.service}`
  buildDockerImage(containerImage, `restart-deployment`)
  console.log(`Now running the restart - \uD83D\uDE31`)
  execSync(
    `${args.builder} run --rm --name ${args.service} -e AWS_ACCESS_KEY_ID=${credentials.accessKeyId} -e AWS_SECRET_ACCESS_KEY=${credentials.secretAccessKey} -e AWS_SESSION_TOKEN=${credentials.sessionToken} -e CLUSTER=${args.cluster} -e TARGET_SVC=${args.service} -e TARGET_NAMESPACE=${args.namespace} ${containerImage}`,
    { stdio: 'inherit' },
  )
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
 * @param {string} args['proxy-port'] - The port for the proxy to listen on.
 */
const runProxy = async (args) => {
  const credentials = await getCredentials(args.profile)
  const dockerBuild = `proxy-${args.service}`
  buildDockerImage(dockerBuild, args.builder, 'proxy')
  console.log(`Now running the proxy - \uD83D\uDE31`)
  console.log(
    `Proxy will be listening on http://localhost:${args['proxy-port']} - \uD83D\uDC42`,
  )
  const runCmd = [
    args.builder,
    `run`,
    `--name ${args.service}`,
    `--rm`,
    `-e AWS_ACCESS_KEY_ID="${credentials.accessKeyId}"`,
    `-e AWS_SECRET_ACCESS_KEY="${credentials.secretAccessKey}"`,
    `-e AWS_SESSION_TOKEN="${credentials.sessionToken}"`,
    `-e CLUSTER="${args.cluster}"`,
    `-e TARGET_SVC="${args.service}"`,
    `-e TARGET_NAMESPACE="${args.namespace}"`,
    `-e TARGET_PORT="${args.port}"`,
    `-e PROXY_PORT="${args['proxy-port']}"`,
    `-p ${args['proxy-port']}:${args['proxy-port']}`,
    dockerBuild,
  ]
  // console.debug('Args: ' + runCmd.join(' '))
  try {
    execSync(runCmd.join(' '), { stdio: 'inherit' })
  } catch (err) {
    console.error("Couldn't run the proxy - \uD83D\uDE31")
    console.error(`If the proxy is already running, try stopping it first with`)
    console.error(`\n    ${args.builder} stop ${args.service}\n`)
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
              default: 'dev-cluster01',
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
              default: 'dev-cluster01',
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
      .showHelpOnFail(true)
      .demandCommand().argv
  } catch (e) {
    throw e
  }
}

module.exports = {
  runProxy,
  restartService,
}
if (require.main === module) {
  main()
}
