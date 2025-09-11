// @ts-check

export default async function main({ github, context, core }) {
  const prNumber = parseInt(process.env.PR_NUMBER ?? '0')

  if (prNumber <= 0) {
    core.setFailed('PR_NUMBER is not set or invalid')
    return 1
  }

  const label = process.env.LABEL

  if (Number.isNaN(prNumber)) {
    process.exit(0)
  }

  console.log(`Checking PR #${prNumber} for label: ${label}`)

  try {
    const { data: pullRequest } = await github.rest.pulls.get({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: prNumber,
    })

    const labels = pullRequest.labels.map((label) => label.name)
    console.log(`PR labels: ${labels.join(', ')}`)

    const hasLabel = labels.includes(label)
    console.log(`Is label "${label}" present: ${hasLabel}`)

    core.setOutput('has_label', hasLabel.toString())

    if (!hasLabel) {
      core.warning(`Label "${label}" was not found - cancelling workflow`)
      // This special command tells GitHub Actions to cancel the workflow
      console.log('::stop-commands::cancel-workflow')
      process.exit(1) // Exit with error to stop this job
    }
  } catch (error) {
    core.setFailed(`Error checking PR labels: ${error.message}`)
    return 1
  }

  process.exit(0)
}
