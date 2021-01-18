export class UserInfo {
  email?: string
  image?: unknown
  name!: string
}

export class SessionInfo {
  user!: UserInfo
  accessToken!: string
  expires!: Date
  refreshToken!: string
  idToken!: string
}
