import { DefaultLogFields, ListLogLine, SimpleGit } from 'simple-git'

export interface PRWorkflow {
  head_commit: string
  base_commit: string
}

export interface BranchWorkflow {
  head_commit: string
}

export interface GitActionStatus {
  getPRRuns(prID: number): Promise<PRWorkflow[]>

  getBranchBuilds(branch: string, commits: string[]): Promise<BranchWorkflow[]>
  calculateDistance(
    git: SimpleGit,
    currentSha: string,
    p: DefaultLogFields & ListLogLine,
  ): Promise<string[]>
}
