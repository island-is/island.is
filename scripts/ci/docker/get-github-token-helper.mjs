import core from '@actions/core'
// @ts-check
import githubAppJwt from 'universal-github-app-jwt'

/**
 * @param {string} APP_ID - The GitHub App ID
 * @param {string} PRIVATE_KEY - The GitHub App private key
 * @returns {Promise<string>} - The GitHub token
 */
export async function getGithubToken(APP_ID, PRIVATE_KEY) {
  const authData = await githubAppJwt({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
  })
  core.setSecret(authData.token)
  const response = await fetch('https://api.github.com/app/installations', {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${authData.token}`,
    },
  })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch installations: ${response.status} ${response.statusText}`,
    )
  }

  const installations = await response.json()

  if (!installations || installations.length === 0) {
    throw new Error('No GitHub App installations found')
  }

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

  if (!actionRest.ok) {
    throw new Error(
      `Failed to create installation token: ${actionRest.status} ${actionRest.statusText}`,
    )
  }

  const actionJson = await actionRest.json()

  if (!actionJson.token) {
    throw new Error('No token received from GitHub API')
  }
  core.setSecret(actionJson.token)
  return actionJson.token
}
