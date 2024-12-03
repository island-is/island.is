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


// var tag = await octokit.rest.git.getTag({ owner: "robertaandersen", repo: "ActionsTest", tag_sha: "88b74b40306b3702797d234db5a8786f1f591fe1" });
// var tag = await octokit.rest.git.getTag({ owner: "robertaandersen", repo: "ActionsTest", tag_sha: "16e64a933edd623ae89a9581878c2e55c6074dea" });
// console.log(tag)
// console.log(pullRequest.merge_commit_sha)
// const { data: tag } = octokit.rest.git.createTag({
//     owner: "robertaandersen",
//     repo: "ActionsTest",
//     tag: "v1.0.0",
//     message: "Testing test",
//     object: pullRequest.merge_commit_sha,
//     type: "commit",
//     tagger: {
//         name: "Roberta Andersen",
//         email: "robertaandersen1978@gmail.com"
//     }
// }).then(({ data }) => {
//     console.log(data)
// }).catch((error) => {
//     console.error(error)
// })

// https://github.com/octokit/core.js#readme


// await octokit.git.createRef({
//     owner: 'robertaandersen',
//     repo: 'ActionsTest',
//     ref: 'refs/tags/test',
//     sha: tag.data.sha,
//     headers: {
//         'X-GitHub-Api-Version': '2022-11-28'
//     }
// })


// octokit.rest.repos.createRelease({
//   owner: "robertaandersen",
//   repo: "ActionsTest",
//   tag_name: tag.data.tag,
//   name: "Test 123",
// }).then(({ data }) => {
//   console.log(data)
// }).catch((error) => {
//   console.log(error)
// });

// Octokit.js
// https://github.com/octokit/core.js#readme

//   await octokit.request('POST /repos/{owner}/{repo}/releases', {
//     owner: 'OWNER',
//     repo: 'REPO',
//     tag_name: 'v1.0.0',
//     target_commitish: 'master',
//     name: 'v1.0.0',
//     body: 'Description of the release',
//     draft: false,
//     prerelease: false,
//     generate_release_notes: false,
//     headers: {
//       'X-GitHub-Api-Version': '2022-11-28'
//     }
//   })

// const { data: pullRequest } = await octokit.pulls.get({
//     owner: "robertaandersen",
//     repo: "ActionsTest",
//     pull_number: 1,
// });



// var resp = await octokit.request('GET /repos/robertaandersen/ActionsTest/releases', {
//     owner: 'robertaandersen',
//     repo: 'ActionsTest',
//     headers: {
//         'X-GitHub-Api-Version': '2022-11-28'
//     }
// })

// console.log(resp.data)
