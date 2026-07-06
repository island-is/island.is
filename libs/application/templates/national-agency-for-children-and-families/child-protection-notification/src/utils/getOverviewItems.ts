import { YES, coreMessages, getValueViaPath } from '@island.is/application/core'
import { Parent } from './types'
import {
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import { formatNumber } from 'libphonenumber-js'
import {
  getAllCountryCodes,
  getAllLanguageCodes,
} from '@island.is/shared/utils'
import { format as formatKennitala } from 'kennitala'
import {
  childMessages,
  expectantParentsMessages,
  prerequisitesMessages,
  sharedMessages,
} from '../lib/messages'
import {
  Gender,
  KnowsNationalId,
  NoNationalIdReason,
  ParentGender,
  Pronoun,
} from '../utils/constants'
import { getApplicationAnswers } from './getApplicationAnswers'

export const getOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: 'Full width',
      valueText: getValueViaPath<string>(answers, 'applicant.name') ?? '',
    },
    {
      width: 'half',
      keyText: 'Half width',
      valueText:
        getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
    },
    {
      width: 'half',
      keyText: 'Half width',
      valueText: 'Hvassaleiti 5',
    },
    {
      width: 'full',
      // empty item to end line
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: 'test@test.is',
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: '+354 123 4567',
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: '+354 123 4567',
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: '+354 123 4567',
    },
    {
      width: 'full',
      // empty item to end line
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: 'Reykjavík',
    },
    {
      width: 'half',
      keyText: 'Half width',
      valueText: 'test@test.is',
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: 'test@test.is',
    },
  ]
}

export const getServiceProviderItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const {
    serviceProviderService,
    serviceProviderServiceType,
    serviceProviderName,
    serviceProviderNationalId,
    serviceProviderAddressStreet,
    serviceProviderAddressPostalCode,
    serviceProviderAddressCity,
  } = getApplicationAnswers(answers)

  return [
    {
      // TODO: Need to update when data implementation is done (need to display the label, not the value)
      width: 'half',
      keyText: prerequisitesMessages.serviceProvider.service,
      valueText: serviceProviderService ?? '',
    },
    {
      // TODO: Need to update when data implementation is done (need to display the label, not the value)
      width: 'half',
      keyText: prerequisitesMessages.serviceProvider.serviceType,
      valueText: serviceProviderServiceType ?? '',
    },
    {
      width: 'half',
      keyText: coreMessages.name,
      valueText: serviceProviderName ?? '',
    },
    {
      width: 'half',
      keyText: coreMessages.nationalId,
      valueText: formatKennitala(serviceProviderNationalId ?? ''),
    },
    {
      width: 'half',
      keyText: sharedMessages.address,
      valueText: serviceProviderAddressStreet ?? '',
    },
    {
      width: 'half',
      keyText: sharedMessages.municipality,
      valueText: `${serviceProviderAddressPostalCode}, ${serviceProviderAddressCity}`,
    },
  ]
}

export const getChildWithNationalIdItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const {
    childKnowsNationalId,
    childNationalId,
    childName,
    childEmail,
    childPhone,
    childUsePronounAndPreferredName,
    childPreferredName,
    childPreferredPronoun,
  } = getApplicationAnswers(answers)

  const hasPronounPreference = (childUsePronounAndPreferredName ?? []).includes(
    YES,
  )

  return [
    {
      width: 'half',
      keyText: childMessages.nationalIdLookup.radioLabel,
      valueText: childKnowsNationalId
        ? knowsNationalIdLabelMap[
            childKnowsNationalId as keyof typeof knowsNationalIdLabelMap
          ] ?? childKnowsNationalId
        : '',
    },
    {
      width: 'half',
      keyText: coreMessages.nationalId,
      valueText: formatKennitala(childNationalId ?? ''),
    },
    {
      width: 'half',
      keyText: coreMessages.name,
      valueText: childName ?? '',
    },
    {
      width: 'half',
      keyText: childMessages.nationalIdLookup.email,
      valueText: childEmail ?? '',
      hideIfEmpty: true,
    },
    {
      width: 'half',
      keyText: childMessages.nationalIdLookup.phone,
      valueText: formatNumber(childPhone ?? '', 'International'),
      hideIfEmpty: true,
    },
    ...(hasPronounPreference
      ? [
          {
            width: 'full' as const,
            keyText: childMessages.nationalIdLookup.usePronounAndPreferredName,
            valueText: sharedMessages.radioYes,
          },
        ]
      : []),
    ...(hasPronounPreference && childPreferredName
      ? [
          {
            width: 'half' as const,
            keyText: childMessages.nationalIdLookup.preferredName,
            valueText: childPreferredName,
          },
        ]
      : []),
    ...(hasPronounPreference && childPreferredPronoun
      ? [
          {
            width: 'half' as const,
            keyText: childMessages.nationalIdLookup.preferredPronoun,
            valueText:
              pronounLabelMap[
                childPreferredPronoun as keyof typeof pronounLabelMap
              ] ?? childPreferredPronoun,
          },
        ]
      : []),
  ]
}

const genderLabelMap = {
  [Gender.GIRL]: childMessages.manualInfo.genderGirl,
  [Gender.BOY]: childMessages.manualInfo.genderBoy,
  [Gender.OTHER]: childMessages.manualInfo.genderOther,
} as const

const parentGenderLabelMap = {
  [ParentGender.MALE]: expectantParentsMessages.genderMale,
  [ParentGender.FEMALE]: expectantParentsMessages.genderFemale,
  [ParentGender.NON_BINARY]: expectantParentsMessages.genderNonBinary,
} as const

const pronounLabelMap = {
  [Pronoun.HANN]: childMessages.nationalIdLookup.pronounHann,
  [Pronoun.HUN]: childMessages.nationalIdLookup.pronounHun,
  [Pronoun.HAN]: childMessages.nationalIdLookup.pronounHan,
} as const

const knowsNationalIdLabelMap = {
  [KnowsNationalId.YES]: childMessages.nationalIdLookup.radioOptionYes,
  [KnowsNationalId.NO]: childMessages.nationalIdLookup.radioOptionNo,
  [KnowsNationalId.UNBORN]: childMessages.nationalIdLookup.radioOptionUnborn,
} as const

const noNationalIdReasonLabelMap = {
  [NoNationalIdReason.EXPECTED_BUT_UNKNOWN]:
    childMessages.noNationalId.reasonExpectedButUnknown,
  [NoNationalIdReason.TRAVELER]: childMessages.noNationalId.reasonTraveler,
  [NoNationalIdReason.BORDER_RECEPTION]:
    childMessages.noNationalId.reasonBorderReception,
} as const

const municipalityLabelMap: Record<string, string> = {
  reykjavik: 'Reykjavík',
  kopavogur: 'Kópavogur',
  hafnarfjordur: 'Hafnarfjörður',
  akureyri: 'Akureyri',
}

export const getChildUnbornRadioItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const { childKnowsNationalId } = getApplicationAnswers(answers)

  return [
    {
      width: 'half',
      keyText: childMessages.nationalIdLookup.radioLabel,
      valueText: childKnowsNationalId
        ? knowsNationalIdLabelMap[
            childKnowsNationalId as keyof typeof knowsNationalIdLabelMap
          ] ?? childKnowsNationalId
        : '',
    },
  ]
}

export const getChildNoPreItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const { childKnowsNationalId, childNoNationalIdReason } =
    getApplicationAnswers(answers)

  return [
    {
      width: 'half',
      keyText: childMessages.nationalIdLookup.radioLabel,
      valueText: childKnowsNationalId
        ? knowsNationalIdLabelMap[
            childKnowsNationalId as keyof typeof knowsNationalIdLabelMap
          ] ?? childKnowsNationalId
        : '',
    },
    {
      width: 'half',
      keyText: childMessages.noNationalId.reasonLabel,
      valueText: childNoNationalIdReason
        ? noNationalIdReasonLabelMap[
            childNoNationalIdReason as keyof typeof noNationalIdReasonLabelMap
          ] ?? childNoNationalIdReason
        : '',
      hideIfEmpty: true,
    },
  ]
}

export const getChildManualItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const {
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
  } = getApplicationAnswers(answers)

  const hasPronounPreference = (
    childManualUsePronounAndPreferredName ?? []
  ).includes(YES)
  const countryName =
    getAllCountryCodes().find((c) => c.code === childManualCountry)?.name ??
    childManualCountry ??
    ''
  const languageName =
    getAllLanguageCodes().find((l) => l.code === childManualLanguage)?.name ??
    childManualLanguage ??
    ''

  return [
    {
      width: 'half',
      keyText: childMessages.manualInfo.name,
      valueText: childManualName ?? '',
      hideIfEmpty: true,
    },
    {
      width: 'half',
      keyText: childMessages.manualInfo.age,
      valueText: childManualAge ?? '',
      hideIfEmpty: true,
    },
    {
      width: 'half',
      keyText: childMessages.manualInfo.gender,
      valueText: childManualGender
        ? genderLabelMap[childManualGender as keyof typeof genderLabelMap] ??
          childManualGender
        : '',
      hideIfEmpty: true,
    },
    ...(hasPronounPreference
      ? [
          {
            width: 'full' as const,
            keyText: childMessages.nationalIdLookup.usePronounAndPreferredName,
            valueText: sharedMessages.radioYes,
          },
        ]
      : []),
    ...(hasPronounPreference && childManualPreferredName
      ? [
          {
            width: 'half' as const,
            keyText: childMessages.nationalIdLookup.preferredName,
            valueText: childManualPreferredName,
          },
        ]
      : []),
    ...(hasPronounPreference && childManualPreferredPronoun
      ? [
          {
            width: 'half' as const,
            keyText: childMessages.nationalIdLookup.preferredPronoun,
            valueText:
              pronounLabelMap[
                childManualPreferredPronoun as keyof typeof pronounLabelMap
              ] ?? childManualPreferredPronoun,
          },
        ]
      : []),
    {
      width: 'half',
      keyText: childMessages.manualInfo.country,
      valueText: countryName,
      hideIfEmpty: true,
    },
    {
      width: 'half',
      keyText: childMessages.manualInfo.address,
      valueText: childManualAddress ?? '',
      hideIfEmpty: true,
    },
    {
      width: 'half',
      keyText: childMessages.manualInfo.postalCode,
      valueText: childManualPostalCode ?? '',
      hideIfEmpty: true,
    },
    {
      width: 'half',
      keyText: childMessages.manualInfo.municipality,
      valueText: childManualMunicipality
        ? municipalityLabelMap[childManualMunicipality] ??
          childManualMunicipality
        : '',
      hideIfEmpty: true,
    },
    {
      width: 'half',
      keyText: childMessages.manualInfo.language,
      valueText: languageName,
      hideIfEmpty: true,
    },
    ...((childManualNeedsInterpreter ?? []).length > 0
      ? [
          {
            width: 'full' as const,
            keyText: childMessages.manualInfo.needsInterpreter,
            valueText: 'Já',
          },
        ]
      : []),
  ]
}

const buildParentItems = (
  parent: Parent | undefined,
  knowsParentNationalIds: string | undefined,
): Array<KeyValueItem> => {
  if (knowsParentNationalIds === YES) {
    return [
      {
        width: 'half',
        keyText: coreMessages.nationalId,
        valueText: formatKennitala(parent?.nationalIdInfo?.nationalId ?? ''),
      },
      {
        width: 'half',
        keyText: coreMessages.name,
        valueText: parent?.nationalIdInfo?.name ?? '',
      },
      {
        width: 'half',
        keyText: childMessages.nationalIdLookup.email,
        valueText: parent?.nationalIdInfo?.email ?? '',
        hideIfEmpty: true,
      },
      {
        width: 'half',
        keyText: childMessages.nationalIdLookup.phone,
        valueText: formatNumber(
          parent?.nationalIdInfo?.phone ?? '',
          'International',
        ),
        hideIfEmpty: true,
      },
    ]
  }

  const countryName =
    getAllCountryCodes().find((c) => c.code === parent?.country)?.name ??
    parent?.country ??
    ''
  const citizenshipName =
    getAllCountryCodes().find((c) => c.code === parent?.citizenship)?.name ??
    parent?.citizenship ??
    ''

  return [
    {
      width: 'half',
      keyText: childMessages.manualInfo.name,
      valueText: parent?.name ?? '',
      hideIfEmpty: true,
    },
    {
      width: 'half',
      keyText: childMessages.manualInfo.age,
      valueText: parent?.age ?? '',
      hideIfEmpty: true,
    },
    {
      width: 'half',
      keyText: childMessages.manualInfo.gender,
      valueText: parent?.gender
        ? parentGenderLabelMap[
            parent.gender as keyof typeof parentGenderLabelMap
          ] ?? parent.gender
        : '',
      hideIfEmpty: true,
    },
    {
      width: 'half',
      keyText: childMessages.manualInfo.country,
      valueText: countryName,
      hideIfEmpty: true,
    },
    {
      width: 'half',
      keyText: expectantParentsMessages.citizenship,
      valueText: citizenshipName,
      hideIfEmpty: true,
    },
    {
      width: 'half',
      keyText: childMessages.manualInfo.address,
      valueText: parent?.address ?? '',
      hideIfEmpty: true,
    },
    {
      width: 'half',
      keyText: childMessages.manualInfo.postalCode,
      valueText: parent?.postalCode ?? '',
      hideIfEmpty: true,
    },
    {
      width: 'half',
      keyText: childMessages.manualInfo.municipality,
      valueText: parent?.municipality
        ? municipalityLabelMap[parent.municipality] ?? parent.municipality
        : '',
      hideIfEmpty: true,
    },
  ]
}

const knowsParentNationalIdsLabelMap: Record<string, string> = {
  yes: 'Já',
  no: 'Nei',
}

export const getExpectantParentsPreItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const { expectantParentsKnowsNationalIds } = getApplicationAnswers(answers)

  return [
    {
      width: 'full',
      keyText: expectantParentsMessages.radioLabel,
      valueText: expectantParentsKnowsNationalIds
        ? knowsParentNationalIdsLabelMap[expectantParentsKnowsNationalIds] ??
          expectantParentsKnowsNationalIds
        : '',
    },
  ]
}

export const getExpectantParent1Items = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const { parent1, expectantParentsKnowsNationalIds } =
    getApplicationAnswers(answers)
  return buildParentItems(parent1, expectantParentsKnowsNationalIds)
}

export const getExpectantParent2Items = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const { parent2, expectantParentsKnowsNationalIds } =
    getApplicationAnswers(answers)
  return buildParentItems(parent2, expectantParentsKnowsNationalIds)
}

export const getServiceProviderContactPersonItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const {
    serviceProviderContactPersonName,
    serviceProviderContactPersonNationalId,
    serviceProviderContactPersonWorkEmail,
    serviceProviderContactPersonWorkPhone,
  } = getApplicationAnswers(answers)

  return [
    {
      width: 'half',
      keyText: coreMessages.name,
      valueText: serviceProviderContactPersonName ?? '',
    },
    {
      width: 'half',
      keyText: coreMessages.nationalId,
      valueText: formatKennitala(serviceProviderContactPersonNationalId ?? ''),
    },
    {
      width: 'half',
      keyText: prerequisitesMessages.serviceProvider.workEmail,
      valueText: serviceProviderContactPersonWorkEmail ?? '',
    },
    {
      width: 'half',
      keyText: prerequisitesMessages.serviceProvider.workPhone,
      valueText: formatPhoneNumber(
        removeCountryCode(serviceProviderContactPersonWorkPhone ?? ''),
      ),
    },
  ]
}
