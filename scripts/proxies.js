#!/usr/bin/env node

const { execSync } = require('child_process')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const { runProxy } = require('./_run-aws-eks-commands')

/**
 * Executes a given shell command synchronously.
 * If the command fails, an error message is displayed and the process exits.
 *
 * @param {string} command - The command to execute.
 */
function executeCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' })
  } catch (error) {
    console.error(`Failed to execute command: ${command}`)
    console.error(error.message)
    process.exit(1)
  }
}

/**
 * Determines the container tool to use (either podman or docker).
 * If neither is found, the process exits with an error message.
 *
 * @returns {string} The container command tool.
 */
function determineContainerTool() {
  if (!process.env.NO_DRY) return 'echo DRY: podman'
  try {
    execSync('command -v podman', { stdio: 'ignore' })
    return 'podman'
  } catch {
    try {
      execSync('command -v docker', { stdio: 'ignore' })
      return 'docker'
    } catch {
      console.error('Please install podman or docker')
      process.exit(1)
    }
  }
}

/**
 * Runs a specified proxy script in a detached process.
 * It handles restarting the proxy on exit based on the provided interval.
 *
 * @param {string} proxy - The name of the proxy.
 * @param {Object} options - The options object containing interval and removeContainers flags.
 */
function runProxyScript(proxy, options) {
  const containerName = getContainerName(proxy)

  if (options.removeContainers) {
    removeContainer(containerName, options.removeContainers)
  }

  console.log(`Starting ${proxy} proxy`)
  const proxyArgs = {
    namespace: options.namespace,
    service: `proxy-${proxy}`,
    port: options.port,
    'proxy-port': options['proxy-port'],
    cluster: process.env.CLUSTER || 'dev-cluster01',
    builder: determineContainerTool(),
  }

  runProxy(proxyArgs).catch((err) => {
    console.error(`Failed to run ${proxy} proxy: ${err.message}`)
    process.exit(1)
  })
}

/**
 * Extracts the container name from a given proxy name.
 * This is a simplified version of the original function.
 *
 * @param {string} proxy - The name of the proxy.
 * @returns {string} The container name.
 */
function getContainerName(proxy) {
  return proxy === 'es' ? 'es-proxy' : `${proxy}-proxy`
}

/**
 * Removes a container with the given name.
 *
 * @param {string} containerName - The name of the container to remove.
 * @param {boolean} force - Whether to force the removal.
 */
function removeContainer(containerName, force) {
  console.log('Removing containers...')
  const containerTool = determineContainerTool()
  executeCommand(`${containerTool} rm ${force ? '-f' : ''} ${containerName}`)
}

const startProxies = (args) => {
  const proxies = args.proxyies
  const selectedProxies = proxies.filter(
    (proxy) =>
      argv[proxy] || argv.proxy.includes(proxy) || argv.proxy.includes('all'),
  )

  for (const proxy of selectedProxies) {
    runProxyScript(proxy, {
      interval: argv.interval,
      removeContainers: argv.removeContainers,
    })
  }
}

async function main() {
  const proxies = ['db', 'es', 'soffia', 'xroad', 'redis', 'all']
  // .demandCommand()
  const argv = yargs(hideBin(process.argv))
  // const argv = yargs(process.argv.slice(2))

  await argv
    .command(
      'proxy',
      'Run proxy',
      (yargs) =>
        yargs
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
      startProxies,
    )
    .showHelpOnFail(true)
    .demandCommand().argv
  const args = yargs(hideBin(process.argv)).command(
    'proxy',
    'Start proxies',
    (yargs) =>
      yargs

        // .command(
        //   'proxy',
        //   'Start proxies',
        //   (yargs) =>
        //     yargs
        .option('proxies', {
          description: 'Name of the proxy to start',
          default: 'all',
          choices: proxies,
        })
        .alias('proxy')
        .option('interval', {
          description: 'Seconds between proxy restarts',
          default: 60,
        })
        .option('port', {
          description:
            'Port number on which the Kubernetes service is listening on',
          default: 80,
        })
        .option('builder', {
          description: 'docker or podman',
          default: 'docker',
        })
        // startProxies,
        // )
        .showHelpOnFail(true)
        .help().argv,
  )

  // startProxies(args)
}

if (require.main === module) {
  main()
}
