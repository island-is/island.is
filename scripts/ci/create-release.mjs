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

// This is a temporary commit that is created behind the scenes for
// the test merge that validated no conflicts exist with the base branch.
// It is not committed to the repository.
// After the PR is merged, this value instead represents the SHA of the merge commit
const SHA = pullRequest.merge_commit_sha

octokit.rest.repos.createRelease({
  owner: owner,
  repo: repo,
  target_commitish: SHA,
  tag_name: "UNICORN_TEST",
  name: "Test 123",
  generate_release_notes: true,
}).then(({ data }) => {
  console.log(data)
}).catch((error) => {
  console.log(error)
});
