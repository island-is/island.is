export interface BaseProblem {
  type: string
  title: string
  status?: number
  detail?: string | string[]
  instance?: string
}
