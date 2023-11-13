const { execSync, spawn } = require('child_process')
const fs = require('fs')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const {
  error,
  getCredentials,
  buildDockerImage,
} = require('./_run-aws-eks-commands')

const argv = yargs(hideBin(process.argv))
  .option('es', {
    type: 'boolean',
    description: 'Run ES proxy',
    default: false,
  })
  .option('soffia', {
    type: 'boolean',
    description: 'Run Soffia proxy',
    default: false,
  })
  .option('xroad', {
    type: 'boolean',
    description: 'Run Xroad proxy',
    default: false,
  })
  .option('redis', {
    type: 'boolean',
    description: 'Run Redis proxy',
    default: false,
  })
  .option('remove-containers', {
    alias: 'f',
    type: 'boolean',
    description: 'Remove containers on start and on fail',
    default: false,
  })
  .option('interval', {
    alias: 'i',
    type: 'number',
    description: 'Restart interval time',
    default: 3,
  })
  .help().argv

function containerer(command) {
  let builderCmd = ''
  try {
    execSync('command -v podman', { stdio: 'ignore' })
    builderCmd = 'podman'
  } catch {
    try {
      execSync('command -v docker', { stdio: 'ignore' })
      builderCmd = 'docker'
    } catch {
      console.error('Please install podman or docker')
      process.exit(1)
    }
  }
  execSync(`${builderCmd} ${command}`, { stdio: 'inherit' })
}

async function main() {
  const proxies = ['es', 'soffia', 'xroad', 'redis'].filter(
    (proxy) =>
      argv[proxy] || (!argv.es && !argv.soffia && !argv.xroad && !argv.redis),
  )

  for (const proxy of proxies) {
    let containerName = ''
    try {
      const scriptContent = fs.readFileSync(
        `./scripts/run-${proxy}-proxy.sh`,
        'utf8',
      )
      const match = scriptContent.match(/(?<=--service )\S+/)
      if (match) containerName = match[0]
    } catch (error) {
      console.error(`Error reading container name for ${proxy}`)
      process.exit(1)
    }

    if (proxy === 'es') containerName = 'es-proxy'

    if (argv.removeContainers) {
      console.log('Removing containers...')
      containerer(`rm ${argv.removeContainers ? '-f' : ''} ${containerName}`)
    }

    console.log(`Starting ${proxy} proxy`)

    spawn('./scripts/run-' + proxy + '-proxy.sh', [], {
      detached: true,
      stdio: 'inherit',
    }).on('exit', (code) => {
      console.log(`Exit code for ${proxy} proxy: ${code}`)
      if (code === 1) process.exit(1)
      console.log(`Restarting ${proxy} proxy in ${argv.interval} seconds...`)
      setTimeout(() => {
        if (argv.removeContainers) {
          console.log(`Removing container ${containerName}...`)
          containerer(
            `rm ${argv.removeContainers ? '-f' : ''} ${containerName}`,
          )
        }
      }, argv.interval * 1000)
    })
  }
}

main()
