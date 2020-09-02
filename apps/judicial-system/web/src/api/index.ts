import 'isomorphic-fetch'
import { Case } from '../types'

interface GetCasesResponse {
  ok: boolean
  code: number
  cases?: Case[]
  message?: string
}

interface SaveCaseResponse {
  ok: boolean
  code: number
  case: Case
  message?: string
}

interface SaveCaseRequest {
  description: string
  policeCaseNumber: string
  suspectNationalId: string
  suspectName: string
}

export const getCases: () => Promise<GetCasesResponse> = async () => {
  const response = await fetch('/api/cases')

  if (response.ok) {
    const cases = await response.json()
    return {
      ok: true,
      code: response.status,
      cases,
    }
  } else {
    // TODO: Log error

    return {
      ok: false,
      code: response.status,
      message: response.statusText,
    }
  }
}

export const saveCase: (
  caseToSave: SaveCaseRequest,
) => Promise<SaveCaseResponse> = async (caseToSave: SaveCaseRequest) => {
  const response = await fetch('/api/case', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(caseToSave),
  })

  if (response.ok) {
    const savedCase = await response.json()

    return {
      ok: true,
      code: response.status,
      case: savedCase,
    }
  }
}
