import type { Application, ApplicationRole } from '@island.is/application/types'
import { InstitutionNationalIds } from '@island.is/application/types'
import { isCompany } from 'kennitala'
import { Roles } from './constants'

export const mapUserToRole = (
  nationalId: string,
  application: Application,
): ApplicationRole | undefined => {
  if (
    isCompany(application.applicant) &&
    nationalId === application.applicant
  ) {
    return Roles.APPLICANT
  }

  if (
    application.assignees.includes(nationalId) &&
    nationalId === InstitutionNationalIds.DOMSMALA_RADUNEYTID
  ) {
    return Roles.ASSIGNEE
  }

  return Roles.NOT_ALLOWED
}
