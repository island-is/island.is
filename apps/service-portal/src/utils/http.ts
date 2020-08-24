import { User } from 'oidc-client'

interface Subject {
  id: number
  name: string
  nationalId: string
  scope: string[]
  subjectType: 'person' | 'company' | 'institution'
}

interface Actor {
  id: number
  name: string
  nationalId: string
  subjectIds: number[]
}

interface UserWithMeta {
  user: User
  mockActors: Actor[]
  mockSubjects: Subject[]
}

export const fetchWithAuth = (url: string, userInfo: UserWithMeta) =>
  fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${userInfo.user.access_token}`,
    },
  })
