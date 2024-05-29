export interface IndictmentCaseData {
  caseNumber: string
  groups: {
    label: string
    items: {
      label: string
      value?: string
      linkType?: 'email' | 'tel'
    }[]
  }[]
}
