import { Octokit } from '@octokit/rest'

const { GITHUB_TOKEN, GITHUB_REPOSITORY, GITHUB_REF } = process.env
const octokit = new Octokit({ auth: GITHUB_TOKEN })
const [owner, repo] = GITHUB_REPOSITORY?.split('/') || []


const { data: pullRequest } = await octokit.rest.pulls.get({
  owner: owner,
  repo: repo,
  pull_number: 1,
});

console.log(pullRequest)

// const { data: tag } = octokit.rest.git.createTag({
//   owner: owner,
//   repo: repo,
//   tag: "v1.0.0",
//   message: "Testing test",
//   object: pullRequest.merge_commit_sha,
//   type: "commit",
//   tagger: {
//     name: "Roberta Andersen",
//     email: "robertaandersen1978@gmail.com"
//   }
// }).then(({ data }) => {
//   console.log(data)
// }).catch((error) => {
//   console.error(error)
// })



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
