import 'isomorphic-fetch'
import {
  DetentionRequest,
  CreateCaseRequest,
  Case,
  GetCaseByIdResponse,
  Notification,
  SendNotificationResponse,
  User,
  RequestSignatureResponse,
  RequestSignature,
  ConfirmSignatureResponse,
} from '../types'
import { getCookie, deleteCookie } from '../utils/cookies'

const csrfToken = getCookie('judicial-system.csrf')
const { API_URL = '' } = process.env
export const apiUrl = API_URL

export const getCases: () => Promise<DetentionRequest[]> = async () => {
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
  }
}

export const getCaseById: (
  caseId: string,
) => Promise<GetCaseByIdResponse> = async (caseId: string) => {
  try {
    const response = await fetch(`/api/case/${caseId}`, {
      method: 'get',
      headers: { Authorization: `Bearer ${csrfToken}` },
    })

    if (response.ok) {
      const theCase: Case = await response.json()
      return {
        httpStatusCode: response.status,
        case: theCase,
      }
    } else {
      return {
        httpStatusCode: response.status,
      }
    }
  } catch (e) {
    console.log(e)
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
      const responseJSON: DetentionRequest = await response.json()
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

export const transitionCase: (
  caseId: string,
  transition: string,
) => Promise<number> = async (caseId: string, transition: string) => {
  const response = await fetch(`/api/case/${caseId}/state`, {
    method: 'put',
    headers: {
      Authorization: `Bearer ${csrfToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transition),
  })

  if (!response.ok) {
    // TODO: log error
    if (response.status === 401) {
      window.location.assign('/?error=true')
    }
  }

  return response.status
}

export const getUser = async (): Promise<User> => {
  const response = await fetch('/api/user', {
    headers: {
      Authorization: `Bearer ${csrfToken}`,
    },
  })

  if (response.ok) {
    return response.json()
  } else if (window.location.pathname !== '/') {
    window.location.assign('/')
  }
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

export const sendNotification: (
  caseId: string,
) => Promise<SendNotificationResponse> = async (caseId: string) => {
  const response = await fetch(`/api/case/${caseId}/notification`, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${csrfToken}`,
    },
  })

  if (response.ok) {
    const a: Notification = await response.json()
    return {
      httpStatusCode: response.status,
      response: a,
    }
  } else {
    return {
      httpStatusCode: response.status,
    }
  }
}

export const requestSignature: (
  id: string,
) => Promise<RequestSignatureResponse> = async (id: string) => {
  try {
    const response = await fetch(`/api/case/${id}/signature`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${csrfToken}`,
      },
    })

    if (response.ok) {
      const rs: RequestSignature = await response.json()

      return {
        httpStatusCode: response.status,
        response: rs,
      }
    } else {
      return {
        httpStatusCode: response.status,
      }
    }
  } catch (e) {
    console.log(e)
  }
}

export const confirmSignature: (
  id: string,
  documentToken: string,
) => Promise<ConfirmSignatureResponse> = async (
  id: string,
  documentToken: string,
) => {
  try {
    const response = await fetch(
      `/api/case/${id}/signature?documentToken=${documentToken}`,
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${csrfToken}`,
        },
      },
    )

    if (response.ok) {
      const rs: Case = await response.json()

      return {
        httpStatusCode: response.status,
        response: rs,
      }
    } else {
      const rs = await response.json()
      return {
        httpStatusCode: response.status,
        code: rs?.code,
        message: rs?.message,
      }
    }
  } catch (e) {
    console.log(e)
  }
}
