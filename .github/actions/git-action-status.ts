import { SimpleGit } from './simple-git'

export interface PRWorkflow {
  head_commit: string
  base_commit: string
  run_nr: number
}

export interface BranchWorkflow {
  head_commit: string
  run_nr: number
}

export type WorkflowID = 'pullrequest' | 'push'
export interface GitActionStatus {
  /***
   * Gets the last "pullrequest" workflow that has finished successfully
   * @param branch - branch name related to the workflow
   * @param workflowId
   * @param commits - commits related to both the base and the head branch. Helpful to eliminate PR workflow runs for branches that have had parts of their history rewritten (rebased)
   */
  getLastGoodPRRun(
    branch: string,
    workflowId: WorkflowID,
    commits: string[],
  ): Promise<PRWorkflow | undefined>

  /***
   * Gets the last "push" workflow that has finished successfully
   * @param branch - branch name related to the workflow
   * @param workflowId
   * @param candidateCommits - commits related to both the branch. Helpful to eliminate PR workflow runs for branches that have had parts of their history rewritten (rebased)
   */
  getLastGoodBranchBuildRun(
    branch: string,
    workflowId: WorkflowID,
    candidateCommits: string[],
  ): Promise<BranchWorkflow | undefined>

  /***
   * Derive the list of changed component names for two git SHAs
   * @param git - git interface
   * @param shaA - git sha
   * @param shaB - git sha
   */
  getChangedComponents(
    git: SimpleGit,
    shaA: string,
    shaB: string,
  ): Promise<string[]>
}
