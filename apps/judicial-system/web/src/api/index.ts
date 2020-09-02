import 'isomorphic-fetch'
import { Case } from '../types'

interface SaveCaseRequest {
  description: string
  policeCaseNumber: string
  suspectNationalId: string
  suspectName: string
}

export const getCases: () => Promise<Case[]> = async () => {
  try {
    const response = await fetch('/api/cases')

    if (response.ok) {
      const cases = await response.json()
      return cases
    } else {
      throw new Error(response.statusText)
    }
  } catch (ex) {
    // TODO: Log error
    console.log(ex)
  }
}

export const saveCase: (caseToSave: SaveCaseRequest) => void = async (
  caseToSave: SaveCaseRequest,
) => {
  try {
    const response = await fetch('/api/case', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(caseToSave),
    })

    if (!response.ok) {
      throw new Error(response.statusText)
    }
  } catch (ex) {
    // TODO: log error
    console.log(ex)
  }
}
