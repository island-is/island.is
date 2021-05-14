import AWS from 'aws-sdk'
import yargs from 'yargs'
import yaml from 'js-yaml'
import { createAppAuth } from '@octokit/auth-app'
import { request } from '@octokit/request'
import { ServiceHelm } from './dsl/types/output-types'
const { hideBin } = require('yargs/helpers')

if (
  !process.env.BUCKET ||
  !process.env.APP_ID ||
  !process.env.PRIVATE_KEY ||
  !process.env.INSTALLATION_ID ||
  !process.env.REPO_OWNER ||
  !process.env.REPO_NAME ||
  !process.env.PR_NUMBER
) {
  throw new Error('Missing environment variables. Please fix.')
}

const Bucket = process.env.BUCKET
const appId = parseInt(process.env.APP_ID, 10)
const privateKey = process.env.PRIVATE_KEY
const installationId = process.env.INSTALLATION_ID
const repoOwner = process.env.REPO_OWNER
const repoName = process.env.REPO_NAME
const prNumber = process.env.PR_NUMBER

interface GetArguments {
  manifestKey: string
}

const config = {
  region: 'eu-west-1',
}

const buildIngressComment = (data: ServiceHelm[]): string =>
  data
    .filter((obj) => obj.ingress)
    .map(({ ingress }) => Object.values(ingress!))
    .flat()
    .map(({ hosts }) => hosts)
    .flat()
    .map(({ host, paths }) => paths.map((path) => `https://${host}${path}`))
    .flat()
    .sort()
    .join('\n')

const buildComment = (data: { [key: string]: ServiceHelm }): string => {
  return `Feature deployment successful! Access your feature here:\n\n${buildIngressComment(
    Object.values(data),
  )}`
}

yargs(hideBin(process.argv))
  .command(
    'ingress-comment',
    'comment ingress on pull request',
    () => {},
    async ({ manifestKey }: GetArguments) => {
      await auth.hook(
        request,
        `POST /repos/${repoOwner}/${repoName}/issues/${prNumber}/comments`,
        { data: { body: buildComment(data) } },
      )
      console.log('Done!')
    },
  )
  .options({
    manifestKey: {
      type: 'string',
      demandOption: true,
      description: `Key of the manifest in the s3 bucket "${Bucket}"`,
    },
  })
  .demandCommand().argv
