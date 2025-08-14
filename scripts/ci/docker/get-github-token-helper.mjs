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

    return actionJson.token;
}