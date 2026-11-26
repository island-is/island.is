import { ApolloError } from '@apollo/client'

import { formatDate } from '@island.is/judicial-system/formatters'

const caseIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// The backend accepts up to ten years
export const maxDays = 3650

export const isCaseId = (value: string): boolean =>
  caseIdPattern.test(value.trim())

/**
 * The number of days typed into the form, or undefined unless it is a whole
 * number the backend accepts. Zero is valid: it removes an extension.
 */
export const parseDays = (value: string): number | undefined => {
  if (!/^\d+$/.test(value.trim())) {
    return undefined
  }

  const days = Number(value.trim())

  return days <= maxDays ? days : undefined
}

interface CaseLifetimeResult {
  archiveNotBefore?: string | null
  caseRestored: boolean
}

export const describeResult = (result: CaseLifetimeResult): string => {
  if (!result.archiveNotBefore) {
    return 'Framlenging var fjarlægð. Málið fylgir nú venjulegum líftíma.'
  }

  const date = formatDate(result.archiveNotBefore, 'd.M.y')

  return result.caseRestored
    ? `Málið var sótt úr geymslu og verður ekki sett aftur í geymslu fyrir ${date}.`
    : `Málið verður ekki sett í geymslu fyrir ${date}.`
}

/**
 * Why the backend rejected the request, when it said. An ApolloError does not
 * always carry GraphQL errors - a network failure has none - so every step
 * down to the problem detail is optional.
 */
export const describeError = (error: unknown): string | undefined => {
  const extensions =
    error instanceof ApolloError
      ? error.graphQLErrors?.[0]?.extensions
      : undefined
  const detail = (extensions?.problem as { detail?: unknown } | undefined)
    ?.detail

  return typeof detail === 'string' && detail ? detail : undefined
}
