import 'isomorphic-fetch'
import { Case } from '../types'

interface CreateCaseRequest {
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

export const createCase: (
  caseToCreate: CreateCaseRequest,
) => Promise<string> = async (caseToCreate: CreateCaseRequest) => {
  try {
    console.log(caseToCreate)
    const response = await fetch('/api/case', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(caseToCreate),
    })

    if (response.ok) {
      const responseJSON: Case = await response.json()
      return responseJSON.id
    } else {
      throw new Error(response.statusText)
    }
  } catch (ex) {
    // TODO: log error
    console.log(ex)
  }
}

export const saveCase: (
  caseId: string,
  caseField: string,
  caseFieldValue: string,
) => Promise<void> = async (
  caseId: string,
  caseField: string,
  caseFieldValue: string,
) => {
  try {
    const propertyChange = JSON.parse(`{"${caseField}": "${caseFieldValue}"}`)
    const response = await fetch(`/api/case/${caseId}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyChange),
    })

    if (!response.ok) {
      throw new Error(response.statusText)
    }
  } catch (ex) {
    // TODO: log error
    console.log(ex)
  }
}
