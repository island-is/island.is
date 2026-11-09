import { ApolloError } from '@apollo/client'
import type { GraphQLError } from 'graphql'
import type { MessageDescriptor } from 'react-intl'
import { findProblemInApolloError } from '@island.is/shared/problem'
import { primarySchoolKeyInfoMessages as kim } from '../../../../lib/messages'
import { MmsErrorCode } from './types'
import type { MmsError } from './types'

/**
 * MMS reports a rejected key-info call with a machine-readable code (contract
 * v0.2 §5), which the api lifts onto the problem it serialises into
 * `extensions.problem` (see mmsKeyInfoProblem in libs/api/domains/education).
 * Anything MMS did not explain — a timeout, a 500, a scope it refused — arrives
 * without a code and falls back to the generic "could not save".
 */

/** The problem fields the api adds on top of the shared Problem shape. */
interface MmsProblem {
  mmsCode?: string
  mmsRequestId?: string
}

const isApolloError = (error: unknown): error is ApolloError =>
  typeof error === 'object' && error !== null && 'graphQLErrors' in error

/** ApolloError → MmsError, keeping the MMS code and request id when MMS sent
 * them so a section can explain the failure and a support request can quote it. */
export const toMmsError = (
  error: ApolloError | undefined,
): MmsError | undefined => {
  if (!error) return undefined
  const problem = findProblemInApolloError(error) as
    | (MmsProblem & { detail?: string })
    | undefined

  return {
    code: problem?.mmsCode,
    message: problem?.detail ?? error.message,
    requestId: problem?.mmsRequestId,
  }
}

/**
 * The error on one field of a multi-section read, or undefined when that field
 * resolved. The sections are read in one query (see PrimarySchoolKeyInfo.graphql),
 * so a failure is told apart from the others by the `path` GraphQL reports it
 * under — `['primarySchoolStudent', 'healthProfile']` for the health profile.
 */
export const toMmsFieldError = (
  error: ApolloError | undefined,
  field: string,
): MmsError | undefined => {
  const graphQLError = error?.graphQLErrors?.find((candidate) =>
    candidate.path?.includes(field),
  )
  if (!graphQLError) return undefined

  // findProblemInApolloError only reads whole ApolloErrors, so the one error
  // this field failed with is wrapped back up on its own.
  return toMmsError(
    new ApolloError({ graphQLErrors: [graphQLError as GraphQLError] }),
  )
}

/** The messages we can explain a failure with, by MMS code. */
const MESSAGE_BY_CODE: Partial<Record<MmsErrorCode, MessageDescriptor>> = {
  [MmsErrorCode.AgentExists]: kim.errorAgentExists,
  [MmsErrorCode.IsGuardian]: kim.errorIsGuardian,
  [MmsErrorCode.PersonNotFound]: kim.contactPersonNotFound,
}

/**
 * What to tell the guardian about a failed save: the message for the MMS code
 * when there is one, otherwise the generic save error.
 */
export const mmsErrorMessage = (error: unknown): MessageDescriptor => {
  const code = isApolloError(error) ? toMmsError(error)?.code : undefined
  if (!code) return kim.saveError
  return MESSAGE_BY_CODE[code as MmsErrorCode] ?? kim.saveError
}
