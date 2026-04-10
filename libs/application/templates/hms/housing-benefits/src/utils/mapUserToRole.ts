import {
  Application,
  ApplicationRole,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import * as kennitala from 'kennitala'
import { Roles } from './constants'

const hasAssigneeCompletedPrereq = (
  application: Application,
  normalizedNationalId: string,
): boolean => {
  const { externalData, answers } = application

  const hasNationalRegistry =
    !!externalData[`${normalizedNationalId}.assigneeNationalRegistry`]?.data
  const hasUserProfile =
    !!externalData[`${normalizedNationalId}.assigneeUserProfile`]?.data
  const hasTaxReturn =
    !!externalData[`${normalizedNationalId}.assigneeTaxReturn`]?.data

  const hasApprovedExternalData =
    getValueViaPath<boolean>(
      answers,
      `${normalizedNationalId}.approveExternalData`,
    ) === true

  return (
    hasNationalRegistry &&
    hasUserProfile &&
    hasTaxReturn &&
    hasApprovedExternalData
  )
}

export const mapUserToRole = (
  nationalId: string,
  application: Application,
): ApplicationRole | undefined => {
  const normalizedNationalId = kennitala.isValid(nationalId)
    ? kennitala.sanitize(nationalId)
    : nationalId

  if (
    normalizedNationalId ===
      kennitala.sanitize(
        InstitutionNationalIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
      ) ||
    normalizedNationalId === kennitala.sanitize('0101304929') // Gervimaður Bretland, only for testing
  ) {
    return Roles.INSTITUTION
  }

  if (
    nationalId === application.applicant ||
    normalizedNationalId ===
      (kennitala.isValid(application.applicant)
        ? kennitala.sanitize(application.applicant)
        : application.applicant)
  ) {
    return Roles.APPLICANT
  }

  const assignees = application.assignees ?? []
  if (!assignees.includes(normalizedNationalId)) {
    return undefined
  }

  const signed =
    getValueViaPath<string[]>(
      application.answers,
      'householdMemberApprovals',
    ) ?? []
  const hasSigned = signed.some(
    (id) =>
      (kennitala.isValid(id) ? kennitala.sanitize(id) : id) ===
      normalizedNationalId,
  )
  if (hasSigned) {
    return Roles.SIGNED_ASSIGNEE
  }

  if (hasAssigneeCompletedPrereq(application, normalizedNationalId)) {
    return Roles.UNSIGNED_DRAFT_ASSIGNEE
  }

  return Roles.UNSIGNED_PREREQ_ASSIGNEE
}
