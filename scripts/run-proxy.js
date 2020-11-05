#!/usr/bin/env node
const yargs = require('yargs')
const argv = yargs(process.argv.slice(2))
const { execSync } = require('child_process')

const error = (errorMessage) => {
  console.error(errorMessage)
  process.exit(1)
}

const checkPresenceAWSAccessVars = () => {
  const awsCredsEnvVars = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_SESSION_TOKEN',
  ]
  const valuesPresent = awsCredsEnvVars
    .map((key) => process.env[key])
    .filter((v) => !!v)
  if (valuesPresent.length != awsCredsEnvVars.length)
    error(
      'Missing AWS envronment variables\n\nYou need to login to AWS portal and get some env variables as in step 1 here - https://github.com/island-is/handbook/blob/master/dockerizing.md#troubleshooting\nThen simply re-run the script',
    )
}

const args = argv
  .option('port', {
    description: 'Port number on which the Kubernetes service is listening on',
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
  .demandOption(
    'namespace',
    'Name of the Kubernetes namespace the service is part of',
  )
  .demandOption('service', 'Name of the Kubernetes service')
  .help().argv

checkPresenceAWSAccessVars()

console.log(`Preparing docker image for the local proxy - \uD83D\uDE48`)
execSync(
  `docker build -f ${__dirname}/Dockerfile.proxy -t ${args.service} ${__dirname}`,
)

console.log(`Now running the proxy - \uD83D\uDE31`)
console.log(
  `Proxy will be listening on http://localhost:${args['proxy-port']} - \uD83D\uDC42`,
)
execSync(
  `docker run --rm -e AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY -e AWS_SESSION_TOKEN -e CLUSTER=${args.cluster} -e TARGET_SVC=${args.service} -e TARGET_NAMESPACE=${args.namespace} -e TARGET_PORT=${args.port} -p ${args['proxy-port']}:8080 ${args.service}`,
  { stdio: 'inherit' },
)
