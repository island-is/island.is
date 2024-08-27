module.exports = async ({ github, context, comment }) => {
  const owner = context.repo.owner
  const repo = context.repo.repo
  const issueNr = context.issue.number
  const runsIterator = github.paginate.iterator(
    github.rest.issues.listComments,
    {
      owner: owner,
      repo: repo,
      issue_number: issueNr,
    },
  )
  let commentId
  console.log(`Looking for a comment to update on this PR`)
  for await (const comments of runsIterator) {
    for (const comment of comments.data) {
      if (comment.body?.startsWith('Affected services are: ')) {
        commentId = comment.id
      }
    }
  }
  if (commentId) {
    console.log(`Updating comment for PR`)
    await github.rest.issues.updateComment({
      issue_number: issueNr,
      owner: owner,
      repo: repo,
      comment_id: commentId,
      body: `${comment}`,
    })
  } else {
    console.log(`Creating new comment for PR`)
    await github.rest.issues.createComment({
      issue_number: issueNr,
      owner: owner,
      repo: repo,
      body: `${comment}`,
    })
  }
}
