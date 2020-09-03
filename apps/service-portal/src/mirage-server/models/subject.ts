export interface Subject {
  id: number
  name: string
  nationalId: string
  scope: string[]
  subjectType: 'person' | 'company'
}

export type SubjectDto = Omit<Subject, 'id'>
export type SubjectListDto = Omit<Subject, 'id' | 'scope'>
