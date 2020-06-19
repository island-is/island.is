import { ActionsListWorkflowRunsForRepoResponseData } from "@octokit/types";

const getSuccessWorkflowsForBranch = (
  response: ActionsListWorkflowRunsForRepoResponseData
) => {
  return response.workflow_runs
    .map((wr) => ({ run_number: wr.run_number, sha: wr.head_sha }))
    .sort((a, b) => b.run_number - a.run_number);
};

const pickFirstMatchingSuccess = (
  shas: string[],
  runsBranch: { run_number: number; sha: string }[]
) => {
  for (const sha of shas) {
    const lastGoodRun = runsBranch.filter((runs) => runs.sha === sha);
    if (lastGoodRun.length > 0) {
      return lastGoodRun[0];
    }
  }
};

export interface WorkflowQueries {
  getData(branch: string): Promise<ActionsListWorkflowRunsForRepoResponseData>;
}

export const findLastGoodBuild = async (
  shas: string[],
  branch,
  base,
  workflowQueries: WorkflowQueries
) => {
  // First we try to find the last successful workflow build on our branch
  const successWorkflows = await workflowQueries.getData(branch);
  let successOnBranch = getSuccessWorkflowsForBranch(successWorkflows);

  const matchOnBranch = pickFirstMatchingSuccess(shas, successOnBranch);
  if (matchOnBranch) {
    return matchOnBranch;
  }

  // Fallback we try to find the last successful workflow build on the base branch
  const successWorkflowsBase = await workflowQueries.getData(base);
  let successOnBase = getSuccessWorkflowsForBranch(successWorkflowsBase);

  const matchOnBase = pickFirstMatchingSuccess(shas, successOnBase);
  if (matchOnBase) {
    return matchOnBase;
  }

  // Unlikely but still
  return {};
};
