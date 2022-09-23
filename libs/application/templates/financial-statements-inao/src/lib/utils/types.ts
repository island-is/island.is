export type Options = {
  label: string
  value: string
}[]

export type ElectionSelectProps = {
  defaultElections: string
  getDefaultElectionName: () => string
  options: Options
}
