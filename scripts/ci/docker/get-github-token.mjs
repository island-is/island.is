// @ts-check

import githubAppJwt from 'universal-github-app-jwt'
import core from '@actions/core'

const APP_ID = process.env.APP_ID
const PRIVATE_KEY = process.env.PRIVATE_KEY

if (!APP_ID || !PRIVATE_KEY) {
  throw new Error('Missing required environment variables')
}

const authData = await githubAppJwt({
  id: APP_ID,
  privateKey: PRIVATE_KEY,
})

const response = await fetch('https://api.github.com/app/installations', {
  method: 'GET',
  headers: {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${authData.token}`,
  },
})
const installations = await response.json()
const INSTALL_ID = installations[0].id

const actionRest = await fetch(
  `https://api.github.com/app/installations/${INSTALL_ID}/access_tokens`,
  {
    method: 'post',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${authData.token}`,
    },
  },
)

const actionJson = await actionRest.json()

core.setSecret(actionJson.token)
core.setOutput('token', actionJson.token)
