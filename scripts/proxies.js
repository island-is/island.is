#!/usr/bin/env node

const yargs = require('yargs')
const { exec } = require('child_process')
const { execSync } = require('child_process')
const {
  runProxy,
  restartService,
  containerer,
} = require('./_run-aws-eks-commands')

const proxies = ['es', 'soffia', 'xroad', 'redis']
const proxyConfig = {
  es: {
    namespace: 'es-proxy',
    containerName: 'es-proxy',
    port: 9200,
    proxyPort: 9200,
  },
  soffia: {
    namespace: 'socat',
    containerName: 'socat-soffia',
    port: 443,
    proxyPort: 8443,
  },
  xroad: {
    namespace: 'socat',
    containerName: 'socat-xroad',
    port: 80,
    proxyPort: 8081,
  },
  db: {
    namespace: 'socat',
    containerName: 'socat-db',
    port: 5432,
    proxyPort: 5432,
  },
  redis: {
    namespace: 'socat',
    containerName: 'socat-redis',
    port: 6379,
    proxyPort: 6379,
  },
}

// Define your CLI arguments using yargs
const argv = yargs
  .option('remove-containers-on-start', {
    alias: 's',
    type: 'boolean',
    description: 'Remove containers on start',
  })
  .option('remove-containers-on-fail', {
    alias: 'e',
    type: 'boolean',
    description: 'Remove containers on fail',
  })
  .option('remove-containers-force', {
    alias: 'f',
    type: 'boolean',
    description: 'Force remove containers',
  })
  .option('restart-interval-time', {
    alias: 'i',
    type: 'number',
    default: 3,
    description: 'Restart interval time',
  })
  .option('cluster', {
    type: 'string',
    description: 'Name of Kubernetes cluster',
    choices: [
      'dev-cluster01',
      'staging-cluster01',
      'prod-cluster01',
      'shared-cluster01',
    ],
    default: 'dev-cluster01',
  })
  .option('builder', {
    type: 'string',
    description: 'docker or podman',
    default: 'docker',
  })
  .option('service', {
    type: 'array',
    default: proxies,
    description: 'Name of the proxies',
    choices: proxies,
  })
  .help()
  .alias('help', 'h')
  .check((args) => args.service.length > 0).argv

if (argv.removeContainersForce) {
  argv.removeContainersOnFail = true
  argv.removeContainersOnStart = true
}

// Main function
async function main() {
  for (const proxy of proxies) {
    if (!argv.service.includes(proxy)) continue
    if (argv.removeContainersOnStart) {
      await removeProxy(proxy)
    }

    console.log(`Starting ${proxy} proxy`)
    startProxy(proxy, argv)
  }
}

async function removeProxy(proxy) {
  if (!proxy) {
    throw new Error('No proxy specified')
  }
  const containerName = proxyConfig[proxy].containerName

  const listContainersCmd = [containerer, 'ps', '-a']
  const containerExists = execSync(listContainersCmd.join(' '))
    .toString()
    .match(containerName)

  if (!containerExists) {
    return
  }

  console.log('Removing containers...')
  const stopContainerCmd = [
    containerer,
    'stop',
    argv.removeContainersForce ? '-f' : '',
    containerName,
  ]
  const removeContainerCmd = [
    containerer,
    'rm',
    argv.removeContainersForce ? '-f' : '',
    containerName,
  ]
  console.log('Executing: ', stopContainerCmd)
  execSync(stopContainerCmd.join(' '))
  console.log('Executing: ', stopContainerCmd)
  execSync(removeContainerCmd.join(' '))
}

async function startProxy(proxy, args) {
  await runProxy({
    ...args,
    namespace: proxyConfig[proxy].namespace,
    service: proxy,
    ...proxyConfig[proxy],
  })

  console.log(
    `Restarting ${proxy} proxy in ${argv.restartIntervalTime} seconds...`,
  )
  setTimeout(() => {
    if (argv.removeContainersOnFail) {
      console.log(`Removing proxy ${proxy}...`)
      removeProxy(proxy)
    }
    startProxy(proxy, args)
  }, argv.restartIntervalTime * 1000)
}

main()
