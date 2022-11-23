import { User } from '@island.is/shared/types'

/**
 * Is the currently logged in user acting in a delegation
 * @param user IDS User
 * @returns boolean
 */
export const checkDelegation = (user: User) => {
  return Boolean(user?.profile.actor)
}

/**
 * Is the currently logged in user acting as a company
 * @param user IDS User
 * @returns boolean
 */
export const isCompanyDelegation = (user: User) => {
  return user?.profile?.subjectType === 'legalEntity'
}

/**
 * Is the currently logged in user acting in a delegation of another user, not a company.
 * @param user IDS User
 * @returns boolean
 */
export const isPersonDelegation = (user: User) => {
  const isCompany = isCompanyDelegation(user)
  const isDelegation = checkDelegation(user)
  const personDelegation = isDelegation && !isCompany
  return personDelegation
}
