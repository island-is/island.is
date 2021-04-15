#!/usr/bin/env node
const yargs = require('yargs')
const { execSync } = require('child_process')
const get = require('lodash').get
const { default: dedent } = require('ts-dedent')

const argv = yargs(process.argv.slice(2))

const error = (errorMessage) => {
  console.error(errorMessage)
  process.exit(1)
}

const getFromFileOrEnv = (key) => {
  const value = execSync(`aws configure get ${key.toLowerCase()}`)
    .toString()
    .trim()

  // We get it from `aws configure get`
  if (value) {
    return value
  }

  // We try to find it within `process.env`
  return get(process.env, key)
}

const getCredentials = () => [
  getFromFileOrEnv('AWS_ACCESS_KEY_ID'),
  getFromFileOrEnv('AWS_SECRET_ACCESS_KEY'),
  getFromFileOrEnv('AWS_SESSION_TOKEN'),
]

const checkPresenceAWSAccessVars = () => {
  const awsCredentials = getCredentials()
  const valuesPresent = awsCredentials.filter((v) => !!v)

  if (valuesPresent.length !== awsCredentials.length) {
    error(`
      Missing AWS environment variables.
      You need to log in your AWS portal and get the environments variables. Either you export them or add them to your \`~/.aws/credentials\` file.
      Find more about it on the AWS secrets documentation: https://docs.devland.is/repository/aws-secrets
    `)
  }
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
