#!/usr/bin/env node

const yargs = require('yargs')
const { exec } = require('child_process')
const { sleep } = require('util').promisify(setTimeout)
const { runProxy, restartService } = require('./_run-aws-eks-commands')

// Define your CLI arguments using yargs
const argv = yargs
  .option('remove-containers-on-start', {
    alias: 'f',
    type: 'boolean',
    description: 'Remove containers on start',
  })
  .option('remove-containers-on-fail', {
    type: 'boolean',
    description: 'Remove containers on failure',
  })
  .option('remove-containers-force', {
    type: 'boolean',
    description: 'Force remove containers',
  })
  .option('restart-interval-time', {
    alias: 'i',
    type: 'number',
    default: 3,
    description: 'Restart interval time',
  }).argv

// Determine the command for container operations
const containerCmd = (() => {
  return 'podman'
  if (commandExistsSync('podman')) {
    return 'podman'
  } else if (commandExistsSync('docker')) {
    return 'docker'
  }
  console.error('Please install podman or docker')
  process.exit(1)
})()

function commandExistsSync(cmd) {
  try {
    execSync(`command -v ${cmd}`)
    return true
  } catch {
    return false
  }
}

// Main function
async function main() {
  const proxies = ['es', 'soffia', 'xroad', 'redis']

  for (const proxy of proxies) {
    const containerName = `proxy-${proxy}`

    if (argv.removeContainersOnStart) {
      console.log('Removing containers...')
      execSync(
        `${containerCmd} rm ${
          argv.removeContainersForce ? '-f' : ''
        } ${containerName}`,
      )
    }

    console.log(`Starting ${proxy} proxy`)
    startProxy(proxy, containerName)
  }
}

function startProxy(proxy, containerName) {
  runProxy({})

  const process = exec(`./scripts/run-${proxy}-proxy.sh ...`) // Pass the required arguments

  process.on('exit', (code) => {
    console.log(`Exit code for ${proxy} proxy: ${code}`)
    if (code === 1) process.exit(1)

    console.log(
      `Restarting ${proxy} proxy in ${argv.restartIntervalTime} seconds...`,
    )
    setTimeout(() => {
      if (argv.removeContainersOnFail) {
        console.log(`Removing container ${containerName}...`)
        execSync(
          `${containerCmd} rm ${
            argv.removeContainersForce ? '-f' : ''
          } ${containerName}`,
        )
      }
      startProxy(proxy, containerName)
    }, argv.restartIntervalTime * 1000)
  })
}

main()
