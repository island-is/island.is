import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'

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

  const childKnowsNationalId = getValueViaPath<string>(
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

  const childUsePronounAndPreferredName = getValueViaPath<string[]>(
    answers,
    'child.nationalIdInfo.usePronounAndPreferredName',
  )

  const childPreferredName = getValueViaPath<string>(
    answers,
    'child.nationalIdInfo.preferredName',
  )

  const childPreferredPronoun = getValueViaPath<string>(
    answers,
    'child.nationalIdInfo.preferredPronoun',
  )

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

  const childManualUsePronounAndPreferredName = getValueViaPath<string[]>(
    answers,
    'child.manualInfo.usePronounAndPreferredName',
  )

  const childManualPreferredName = getValueViaPath<string>(
    answers,
    'child.manualInfo.preferredName',
  )

  const childManualPreferredPronoun = getValueViaPath<string>(
    answers,
    'child.manualInfo.preferredPronoun',
  )

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

  const childManualNeedsInterpreter = getValueViaPath<string[]>(
    answers,
    'child.manualInfo.needsInterpreter',
  )

  const expectantParentsKnowsNationalIds = getValueViaPath<string>(
    answers,
    'expectantParents.knowsParentNationalIds',
  )

  const parent1NationalId = getValueViaPath<string>(
    answers,
    'expectantParents.parent1.nationalIdInfo.nationalId',
  )

  const parent1Name = getValueViaPath<string>(
    answers,
    'expectantParents.parent1.nationalIdInfo.name',
  )

  const parent1Email = getValueViaPath<string>(
    answers,
    'expectantParents.parent1.nationalIdInfo.email',
  )

  const parent1Phone = getValueViaPath<string>(
    answers,
    'expectantParents.parent1.nationalIdInfo.phone',
  )

  const parent1ManualName = getValueViaPath<string>(
    answers,
    'expectantParents.parent1.name',
  )

  const parent1ManualAge = getValueViaPath<string>(
    answers,
    'expectantParents.parent1.age',
  )

  const parent1ManualGender = getValueViaPath<string>(
    answers,
    'expectantParents.parent1.gender',
  )

  const parent1ManualCountry = getValueViaPath<string>(
    answers,
    'expectantParents.parent1.country',
  )

  const parent1ManualCitizenship = getValueViaPath<string>(
    answers,
    'expectantParents.parent1.citizenship',
  )

  const parent1ManualAddress = getValueViaPath<string>(
    answers,
    'expectantParents.parent1.address',
  )

  const parent1ManualPostalCode = getValueViaPath<string>(
    answers,
    'expectantParents.parent1.postalCode',
  )

  const parent1ManualMunicipality = getValueViaPath<string>(
    answers,
    'expectantParents.parent1.municipality',
  )

  const parent2NationalId = getValueViaPath<string>(
    answers,
    'expectantParents.parent2.nationalIdInfo.nationalId',
  )

  const parent2Name = getValueViaPath<string>(
    answers,
    'expectantParents.parent2.nationalIdInfo.name',
  )

  const parent2Email = getValueViaPath<string>(
    answers,
    'expectantParents.parent2.nationalIdInfo.email',
  )

  const parent2Phone = getValueViaPath<string>(
    answers,
    'expectantParents.parent2.nationalIdInfo.phone',
  )

  const parent2ManualName = getValueViaPath<string>(
    answers,
    'expectantParents.parent2.name',
  )

  const parent2ManualAge = getValueViaPath<string>(
    answers,
    'expectantParents.parent2.age',
  )

  const parent2ManualGender = getValueViaPath<string>(
    answers,
    'expectantParents.parent2.gender',
  )

  const parent2ManualCountry = getValueViaPath<string>(
    answers,
    'expectantParents.parent2.country',
  )

  const parent2ManualCitizenship = getValueViaPath<string>(
    answers,
    'expectantParents.parent2.citizenship',
  )

  const parent2ManualAddress = getValueViaPath<string>(
    answers,
    'expectantParents.parent2.address',
  )

  const parent2ManualPostalCode = getValueViaPath<string>(
    answers,
    'expectantParents.parent2.postalCode',
  )

  const parent2ManualMunicipality = getValueViaPath<string>(
    answers,
    'expectantParents.parent2.municipality',
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
    expectantParentsKnowsNationalIds,
    parent1NationalId,
    parent1Name,
    parent1Email,
    parent1Phone,
    parent1ManualName,
    parent1ManualAge,
    parent1ManualGender,
    parent1ManualCountry,
    parent1ManualCitizenship,
    parent1ManualAddress,
    parent1ManualPostalCode,
    parent1ManualMunicipality,
    parent2NationalId,
    parent2Name,
    parent2Email,
    parent2Phone,
    parent2ManualName,
    parent2ManualAge,
    parent2ManualGender,
    parent2ManualCountry,
    parent2ManualCitizenship,
    parent2ManualAddress,
    parent2ManualPostalCode,
    parent2ManualMunicipality,
  }
}
