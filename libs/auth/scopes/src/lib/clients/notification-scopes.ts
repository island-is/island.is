import { DocumentsScope } from '../documents.scope'

export const notificationScopes: string[] = [DocumentsScope.main]

/**
 * Checks if the user has any of the notification scopes
 * @param scopes - Array of scopes to check against
 * @returns true if user has at least one notification scope
 */
export const hasNotificationScopes = (scopes?: string[]): boolean => {
  if (!scopes) {
    return false
  }
  return notificationScopes.some((scope) => scopes.includes(scope))
}
