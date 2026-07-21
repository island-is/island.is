import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  DetailedDropDownDto,
  DropDownDto,
  ProtectiveFactorSectionDto,
} from '@island.is/clients/national-agency-for-children-and-families'
import { Option } from '@island.is/clients/mms/frigg'
import { Category } from './types'

export const getApplicationExternalData = (
  externalData: Application['externalData'],
) => {
  const applicantName = getValueViaPath<string>(
    externalData,
    'identity.data.name',
  )

  const applicantNationalId = getValueViaPath<string>(
    externalData,
    'identity.data.nationalId',
  )

  const applicantAddress = getValueViaPath<string>(
    externalData,
    'identity.data.address.streetAddress',
  )

  const applicantPostalCode = getValueViaPath<string>(
    externalData,
    'identity.data.address.postalCode',
  )

  const applicantCity = getValueViaPath<string>(
    externalData,
    'identity.data.address.city',
  )

  const actorName = getValueViaPath<string>(
    externalData,
    'identity.data.actor.name',
  )

  const actorNationalId = getValueViaPath<string>(
    externalData,
    'identity.data.actor.nationalId',
  )

  const categories =
    getValueViaPath<Category[]>(externalData, 'categories.data') ?? []

  const protectiveFactorSections =
    getValueViaPath<ProtectiveFactorSectionDto[]>(
      externalData,
      'protectiveFactors.data',
    ) ?? []

  const genders =
    getValueViaPath<DropDownDto[]>(externalData, 'genders.data') ?? []

  const childFoundInFrigg =
    getValueViaPath<boolean>(
      externalData,
      'childInformation.data.childFoundInFrigg',
    ) ?? false

  const languageEnvironmentOptions =
    getValueViaPath<Option[]>(
      externalData,
      'childInformation.data.languageEnvironmentOptions',
    ) ?? []

  const urgencyAssessments =
    getValueViaPath<DetailedDropDownDto[]>(
      externalData,
      'urgencyAssessments.data',
    ) ?? []

  return {
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantPostalCode,
    applicantCity,
    actorName,
    actorNationalId,
    categories,
    protectiveFactorSections,
    genders,
    childFoundInFrigg,
    languageEnvironmentOptions,
    urgencyAssessments,
  }
}
