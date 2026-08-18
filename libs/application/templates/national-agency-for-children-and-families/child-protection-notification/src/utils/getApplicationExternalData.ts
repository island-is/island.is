import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { SchoolDto } from '@island.is/clients/mms/data-gateway'
import { Option } from '@island.is/clients/mms/frigg'
import {
  DetailedDropDownDto,
  DropDownDto,
  ProtectiveFactorSectionDto,
} from '@island.is/clients/national-agency-for-children-and-families'
import { ChildNationalIdTypeCode } from './constants'
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

  const languageEnvironmentOptions =
    getValueViaPath<Option[]>(externalData, 'languageEnvironments.data') ?? []

  const childSafetyLevels =
    getValueViaPath<DetailedDropDownDto[]>(
      externalData,
      'childSafetyLevels.data',
    ) ?? []

  const postalCodes =
    getValueViaPath<DropDownDto[]>(externalData, 'postalCodes.data') ?? []

  const pronounOptions =
    getValueViaPath<DropDownDto[]>(externalData, 'pronouns.data') ?? []

  const disabilityStatusOptions =
    getValueViaPath<DropDownDto[]>(externalData, 'disabilityStatuses.data') ??
    []

  const childUnknownNationalIdStates =
    getValueViaPath<DropDownDto[]>(
      externalData,
      'childUnknownNationalIdStates.data',
    ) ?? []

  const guardianNotAwareReasons =
    getValueViaPath<DropDownDto[]>(
      externalData,
      'guardianNotAwareReasons.data',
    ) ?? []

  const schoolTypes =
    getValueViaPath<DropDownDto[]>(externalData, 'schoolTypes.data') ?? []

  const childNationalIdTypeCode = getValueViaPath<ChildNationalIdTypeCode>(
    externalData,
    'childNationalIdType.data.registryCode',
  )

  const schools =
    getValueViaPath<SchoolDto[]>(externalData, 'schools.data') ?? []

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
    languageEnvironmentOptions,
    childSafetyLevels,
    postalCodes,
    pronounOptions,
    disabilityStatusOptions,
    childUnknownNationalIdStates,
    guardianNotAwareReasons,
    schoolTypes,
    childNationalIdTypeCode,
    schools,
  }
}
