// import { SimpleGit } from 'simple-git'
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
  getLastGoodPRRun(
    branch: string,
    workflowId: WorkflowID,
    commits: string[],
  ): Promise<PRWorkflow | undefined>

  getLastGoodBranchBuildRun(
    branch: string,
    workflowId: WorkflowID,
    candidateCommits: string[],
  ): Promise<BranchWorkflow | undefined>
  calculateDistance(
    git: SimpleGit,
    currentSha: string,
    bashSha: string,
  ): Promise<string[]>
}
