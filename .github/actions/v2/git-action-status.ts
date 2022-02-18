import { SimpleGit } from 'simple-git'

export interface PRWorkflow {
  head_commit: string
  base_commit: string
  run_nr: number
}

export interface BranchWorkflow {
  head_commit: string
  run_nr: number
}

export interface GitActionStatus {
  getLastGoodPRRun(branch: string): Promise<PRWorkflow | undefined>
  getLastGoodBranchBuildRun(
    branch: string,
    candidateCommits: string[],
  ): Promise<BranchWorkflow | undefined>
  calculateDistance(
    git: SimpleGit,
    currentSha: string,
    bashSha: string,
  ): Promise<string[]>
}
