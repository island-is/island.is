import { ApolloError } from '@apollo/client'
import { findProblemInApolloError } from '@island.is/shared/problem'

/** Toasts should not show multi-line stack traces or huge Sequelize messages. */
export const TOAST_ERROR_MAX_LENGTH = 240

export const shortenForToast = (text: string): string => {
  const firstLine = text.trim().split(/\r?\n/)[0] ?? ''
  if (firstLine.length <= TOAST_ERROR_MAX_LENGTH) {
    return firstLine
  }
  return `${firstLine.slice(0, TOAST_ERROR_MAX_LENGTH)}…`
}

export const getTranslationSaveErrorDetail = (err: unknown): string => {
  let raw = ''
  if (err instanceof ApolloError) {
    const problem = findProblemInApolloError(err)
    if (problem?.detail) {
      raw = problem.detail
    } else if (err.graphQLErrors?.length) {
      raw = err.graphQLErrors.map((e) => e.message).join('; ')
    } else if (err.networkError) {
      raw = err.networkError.message
    }
  }
  if (!raw && err instanceof Error) {
    raw = err.message
  }
  if (!raw) {
    raw = String(err)
  }
  return shortenForToast(raw)
}
