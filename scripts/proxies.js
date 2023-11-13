#!/usr/bin/env node

const { execSync, spawn } = require('child_process')
const fs = require('fs')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

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
  const scriptPath = `./scripts/run-${proxy}-proxy.sh`
  const containerName = getContainerNameFromScript(scriptPath, proxy)

  if (options.removeContainers) {
    removeContainer(containerName, options.removeContainers)
  }

  console.log(`Starting ${proxy} proxy`)
  spawn(scriptPath, [], { detached: true, stdio: 'inherit' }).on(
    'exit',
    (code) => {
      handleProxyExit(code, proxy, containerName, options)
    },
  )
}

/**
 * Extracts the container name from a given script file.
 * If the script file can't be read, the process exits with an error.
 *
 * @param {string} scriptPath - The path to the script file.
 * @param {string} proxy - The name of the proxy.
 * @returns {string} The extracted container name.
 */
function getContainerNameFromScript(scriptPath, proxy) {
  try {
    const scriptContent = fs.readFileSync(scriptPath, 'utf8')
    const match = scriptContent.match(/(?<=--service )\S+/)
    return match ? match[0] : proxy === 'es' ? 'es-proxy' : ''
  } catch (error) {
    console.error(`Error reading container name for ${proxy}`)
    process.exit(1)
  }
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

/**
 * Handles the exit of a proxy script, including restarting it after a specified interval.
 *
 * @param {number} code - The exit code of the proxy script.
 * @param {string} proxy - The name of the proxy.
 * @param {string} containerName - The name of the related container.
 * @param {Object} options - Options containing interval and removeContainers flags.
 */
function handleProxyExit(code, proxy, containerName, options) {
  console.log(`Exit code for ${proxy} proxy: ${code}`)
  if (code === 1) process.exit(1)
  console.log(`Restarting ${proxy} proxy in ${options.interval} seconds...`)
  setTimeout(() => {
    if (options.removeContainers) {
      console.log(`Removing container ${containerName}...`)
      removeContainer(containerName, options.removeContainers)
    }
  }, options.interval * 1000)
}

/**
 * Main function to process command line arguments and initiate proxy scripts.
 */
async function main() {
  const argv = yargs(hideBin(process.argv))
    // Define options here as in the original script
    .help().argv

  const proxies = ['db', 'es', 'soffia', 'xroad', 'redis'].filter(
    (proxy) =>
      argv[proxy] || (!argv.es && !argv.soffia && !argv.xroad && !argv.redis),
  )

  for (const proxy of proxies) {
    runProxyScript(proxy, {
      interval: argv.interval,
      removeContainers: argv.removeContainers,
    })
  }
}

main()
