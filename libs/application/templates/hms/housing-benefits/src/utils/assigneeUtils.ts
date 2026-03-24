import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import * as kennitala from 'kennitala'
import { getHouseholdMembersForTable } from './rentalAgreementUtils'

/**
 * Gets household members over 18 (excluding applicant) who need to sign the application.
 * Combines contract tenants with additional members from the table repeater.
 */
export const getHouseholdMembersOver18ExcludingApplicant = (
  application: Application,
): Array<{ nationalId: string; name: string }> => {
  const applicantNationalId = application.applicant
  const members = getHouseholdMembersForTable(application)
  const answerRows = getValueViaPath<
    Array<{ nationalIdWithName?: { nationalId?: string; name?: string } }>
  >(application.answers, 'householdMembersTableRepeater')

  const allMembers: Array<{ nationalId: string; name: string }> = []

  members.forEach((m) => {
    if (m.nationalId)
      allMembers.push({ nationalId: m.nationalId, name: m.name ?? '' })
  })
  answerRows?.forEach((row) => {
    const natId = row.nationalIdWithName?.nationalId
    const name = row.nationalIdWithName?.name ?? ''
    if (natId && !allMembers.some((am) => am.nationalId === natId)) {
      allMembers.push({ nationalId: natId, name })
    }
  })

  return allMembers.filter((m) => {
    if (!m.nationalId || m.nationalId === applicantNationalId) return false
    try {
      return (
        kennitala.isValid(m.nationalId) &&
        kennitala.info(m.nationalId).age >= 18
      )
    } catch {
      return false
    }
  })
}

/**
 * Whether the application needs household member approval (others over 18 must sign).
 */
export const needsHouseholdMemberApproval = (
  application: Application,
): boolean =>
  getHouseholdMembersOver18ExcludingApplicant(application).length > 0

/**
 * Whether the applicant is the only household member over 18.
 */
export const isApplicantOnlyHouseholdMemberOver18 = (
  application: Application,
): boolean => !needsHouseholdMemberApproval(application)

/**
 * Check if this is the last assignee to sign (all have approved).
 */
export const isLastAssigneeToSign = (
  signedNationalIds: string[],
  assignees: string[],
): boolean => signedNationalIds.length >= assignees.length

/**
 * Gets national IDs of household members over 18 (excluding applicant) for assignees.
 */
export const getAssigneeNationalIds = (application: Application): string[] =>
  getHouseholdMembersOver18ExcludingApplicant(application).map(
    (m) => m.nationalId,
  )

/**
 * Gets names of people who have approved (applicant + signed assignees).
 */
export const getSignedApprovalNames = (application: Application): string[] => {
  const applicantName =
    getValueViaPath<string>(application.answers, 'applicant.name') ??
    getValueViaPath<string>(
      application.externalData,
      'nationalRegistry.data.fullName',
    ) ??
    ''
  const assigneeMembers =
    getHouseholdMembersOver18ExcludingApplicant(application)
  const signed = (getValueViaPath<string[]>(
    application.answers,
    'householdMemberApprovals',
  ) ?? []) as string[]
  const signedNames = signed
    .map((natId) => {
      const member = assigneeMembers.find((m) => m.nationalId === natId)
      return member?.name ?? natId
    })
    .filter(Boolean)
  return applicantName ? [applicantName, ...signedNames] : signedNames
}

/**
 * Gets names of assignees who have yet to approve.
 */
export const getUnsignedApprovalNames = (
  application: Application,
): string[] => {
  const assigneeMembers =
    getHouseholdMembersOver18ExcludingApplicant(application)
  const signed = (getValueViaPath<string[]>(
    application.answers,
    'householdMemberApprovals',
  ) ?? []) as string[]
  return assigneeMembers
    .filter((m) => !signed.includes(m.nationalId))
    .map((m) => m.name || m.nationalId)
}
