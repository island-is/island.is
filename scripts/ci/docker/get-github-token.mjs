// @ts-check

// @ts-ignore
import core from '@actions/core'
import { getGithubToken } from './get-github-token-helper.mjs'

const APP_ID = process.env.APP_ID
const PRIVATE_KEY = process.env.PRIVATE_KEY

if (!APP_ID || !PRIVATE_KEY) {
  throw new Error('Missing required environment variables')
}

// @ts-ignore - current tsconfig does not support ESM modules etc. This is just for typing.
const token = await getGithubToken(APP_ID, PRIVATE_KEY)

core.setSecret(token)
core.setOutput('token', token)
