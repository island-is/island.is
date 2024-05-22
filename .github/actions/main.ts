import { LocalRunner } from './ci-io'
import { LastGoodBuild, findBestGoodRefBranch, findBestGoodRefPR } from './change-detection'
import { Octokit } from '@octokit/action'
import { SimpleGit } from './simple-git'
import { WorkflowID } from './git-action-status'

const SHOULD_TEST_EVERYTHING = !!process.env.TEST_EVERYTHING;
const EVENT_IS_A_PULL_REQUEST = process.env.GITHUB_EVENT_NAME === "pull_request";

const git = new SimpleGit(process.env.REPO_ROOT!, process.env.SHELL!)
const runner = new LocalRunner(new Octokit())

main();

async function main() {

  const rev = await findRev();
  if (rev === 'rebuild') {
    console.log(`Full rebuild needed`)
    return;
  }
  console.log(JSON.stringify(rev))
}
function diffWeight(s: string[]) {
  return s.length
}

async function findRev() {
  if (SHOULD_TEST_EVERYTHING) {
    return 'rebuild'
  }
  let value: LastGoodBuild;
  if (EVENT_IS_A_PULL_REQUEST) {
    value = await findBestGoodRefPR(
      diffWeight,
      git,
      runner,
      `'${process.env.HEAD_REF!}'`,
      `'${process.env.BASE_REF!}'`,
      `'${process.env.PR_REF!}'`,
      process.env.WORKFLOW_ID! as WorkflowID,
    )
  } else {
    value = await findBestGoodRefBranch(
      diffWeight,
      git,
      runner,
      `'${process.env.HEAD_REF!}'`,
      `'${process.env.BASE_REF!}'`,
      process.env.WORKFLOW_ID! as WorkflowID,
    )
  }
  if (value === "rebuild") {
    return value;
  }
  value.branch = value.branch.replace(/'/g, '')
  value.ref = value.ref.replace(/'/g, '')
}