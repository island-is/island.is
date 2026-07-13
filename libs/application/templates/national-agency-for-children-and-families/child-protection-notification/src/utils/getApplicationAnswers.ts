import { getValueViaPath, YesOrNo } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { Parent } from './types'
import { KnowsNationalId } from './constants'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const serviceProviderService = getValueViaPath<string>(
    answers,
    'serviceProvider.service',
  )

  const serviceProviderServiceType = getValueViaPath<string>(
    answers,
    'serviceProvider.serviceType',
  )

  const serviceProviderName = getValueViaPath<string>(
    answers,
    'serviceProvider.name',
  )

  const serviceProviderNationalId = getValueViaPath<string>(
    answers,
    'serviceProvider.nationalId',
  )

  const serviceProviderAddressStreet = getValueViaPath<string>(
    answers,
    'serviceProvider.address.streetAddress',
  )

  const serviceProviderAddressPostalCode = getValueViaPath<string>(
    answers,
    'serviceProvider.address.postalCode',
  )

  const serviceProviderAddressCity = getValueViaPath<string>(
    answers,
    'serviceProvider.address.city',
  )

  const serviceProviderContactPersonName = getValueViaPath<string>(
    answers,
    'serviceProvider.contactPersonName',
  )

  const serviceProviderContactPersonNationalId = getValueViaPath<string>(
    answers,
    'serviceProvider.contactPersonNationalId',
  )

  const serviceProviderContactPersonWorkEmail = getValueViaPath<string>(
    answers,
    'serviceProvider.contactPersonWorkEmail',
  )

  const serviceProviderContactPersonWorkPhone = getValueViaPath<string>(
    answers,
    'serviceProvider.contactPersonWorkPhone',
  )

  const childKnowsNationalId = getValueViaPath<KnowsNationalId>(
    answers,
    'child.knowsNationalId',
  )

  const childNoNationalIdReason = getValueViaPath<string>(
    answers,
    'child.noNationalIdReason',
  )

  const childNationalId = getValueViaPath<string>(
    answers,
    'child.nationalIdInfo.nationalId',
  )

  const childName = getValueViaPath<string>(
    answers,
    'child.nationalIdInfo.name',
  )

  const childPhone = getValueViaPath<string>(
    answers,
    'child.nationalIdInfo.phone',
  )

  const childEmail = getValueViaPath<string>(
    answers,
    'child.nationalIdInfo.email',
  )

  const childUsePronounAndPreferredName =
    getValueViaPath<string[]>(
      answers,
      'child.nationalIdInfo.usePronounAndPreferredName',
    ) ?? []

  const childPreferredName = getValueViaPath<string>(
    answers,
    'child.nationalIdInfo.preferredName',
  )

  const childPreferredPronoun =
    getValueViaPath<string[]>(
      answers,
      'child.nationalIdInfo.preferredPronoun',
    ) ?? []

  const childManualName = getValueViaPath<string>(
    answers,
    'child.manualInfo.name',
  )

  const childManualAge = getValueViaPath<string>(
    answers,
    'child.manualInfo.age',
  )

  const childManualGender = getValueViaPath<string>(
    answers,
    'child.manualInfo.gender',
  )

  const childManualUsePronounAndPreferredName =
    getValueViaPath<string[]>(
      answers,
      'child.manualInfo.usePronounAndPreferredName',
    ) ?? []

  const childManualPreferredName = getValueViaPath<string>(
    answers,
    'child.manualInfo.preferredName',
  )

  const childManualPreferredPronoun =
    getValueViaPath<string[]>(answers, 'child.manualInfo.preferredPronoun') ??
    []

  const childManualCountry = getValueViaPath<string>(
    answers,
    'child.manualInfo.country',
  )

  const childManualAddress = getValueViaPath<string>(
    answers,
    'child.manualInfo.address',
  )

  const childManualPostalCode = getValueViaPath<string>(
    answers,
    'child.manualInfo.postalCode',
  )

  const childManualMunicipality = getValueViaPath<string>(
    answers,
    'child.manualInfo.municipality',
  )

  const childManualLanguage = getValueViaPath<string>(
    answers,
    'child.manualInfo.language',
  )

  const childManualNeedsInterpreter =
    getValueViaPath<string[]>(answers, 'child.manualInfo.needsInterpreter') ??
    []

  const parentsKnowsNationalIds = getValueViaPath<YesOrNo>(
    answers,
    'parents.knowsParentNationalIds',
  )

  const parent1 = getValueViaPath<Parent>(answers, 'parents.parent1')

  const parent2 = getValueViaPath<Parent>(answers, 'parents.parent2')

  const protectiveFactors = getValueViaPath<
    Record<string, Record<string, string[]>>
  >(answers, 'protectiveFactors')

  const childSafetyUrgencyLevel = getValueViaPath<string>(
    answers,
    'childSafetyUrgencyLevel',
  )

  return {
    serviceProviderService,
    serviceProviderServiceType,
    serviceProviderName,
    serviceProviderNationalId,
    serviceProviderAddressStreet,
    serviceProviderAddressPostalCode,
    serviceProviderAddressCity,
    serviceProviderContactPersonName,
    serviceProviderContactPersonNationalId,
    serviceProviderContactPersonWorkEmail,
    serviceProviderContactPersonWorkPhone,
    childKnowsNationalId,
    childNoNationalIdReason,
    childNationalId,
    childName,
    childPhone,
    childEmail,
    childUsePronounAndPreferredName,
    childPreferredName,
    childPreferredPronoun,
    childManualName,
    childManualAge,
    childManualGender,
    childManualUsePronounAndPreferredName,
    childManualPreferredName,
    childManualPreferredPronoun,
    childManualCountry,
    childManualAddress,
    childManualPostalCode,
    childManualMunicipality,
    childManualLanguage,
    childManualNeedsInterpreter,
    parentsKnowsNationalIds,
    parent1,
    parent2,
    protectiveFactors,
    childSafetyUrgencyLevel,
  }
}
