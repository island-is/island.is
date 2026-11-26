import { ApolloError } from '@apollo/client'
import { findProblemInApolloError } from '@island.is/shared/problem'
import {
  EducationOwnContactDocument,
  useEducationOwnContactQuery,
  useEducationProfileContactQuery,
  useEducationUpdateOwnContactMutation,
} from './EducationOverview.generated'
import { toMmsError } from '../PrimarySchool/PrimarySchoolOverview/keyInfo/mmsError'

export type OwnContactField = 'email' | 'phone'

export interface OwnContactInput {
  email: string
  phone: string
}

export const toE164 = (phone: string): string | null => {
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

export const suggestOwnContact = (
  stored: OwnContactInput,
  profile: { email?: string | null; mobilePhoneNumber?: string | null } | null,
): { values: OwnContactInput; suggested: OwnContactField[] } => {
  const fromProfile: OwnContactInput = {
    email: profile?.email?.trim() ?? '',
    phone: toE164(profile?.mobilePhoneNumber ?? '') ?? '',
  }
  const suggested = (['phone', 'email'] as const).filter(
    (field) => stored[field].trim() === '' && fromProfile[field] !== '',
  )
  return {
    values: {
      phone: suggested.includes('phone') ? fromProfile.phone : stored.phone,
      email: suggested.includes('email') ? fromProfile.email : stored.email,
    },
    suggested,
  }
}

export const ownContactFieldErrors =(error: unknown): OwnContactField[] => {
  if (!(error instanceof ApolloError)) return []
  const problem = findProblemInApolloError(error) as
    | { mmsFields?: unknown }
    | undefined
  const fields = Array.isArray(problem?.mmsFields) ? problem.mmsFields : []
  return fields.filter(
    (field): field is OwnContactField => field === 'email' || field === 'phone',
  )
}

export const useProfileContact = () => {
  const { data, loading } = useEducationProfileContactQuery({
    errorPolicy: 'all',
  })
  return { profile: data?.getUserProfile ?? null, loading }
}

export const useOwnContact = () => {
  const { data, loading, error } = useEducationOwnContactQuery({
    fetchPolicy: 'cache-and-network',
  })

  const [
    updateMutation,
    { loading: saving },
  ] = useEducationUpdateOwnContactMutation({
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
