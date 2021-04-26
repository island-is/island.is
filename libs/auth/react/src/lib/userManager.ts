import { UserManager } from 'oidc-client'
import { AuthSettings, mergeAuthSettings } from './AuthSettings'

let authSettings: AuthSettings | null = null
let userManager: UserManager | null = null

export const getUserManager = (): UserManager => {
  if (userManager === null) {
    throw new Error('Tried to access user manager before calling configure')
  }
  return userManager
}

export const getAuthSettings = (): AuthSettings => {
  if (authSettings === null) {
    throw new Error('Tried to access auth settings before calling configure')
  }
  return authSettings
}

export const configure = (settings?: AuthSettings) => {
  authSettings = mergeAuthSettings(settings)
  userManager = new UserManager(authSettings)
  return userManager
}
