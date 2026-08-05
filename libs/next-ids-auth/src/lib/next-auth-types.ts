/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    accessToken: string
    idToken: string
    scope: string[]
  }

  interface User {
    nationalId?: string
    accessToken?: string
    refreshToken?: string
    idToken?: string
    role?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    nationalId?: string
    accessToken?: string
    refreshToken?: string
    idToken?: string
    isRefreshTokenExpired?: boolean
    folder?: string
    role?: string
  }
}
