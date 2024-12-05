import { Octokit } from '@octokit/rest'

const { GITHUB_TOKEN, GITHUB_REPOSITORY, GITHUB_REF } = process.env
const octokit = new Octokit({ auth: GITHUB_TOKEN })
const [owner, repo] = GITHUB_REPOSITORY?.split('/') || []

const arg = process.argv.slice(2)

const { data: pullRequest } = await octokit.rest.pulls.get({
  owner: owner,
  repo: repo,
  pull_number: arg[0],
})

var relevantInfo = {
  hadSha: pullRequest.head.sha,
  user: pullRequest.user.login,
}

const { data: tag } = octokit.rest.git.createTag({
  owner: owner,
  repo: repo,
  tag: "TESTTEST",
  message: "Testing test",
  object: pullRequest.head.sha,
  type: "commit",
  tagger: {
    name: pullRequest.user.login
  }
}).then(({ tag }) => {
  console.log(tag)
}).catch((error) => {
  console.error(error)
})

// octokit.rest.repos.createRelease({
//   owner: owner,
//   repo: repo,
//   tag_name: tag.data.tag,
//   name: "Test 123",
// }).then(({ data }) => {
//   console.log(data)
// }).catch((error) => {
//   console.log(error)
// });
