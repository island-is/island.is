import 'isomorphic-fetch'
import { Case } from '../types'

interface GetCasesResponse {
  ok: boolean
  code: number
  cases?: Case[]
  message?: string
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
