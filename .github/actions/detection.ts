import {
  ActionsListWorkflowRunsForRepoResponseData,
  ActionsListJobsForWorkflowRunResponseData,
} from '@octokit/types'

interface SuccessWorkflowsForBranch {
  run_number: number
  sha: string
  branch: string
  jobs_url: string
  workflowJobs?: ActionsListJobsForWorkflowRunResponseData
}

const getSuccessWorkflowsForBranch = async (
  response: ActionsListWorkflowRunsForRepoResponseData,
  isCurrentBranch: boolean,
  workflowQueries: WorkflowQueries,
): Promise<SuccessWorkflowsForBranch[]> => {
  const runs = response.workflow_runs
    .map(({ run_number, head_sha, head_branch, jobs_url }) => ({
      run_number,
      sha: head_sha,
      branch: head_branch,
      jobs_url,
    }))
    .sort((a, b) => b.run_number - a.run_number)
  if (isCurrentBranch) {
    return (
      await Promise.all(runs.map(enrichWithJobs(workflowQueries)))
    ).filter(filterSkippedSuccessBuilds)
  }
  return runs
}

const enrichWithJobs = (workflowQueries: WorkflowQueries) => async (
  run,
): Promise<SuccessWorkflowsForBranch> => {
  const { jobs_url } = run
  return {
    ...run,
    workflowJobs: await workflowQueries.getJobs(`GET ${jobs_url}`),
  }
}

const filterSkippedSuccessBuilds = (
  run: SuccessWorkflowsForBranch,
): boolean => {
  const {
    workflowJobs: { jobs },
  } = run
  const successJob = jobs.find((job) => job.name === 'push-success')
  if (successJob) {
    const { steps } = successJob
    const announceSuccessStep =
      steps && steps.find((step) => step.name === 'Announce success')
    return announceSuccessStep && announceSuccessStep.conclusion === 'success'
  }
  return false
}

const pickFirstMatchingSuccess = (
  shas: string[],
  runsBranch: SuccessWorkflowsForBranch[],
) => {
  for (const sha of shas) {
    const lastGoodRun = runsBranch.filter((runs) => runs.sha === sha)
    if (lastGoodRun.length > 0) {
      return lastGoodRun[0]
    }
  }
}

export interface WorkflowQueries {
  getData(branch: string): Promise<ActionsListWorkflowRunsForRepoResponseData>
  getJobs(jobs_url: string): Promise<ActionsListJobsForWorkflowRunResponseData>
}

export const findLastGoodBuild = async (
  shas: string[],
  branch,
  base,
  workflowQueries: WorkflowQueries,
) => {
  const getGoodBuildOnBranch = async (branch, isCurrentBranch) => {
    const successWorkflows = await workflowQueries.getData(branch)
    let successOnBranch = await getSuccessWorkflowsForBranch(
      successWorkflows,
      isCurrentBranch,
      workflowQueries,
    )

    return pickFirstMatchingSuccess(shas, successOnBranch)
  }
  // First we try to find the last successful workflow build on our branch
  // Then try to find the last successful workflow build on our target branch
  // Failing that, and in case base != main, we try main
  const branchTargets = [branch, base]
  if (base != 'main') {
    branchTargets.push('main')
  }
  // Lastly, consider no branch, as the best candidate might be on a branch that
  // is between branch and base.
  // If this keeps being a problem, lets consider dropping the branch filter and
  // simply consider all builds and walk down the list of shas.
  branchTargets.push('')
  for (const branchTarget of branchTargets) {
    const goodBuild = await getGoodBuildOnBranch(
      branchTarget,
      branchTargets.indexOf(branchTarget) === 0,
    )
    if (goodBuild) {
      const { jobs_url: omit, workflowJobs: omit2, ...rest } = goodBuild
      return rest
    }
  }
  return {}
}
