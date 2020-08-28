import 'isomorphic-fetch'
import { Case, CaseState } from '../types'

export const getCases: () => Promise<Case[]> = async () => {
  return Promise.resolve([
    {
      id: '007-2020-X',
      suspectName: 'Katrín Erlingsdóttir',
      suspectNationalID: '150689-5989',
      created: new Date(),
      modified: new Date(),
      description: 'string',
      status: CaseState.DRAFT,
    },
    {
      id: '007-2020-X',
      suspectName: 'Brjánn Guðmundsson',
      suspectNationalID: '150277-7749',
      created: new Date(),
      modified: new Date(),
      description: 'string',
      status: CaseState.SUBMITTED,
    },
  ])
}
