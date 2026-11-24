import { ApolloError } from '@apollo/client'
import { findProblemInApolloError } from '@island.is/shared/problem'
import {
  EducationOwnContactDocument,
  useEducationOwnContactQuery,
  useEducationUpdateOwnContactMutation,
} from './EducationOverview.generated'
import { toMmsError } from '../PrimarySchool/PrimarySchoolOverview/keyInfo/mmsError'

export type OwnContactField = 'email' | 'phone'

export interface OwnContactInput {
  email: string
  phone: string
}

export const toE164 =(phone: string): string | null => {
  const digits = phone.replace(/[\s-]/g, '')
  if (!digits) return null
  return digits.startsWith('+') ? digits : `+354${digits}`
}

export const clearedOwnContactFields = (
  stored: OwnContactInput,
  next: OwnContactInput,
): OwnContactField[] =>
  (['phone', 'email'] as const).filter(
    (field) => stored[field].trim() !== '' && next[field].trim() === '',
  )

export const ownContactFieldErrors = (error: unknown): OwnContactField[] => {
  if (!(error instanceof ApolloError)) return []
  const problem = findProblemInApolloError(error) as
    | { mmsFields?: unknown }
    | undefined
  const fields = Array.isArray(problem?.mmsFields) ? problem.mmsFields : []
  return fields.filter(
    (field): field is OwnContactField => field === 'email' || field === 'phone',
  )
}

export const useOwnContact = () => {
  const { data, loading, error } = useEducationOwnContactQuery({
    fetchPolicy: 'cache-and-network',
  })

  const [updateMutation, { loading: saving }] =
    useEducationUpdateOwnContactMutation({
      refetchQueries: [{ query: EducationOwnContactDocument }],
    })

  const contact = data?.educationOwnContact ?? null

  const save = async (input: OwnContactInput) => {
    await updateMutation({
      variables: {
        input: {
          email: input.email.trim() || null,
          phone: toE164(input.phone),
        },
      },
    })
  }

  return {
    contact,
    hasContact: !!(contact?.email || contact?.phone),
    loading: loading && !data,
    error: toMmsError(error),
    saving,
    save,
  }
}
