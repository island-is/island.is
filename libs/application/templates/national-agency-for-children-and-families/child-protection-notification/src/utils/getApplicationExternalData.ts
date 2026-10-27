import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  DetailedDropDownDto,
  DropDownDto,
  ExternalNotifierRoleSubTypeResponse,
  ProtectiveFactorSectionDto,
} from '@island.is/clients/national-agency-for-children-and-families'
import { ChildNationalIdTypeCode } from './constants'
import { Category } from './types'

export const getApplicationExternalData = (
  externalData: Application['externalData'],
) => {
  const identityName = getValueViaPath<string>(
    externalData,
    'identity.data.name',
  )

  const identityNationalId = getValueViaPath<string>(
    externalData,
    'identity.data.nationalId',
  )

  const identityAddress = getValueViaPath<string>(
    externalData,
    'identity.data.address.streetAddress',
  )

  const identityPostalCode = getValueViaPath<string>(
    externalData,
    'identity.data.address.postalCode',
  )

  const identityCity = getValueViaPath<string>(
    externalData,
    'identity.data.address.city',
  )

  const identityActorName = getValueViaPath<string>(
    externalData,
    'identity.data.actor.name',
  )

  const identityActorNationalId = getValueViaPath<string>(
    externalData,
    'identity.data.actor.nationalId',
  )

  const nationalRegistryName = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.fullName',
  )

  const nationalRegistryNationalId = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.nationalId',
  )

  const userProfileEmail = getValueViaPath<string>(
    externalData,
    'userProfile.data.email',
  )

  const userProfilePhoneNumber = getValueViaPath<string>(
    externalData,
    'userProfile.data.mobilePhoneNumber',
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

  const notifierRoles =
    getValueViaPath<DropDownDto[]>(externalData, 'notifierRoles.data') ?? []

  const notifierRoleSubTypes =
    getValueViaPath<ExternalNotifierRoleSubTypeResponse[]>(
      externalData,
      'notifierRoleSubTypes.data',
    ) ?? []

  return {
    identityName,
    identityNationalId,
    identityAddress,
    identityPostalCode,
    identityCity,
    identityActorName,
    identityActorNationalId,
    nationalRegistryName,
    nationalRegistryNationalId,
    userProfileEmail,
    userProfilePhoneNumber,
    categories,
    protectiveFactorSections,
    genders,
    childSafetyLevels,
    postalCodes,
    pronounOptions,
    disabilityStatusOptions,
    childUnknownNationalIdStates,
    guardianNotAwareReasons,
    schoolTypes,
    childNationalIdTypeCode,
    notifierRoles,
    notifierRoleSubTypes,
  }
}
