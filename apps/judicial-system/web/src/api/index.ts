import 'isomorphic-fetch'
import { Case, CreateCaseRequest } from '../types'
import { getCookie, deleteCookie } from '../utils/cookies'

// const getCaseById: (caseId: string) => Promise<GetCaseByIdResponse> = async (
//   caseId: string,
// ) => {
//   const response = await fetch(`/api/case/${caseId}`)

//   if (response.ok) {
//     const theCase: Case = await response.json()
//     return {
//       httpStatusCode: response.status,
//       case: theCase,
//     }
//   } else {
//     return {
//       httpStatusCode: response.status,
//     }
//   }
// }
const csrfToken = getCookie('judicial-system.csrf')

const { API_URL = '' } = process.env

export const apiUrl = API_URL

export const getCases: () => Promise<Case[]> = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/cases`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${csrfToken}`,
      },
    })

    if (response.ok) {
      const cases = await response.json()
      return cases
    } else if (response.status === 401) {
      window.location.assign('/?error=true')
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
    const response = await fetch('/api/case', {
      method: 'post',
      headers: {
        Authorization: `Bearer ${csrfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(caseToCreate),
    })

    if (response.ok) {
      const responseJSON: Case = await response.json()
      return responseJSON.id
    } else if (response.status === 401) {
      window.location.assign('/?error=true')
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
  propertyChange: string,
) => Promise<number> = async (caseId: string, propertyChange: string) => {
  if (caseId !== '') {
    const response = await fetch(`/api/case/${caseId}`, {
      method: 'put',
      headers: {
        Authorization: `Bearer ${csrfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyChange),
    })

    if (!response.ok) {
      // TODO: log error
      if (response.status === 401) {
        window.location.assign('/?error=true')
      }
    }
    return response.status
  }
}

export const getUser = async () => {
  const response = await fetch('/api/user', {
    headers: {
      Authorization: `Bearer ${csrfToken}`,
    },
  })

  return response.json()
}

export const logOut = async () => {
  const response = await fetch('/api/auth/logout', {
    headers: {
      Authorization: `Bearer ${csrfToken}`,
    },
  })

  if (response.ok) {
    deleteCookie('judicial-system.csrf')
    window.location.assign('/')
  } else {
    // TODO: Handle error
  }
}
