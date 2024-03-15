import { Octokit } from '@octokit/rest'

const { GITHUB_TOKEN, GITHUB_REPOSITORY, GITHUB_REF } = process.env

if (!process.argv[2]) {
  console.error('Please provide a team name as an argument.')
  process.exit(1)
}

const teamName = process.argv[2]
const [owner, repo] = GITHUB_REPOSITORY?.split('/') || []
const pullNumber = GITHUB_REF?.split('/')[2]

console.log(`Checking reviews on PR #${pullNumber}`)

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
})

const fetchTeamMembers = async (teamName: string): Promise<Set<string>> => {
  try {
    const members = await octokit.teams.listMembersInOrg({
      org: owner,
      team_slug: teamName,
    })
    return new Set(members.data.map((member) => member.login))
  } catch (error) {
    console.error(error)
    return new Set()
  }
}

const checkApproval = async () => {
  if (!owner || !repo || !pullNumber) {
    console.error('Unable to retrieve the necessary GitHub context.')
    process.exit(1)
  }

  const teamMembers = await fetchTeamMembers(teamName)

  const { data: reviews } = await octokit.pulls.listReviews({
    owner,
    repo,
    pull_number: Number(pullNumber),
  })

  const teamApproval = reviews.some((review) => {
    return teamMembers.has(review.user.login) && review.state === 'APPROVED'
  })

  if (!teamApproval) {
    console.error(`PR hasn't been approved by a member of @${teamName}!`)
    process.exit(1)
  } else {
    console.log(`PR has been approved by a member of @${teamName}.`)
  }
}

checkApproval()
