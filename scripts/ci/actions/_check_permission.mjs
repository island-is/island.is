// @ts-check
import { info } from '@actions/core'
import { graphql } from '@octokit/graphql'
import { GITHUB_TOKEN, owner, repo } from './_pr_utils.mjs'

const DEFAULT_VALUES = { owner, repo, token: GITHUB_TOKEN }
/**
 * Checks the permission for a user on a repository.
 * @param {string} username - The username to check permission for.
 * @param {Object} options - The options object.
 * @param {string} options.owner - The owner of the repository.
 * @param {string} options.repo - The name of the repository.
 * @param {string} options.token - The GitHub token to use for the request.
 * @returns {Promise<boolean>} - A promise that resolves when the permission check is complete.
 */
export async function checkIfUserIsAdmin(
  username,
  { owner, repo, token } = DEFAULT_VALUES,
) {
  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${token}`,
    },
  })
  try {
    const query = `
          query($owner: String!, $repo: String!, $username: String!) {
            repository(owner: $owner, name: $repo) {
              collaborators(query: $username, first: 1) {
                edges {
                  node {
                    login
                    name
                  }
                  permission
                }
              }
            }
          }
        `

    const result = await graphqlWithAuth(query, {
      owner,
      repo,
      username,
    })

    const collaborator = result.repository.collaborators.edges[0]

    if (!collaborator) {
      info(`User ${username} is not a collaborator of ${owner}/${repo}`)
      return false
    }

    const permission = collaborator.permission
    info(`User ${username} has ${permission} permission on ${owner}/${repo}`)

    return ['ADMIN'].includes(permission)
  } catch (error) {
    return false
  }
}
