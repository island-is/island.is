import {
  ApplicantChildCustodyInformation,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { ResidencePermitRenewal } from '../lib/dataSchema'
import { getValueViaPath } from '@island.is/application/core'
import { NationalRegistryUser } from '@island.is/api/schema'

export const getSelectedApplicant = (
  externalData: ExternalData,
  answers: FormValue,
): NationalRegistryUser | undefined => {
  const applicantInfo = getValueViaPath(
    externalData,
    'nationalRegistry.data',
    undefined,
  ) as NationalRegistryUser | undefined

  const applicantNationalId = applicantInfo?.nationalId

  const selectedIndividuals = (answers as ResidencePermitRenewal)
    .selectedIndividuals

  const isSelected =
    selectedIndividuals &&
    selectedIndividuals.find((x) => x === applicantNationalId)

  return isSelected ? applicantInfo : undefined
}

export const getSelectedCustodyChild = (
  externalData: ExternalData,
  answers: FormValue,
  sectionIndex: number,
): ApplicantChildCustodyInformation | undefined => {
  const custodyChildren = getValueViaPath(
    externalData,
    'childrenCustodyInformation.data',
    undefined,
  ) as ApplicantChildCustodyInformation[] | undefined

  const childInfo = custodyChildren && custodyChildren[sectionIndex - 1] // minus one since first sectionIndex is applicant
  const childNationalId = childInfo?.nationalId

  const selectedIndividuals = (answers as ResidencePermitRenewal)
    .selectedIndividuals

  const isSelected =
    selectedIndividuals &&
    selectedIndividuals.find((x) => x === childNationalId)

  return isSelected ? childInfo : undefined
}
