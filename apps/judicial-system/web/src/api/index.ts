import 'isomorphic-fetch'
import { Case } from '../types'

export const getCases: () => Promise<Case[]> = async () => {
  const response = await fetch('/api/cases')

  if (response.ok) {
    const cases = await response.json()
    return cases
  } else {
    // TODO: Error handling
  }
}
