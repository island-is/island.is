#!/usr/bin/env node

import { execSync } from 'child_process'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { runProxy } from './_run-aws-eks-commands' // Importing runProxy

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

async function main() {
  const proxies = ['db', 'es', 'soffia', 'xroad', 'redis', 'all']
  const argv = yargs(hideBin(process.argv))
    .option('proxy', {
      type: 'option',
      description: 'Run only the specified proxy',
      choices: proxies,
      default: 'all',
    })
    // Add other options here as in the original script
    .showHelpOnFail(true)
    .help().argv

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

if (require.main === module) {
  main()
}
