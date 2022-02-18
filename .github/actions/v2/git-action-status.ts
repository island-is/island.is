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
  getPRRuns(branch: string): Promise<PRWorkflow[]>
  getBranchBuilds(branch: string, commits: string[]): Promise<BranchWorkflow[]>
  calculateDistance(
    git: SimpleGit,
    currentSha: string,
    bashSha: string,
  ): Promise<string[]>
}
