export enum IssueType {
  MISSING = 'missing',
  JSON_ERROR = 'could not be parsed as JSON',
}

export class Issues {
  issues: Record<string, IssueType> = {}
  hasParseIssue = false
  hasMissingIssue = false

  get count() {
    return Object.entries(this.issues).length
  }

  add(key: string, type: IssueType) {
    this.issues[key] = type
    this.hasParseIssue = this.hasParseIssue || type === IssueType.JSON_ERROR
    this.hasMissingIssue = this.hasMissingIssue || type === IssueType.MISSING
  }

  formatIssues() {
    return Object.entries(this.issues)
      .map((issue) => `- ${issue[0]} ${issue[1]}`)
      .join('\n')
  }
}
