import {
  coreMessages,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import { getCountryByCode, getLanguageByCode } from '@island.is/shared/utils'
import { format as formatKennitala } from 'kennitala'
import { formatNumber } from 'libphonenumber-js'
import {
  childMessages,
  memmMessages,
  parentsMessages,
  prerequisitesMessages,
  reasonForNotificationMessages,
  sharedMessages,
} from '../lib/messages'
import {
  DO_NOT_KNOW,
  KnowsNationalId,
  LanguageEnvironmentOptions,
  NOT_APPLICABLE,
  NoNationalIdReason,
  Pronoun,
  RISK_TO_UNBORN,
} from '../utils/constants'
import {
  getAreParentsInformedTitle,
  getHasDiscussedWithParentsTitle,
} from './childProtectionNotificationUtils'
import {
  isDayCareProvider,
  isKnowsNationalId,
  isNoNationalId,
  isSchoolType,
  showDisabilityService,
  showWellbeingContactFields,
  showWellbeingManagerFields,
} from './conditionUtils'
import { getApplicationAnswers } from './getApplicationAnswers'
import { getApplicationExternalData } from './getApplicationExternalData'
import { Parent } from './types'

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

const educationTypeLabelMap = {
  kindergarten: memmMessages.education.typeKindergarten,
  elementarySchool: memmMessages.education.typeElementarySchool,
  highSchool: memmMessages.education.typeHighSchool,
  daycareProvider: memmMessages.education.typeDaycareProvider,
} as const

const receptionRadioLabelMap = {
  [YES]: sharedMessages.radioYes,
  [NO]: sharedMessages.radioNo,
  [DO_NOT_KNOW]: sharedMessages.radioDoNotKnow,
  [NOT_APPLICABLE]: memmMessages.reception.optionNotApplicable,
} as const

const wellbeingRadioLabelMap = {
  [YES]: sharedMessages.radioYes,
  [NO]: sharedMessages.radioNo,
  [DO_NOT_KNOW]: sharedMessages.radioDoNotKnow,
} as const

const languageUsageLabelMap = {
  [LanguageEnvironmentOptions.ONLY_ICELANDIC]:
    memmMessages.culture.languageUsageOnlyIcelandic,
  [LanguageEnvironmentOptions.ICELANDIC_AND_OTHER]:
    memmMessages.culture.languageUsageBoth,
  [LanguageEnvironmentOptions.ONLY_OTHER]:
    memmMessages.culture.languageUsageOnlyOther,
} as const

const disabilityServiceLabelMap = {
  municipal: memmMessages.wellbeing.disabilityServiceMunicipal,
  sports: memmMessages.wellbeing.disabilityServiceSports,
  health: memmMessages.wellbeing.disabilityServiceHealth,
  emergency: memmMessages.wellbeing.disabilityServiceEmergency,
} as const

const municipalityLabelMap: Record<string, string> = {
  reykjavik: 'Reykjavík',
  kopavogur: 'Kópavogur',
  hafnarfjordur: 'Hafnarfjörður',
  akureyri: 'Akureyri',
}

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

export const getChildWithNationalIdItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const {
    childKnowsNationalId,
    childNoNationalIdReason,
    childNationalId,
    childName,
    childEmail,
    childPhone,
    childUsePronounAndPreferredName,
    childPreferredName,
    childPreferredPronoun,
  } = getApplicationAnswers(answers)

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
    ...(isKnowsNationalId(answers)
      ? [
          {
            width: 'half' as const,
            keyText: coreMessages.nationalId,
            valueText: formatKennitala(childNationalId ?? ''),
          },
          {
            width: 'half' as const,
            keyText: coreMessages.name,
            valueText: childName ?? '',
          },
          {
            width: 'half' as const,
            keyText: childMessages.nationalIdLookup.email,
            valueText: childEmail ?? '',
            hideIfEmpty: true,
          },
          {
            width: 'half' as const,
            keyText: childMessages.nationalIdLookup.phone,
            valueText: formatNumber(childPhone ?? '', 'International'),
            hideIfEmpty: true,
          },
          ...(childUsePronounAndPreferredName.includes(YES)
            ? [
                {
                  width: 'full' as const,
                  keyText:
                    childMessages.nationalIdLookup.usePronounAndPreferredName,
                  valueText: sharedMessages.radioYes,
                },
                {
                  width: 'half' as const,
                  keyText: childMessages.nationalIdLookup.preferredName,
                  valueText: childPreferredName,
                  hideIfEmpty: true,
                },
                {
                  width: 'half' as const,
                  keyText: childMessages.nationalIdLookup.preferredPronoun,
                  valueText: childPreferredPronoun.map(
                    (pronoun) =>
                      pronounLabelMap[
                        pronoun as keyof typeof pronounLabelMap
                      ] ?? pronoun,
                  ),
                  hideIfEmpty: true,
                },
              ]
            : []),
        ]
      : []),
    ...(isNoNationalId(answers)
      ? [
          {
            width: 'half' as const,
            keyText: childMessages.noNationalId.reasonLabel,
            valueText: childNoNationalIdReason
              ? noNationalIdReasonLabelMap[
                  childNoNationalIdReason as keyof typeof noNationalIdReasonLabelMap
                ] ?? childNoNationalIdReason
              : '',
            hideIfEmpty: true,
          },
        ]
      : []),
  ]
}

export const getChildManualItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const { genders } = getApplicationExternalData(externalData)
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
      valueText:
        genders.find((g) => g.value === childManualGender)?.label ??
        childManualGender ??
        '',
      hideIfEmpty: true,
    },
    ...(childManualUsePronounAndPreferredName.includes(YES)
      ? [
          {
            width: 'full' as const,
            keyText: childMessages.nationalIdLookup.usePronounAndPreferredName,
            valueText: sharedMessages.radioYes,
          },
          {
            width: 'half' as const,
            keyText: childMessages.nationalIdLookup.preferredName,
            valueText: childManualPreferredName,
            hideIfEmpty: true,
          },
          {
            width: 'half' as const,
            keyText: childMessages.nationalIdLookup.preferredPronoun,
            valueText: childManualPreferredPronoun.map(
              (pronoun) =>
                pronounLabelMap[pronoun as keyof typeof pronounLabelMap] ??
                pronoun,
            ),
            hideIfEmpty: true,
          },
        ]
      : []),
    {
      width: 'half',
      keyText: childMessages.manualInfo.country,
      valueText: getCountryByCode(childManualCountry ?? '')?.name,
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
      valueText: getLanguageByCode(childManualLanguage ?? '')?.name,
      hideIfEmpty: true,
    },
    {
      width: 'half',
      keyText: childMessages.manualInfo.needsInterpreter,
      valueText: childManualNeedsInterpreter.includes(YES)
        ? sharedMessages.radioYes
        : sharedMessages.radioNo,
    },
  ]
}

const buildParentItems = (
  parent: Parent | undefined,
  knowsParentNationalIds: string | undefined,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const { genders } = getApplicationExternalData(externalData)
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
      valueText:
        genders.find((g) => g.value === parent?.gender)?.label ??
        parent?.gender ??
        '',
      hideIfEmpty: true,
    },
    {
      width: 'half',
      keyText: childMessages.manualInfo.country,
      valueText: getCountryByCode(parent?.country ?? '')?.name,
      hideIfEmpty: true,
    },
    {
      width: 'half',
      keyText: parentsMessages.shared.citizenship,
      valueText: getCountryByCode(parent?.citizenship ?? '')?.code,
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

export const getParentsPreItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const { parentsKnowsNationalIds } = getApplicationAnswers(answers)

  return [
    {
      width: 'full',
      keyText: parentsMessages.expectantParents.radioLabel,
      valueText:
        parentsKnowsNationalIds === YES
          ? sharedMessages.radioYes
          : sharedMessages.radioNo,
    },
  ]
}

export const getParent1Items = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const { parent1, parentsKnowsNationalIds } = getApplicationAnswers(answers)
  return buildParentItems(parent1, parentsKnowsNationalIds, externalData)
}

export const getParent2Items = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const { parent2, parentsKnowsNationalIds } = getApplicationAnswers(answers)
  return buildParentItems(parent2, parentsKnowsNationalIds, externalData)
}

export const getMemmEducationItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const {
    memmEducationType,
    memmEducationSchoolName,
    memmEducationCaregiverName,
  } = getApplicationAnswers(answers)

  return [
    {
      width: 'full',
      keyText: memmMessages.education.typeLabel,
      valueText:
        educationTypeLabelMap[
          memmEducationType as keyof typeof educationTypeLabelMap
        ] ??
        memmEducationType ??
        '',
      hideIfEmpty: true,
    },
    ...(isSchoolType(answers)
      ? [
          {
            width: 'full' as const,
            keyText: memmMessages.education.schoolName,
            valueText: memmEducationSchoolName ?? '',
            hideIfEmpty: true,
          },
        ]
      : []),
    ...(isDayCareProvider(answers)
      ? [
          {
            width: 'full' as const,
            keyText: memmMessages.education.caregiverName,
            valueText: memmEducationCaregiverName ?? '',
            hideIfEmpty: true,
          },
        ]
      : []),
  ]
}

export const getMemmReceptionItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const { memmReceptionSeekingAsylum, memmReceptionRefugeeStatus } =
    getApplicationAnswers(answers)

  return [
    {
      width: 'full',
      keyText: memmMessages.reception.seekingAsylumLabel,
      valueText:
        receptionRadioLabelMap[
          memmReceptionSeekingAsylum as keyof typeof receptionRadioLabelMap
        ] ??
        memmReceptionSeekingAsylum ??
        '',
      hideIfEmpty: true,
    },
    {
      width: 'full',
      keyText: memmMessages.reception.refugeeStatusLabel,
      valueText:
        receptionRadioLabelMap[
          memmReceptionRefugeeStatus as keyof typeof receptionRadioLabelMap
        ] ??
        memmReceptionRefugeeStatus ??
        '',
      hideIfEmpty: true,
    },
  ]
}

export const getMemmCultureItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const {
    memmCultureLanguageUsage,
    memmCultureLanguages,
    memmCulturePreferredLanguage,
    memmCultureNeedsInterpreter,
  } = getApplicationAnswers(answers)

  return [
    {
      width: 'full',
      keyText: memmMessages.culture.languageUsageLabel,
      valueText:
        languageUsageLabelMap[
          memmCultureLanguageUsage as keyof typeof languageUsageLabelMap
        ] ??
        memmCultureLanguageUsage ??
        '',
      hideIfEmpty: true,
    },
    {
      width: 'full',
      keyText: memmMessages.culture.languagesSectionTitle,
      valueText: (memmCultureLanguages ?? []).map(
        (code) => getLanguageByCode(code)?.name ?? code,
      ),
      hideIfEmpty: true,
    },
    {
      width: 'full',
      keyText: memmMessages.culture.preferredLanguageTitle,
      valueText:
        getLanguageByCode(memmCulturePreferredLanguage ?? '')?.name ?? '',
      hideIfEmpty: true,
    },
    ...(memmCulturePreferredLanguage
      ? [
          {
            width: 'full' as const,
            keyText: memmMessages.culture.needsInterpreter,
            valueText: memmCultureNeedsInterpreter.includes(YES)
              ? sharedMessages.radioYes
              : sharedMessages.radioNo,
          },
        ]
      : []),
  ]
}

export const getMemmWellbeingItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const {
    memmWellbeingIntegratedService,
    memmWellbeingWellbeingContact,
    memmWellbeingWellbeingContactEmail,
    memmWellbeingWellbeingContactName,
    memmWellbeingWellbeingManager,
    memmWellbeingWellbeingManagerEmail,
    memmWellbeingWellbeingManagerName,
    memmWellbeingDisability,
    memmWellbeingDisabilityService,
  } = getApplicationAnswers(answers)

  return [
    {
      width: 'full',
      keyText: memmMessages.wellbeing.integratedServiceLabel,
      valueText:
        wellbeingRadioLabelMap[
          memmWellbeingIntegratedService as keyof typeof wellbeingRadioLabelMap
        ] ??
        memmWellbeingIntegratedService ??
        '',
      hideIfEmpty: true,
    },
    {
      width: 'full',
      keyText: memmMessages.wellbeing.wellbeingContactLabel,
      valueText:
        wellbeingRadioLabelMap[
          memmWellbeingWellbeingContact as keyof typeof wellbeingRadioLabelMap
        ] ??
        memmWellbeingWellbeingContact ??
        '',
      hideIfEmpty: true,
    },
    ...(showWellbeingContactFields(answers)
      ? [
          {
            width: 'half' as const,
            keyText: memmMessages.wellbeing.wellbeingContactEmail,
            valueText: memmWellbeingWellbeingContactEmail ?? '',
            hideIfEmpty: true,
          },
          {
            width: 'half' as const,
            keyText: memmMessages.wellbeing.wellbeingContactName,
            valueText: memmWellbeingWellbeingContactName ?? '',
            hideIfEmpty: true,
          },
        ]
      : []),
    {
      width: 'full',
      keyText: memmMessages.wellbeing.wellbeingManagerLabel,
      valueText:
        wellbeingRadioLabelMap[
          memmWellbeingWellbeingManager as keyof typeof wellbeingRadioLabelMap
        ] ??
        memmWellbeingWellbeingManager ??
        '',
      hideIfEmpty: true,
    },
    ...(showWellbeingManagerFields(answers)
      ? [
          {
            width: 'half' as const,
            keyText: memmMessages.wellbeing.wellbeingManagerEmail,
            valueText: memmWellbeingWellbeingManagerEmail ?? '',
            hideIfEmpty: true,
          },
          {
            width: 'half' as const,
            keyText: memmMessages.wellbeing.wellbeingManagerName,
            valueText: memmWellbeingWellbeingManagerName ?? '',
            hideIfEmpty: true,
          },
        ]
      : []),
    {
      width: 'full',
      keyText: memmMessages.wellbeing.disabilityLabel,
      valueText:
        wellbeingRadioLabelMap[
          memmWellbeingDisability as keyof typeof wellbeingRadioLabelMap
        ] ??
        memmWellbeingDisability ??
        '',
      hideIfEmpty: true,
    },
    ...(showDisabilityService(answers)
      ? [
          {
            width: 'full' as const,
            keyText: memmMessages.wellbeing.disabilityServiceLabel,
            valueText:
              disabilityServiceLabelMap[
                memmWellbeingDisabilityService as keyof typeof disabilityServiceLabelMap
              ] ??
              memmWellbeingDisabilityService ??
              '',
            hideIfEmpty: true,
          },
        ]
      : []),
  ]
}

export const getReasonDescriptionItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const { reasonDescription, additionalData } = getApplicationAnswers(answers)

  return [
    {
      width: 'full',
      keyText: reasonForNotificationMessages.description.subSectionTitle,
      valueText: reasonDescription ?? '',
      hideIfEmpty: true,
    },
    {
      width: 'full',
      keyText: reasonForNotificationMessages.description.additionalDataTitle,
      valueText: additionalData.includes(YES)
        ? sharedMessages.radioYes
        : sharedMessages.radioNo,
    },
  ]
}

export const getReasonForNotificationItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const {
    reasonForNotification,
    biggestConcernCategoryCode,
    riskToUnbornSelections,
  } = getApplicationAnswers(answers)
  const { categories } = getApplicationExternalData(externalData)

  const categoriesByCode = new Map(
    categories.map((category) => [category.code, category]),
  )

  const reasonItems = Object.entries(reasonForNotification).reduce<
    Array<KeyValueItem>
  >((items, [categoryCode, categoryValue]) => {
    if (
      !categoryValue ||
      typeof categoryValue !== 'object' ||
      Array.isArray(categoryValue)
    ) {
      return items
    }

    const category = categoriesByCode.get(categoryCode)
    if (!category) {
      return items
    }

    // Only include sub-categories that were explicitly selected in this category.
    const selectedSubCategoryValues = Object.entries(categoryValue).reduce<
      Array<string>
    >((values, [subCategoryCode, subCategoryValue]) => {
      const selectedSubCategories = subCategoryValue?.subCategory ?? []

      if (!selectedSubCategories.includes(subCategoryCode)) {
        return values
      }

      const subCategory = (category.subCategories ?? []).find(
        (item) => item.code === subCategoryCode,
      )

      const subCategoryLabel = subCategory?.label ?? subCategoryCode
      const selectedSubSubCategories = subCategoryValue?.subSubCategories ?? []

      const selectedSubSubCategoryLabels = selectedSubSubCategories.map(
        (subSubCategoryCode) =>
          (subCategory?.subCategories ?? []).find(
            (subSubCategory) => subSubCategory.code === subSubCategoryCode,
          )?.label ?? subSubCategoryCode,
      )

      // Nested selections are rendered as "SubCategory: SubSub1, SubSub2".
      // If there are no nested selections, render only the sub-category label.
      values.push(
        selectedSubSubCategoryLabels.length > 0
          ? `${subCategoryLabel}: ${selectedSubSubCategoryLabels.join(', ')}`
          : subCategoryLabel,
      )

      return values
    }, [])

    if (selectedSubCategoryValues.length === 0) {
      return items
    }

    // Keep valueText as string[] so the overview component can render each entry
    // on a separate line/bullet instead of a single concatenated string.
    items.push({
      width: 'full',
      keyText: category.label,
      valueText: selectedSubCategoryValues,
    })

    return items
  }, [])

  // Add the single "biggest concern" choice as a separate row.
  if (biggestConcernCategoryCode) {
    const biggestConcernCategory = categoriesByCode.get(
      biggestConcernCategoryCode,
    )

    reasonItems.push({
      width: 'full',
      keyText: reasonForNotificationMessages.reason.biggestConcern,
      valueText: biggestConcernCategory?.label ?? biggestConcernCategoryCode,
    })
  }

  // Add selected unborn-risk labels when that section is answered.
  if (riskToUnbornSelections.length > 0) {
    const unbornCategory = categoriesByCode.get(RISK_TO_UNBORN)
    const unbornSelectionLabels = riskToUnbornSelections.map(
      (selectionCode) =>
        (unbornCategory?.subCategories ?? []).find(
          (subCategory) => subCategory.code === selectionCode,
        )?.label ?? selectionCode,
    )

    reasonItems.push({
      width: 'full',
      keyText: reasonForNotificationMessages.reason.unbornQuestion,
      valueText: unbornSelectionLabels,
    })
  }

  return reasonItems
}

export const getReasonNotificationHistoryItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const {
    hasReportedBefore,
    hasDiscussedWithParents,
    areParentsInformed,
    notificationHistoryBiggestConcern,
  } = getApplicationAnswers(answers)

  return [
    {
      width: 'full',
      keyText:
        reasonForNotificationMessages.notificationHistory.hasReportedBefore,
      valueText:
        hasReportedBefore === YES
          ? sharedMessages.radioYes
          : sharedMessages.radioNo,
    },
    {
      width: 'full',
      keyText: getHasDiscussedWithParentsTitle(answers),
      valueText:
        hasDiscussedWithParents === YES
          ? sharedMessages.radioYes
          : sharedMessages.radioNo,
    },
    {
      width: 'full',
      keyText: getAreParentsInformedTitle(answers),
      valueText:
        areParentsInformed === YES
          ? sharedMessages.radioYes
          : sharedMessages.radioNo,
    },
    ...(areParentsInformed === NO
      ? [
          {
            width: 'full' as const,
            keyText: reasonForNotificationMessages.description.subSectionTitle,
            valueText: notificationHistoryBiggestConcern ?? '',
          },
        ]
      : []),
  ]
}

export const getProtectiveFactorsItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const { protectiveFactors } = getApplicationAnswers(answers)
  const { protectiveFactorSections: sections } =
    getApplicationExternalData(externalData)

  const items: Array<KeyValueItem> = []

  for (const section of sections) {
    const sectionAnswers = protectiveFactors?.[section.code ?? '']
    const valueLines: string[] = []

    section.subCategories?.forEach((subCategory, subIndex) => {
      if (!sectionAnswers?.[`sub${subIndex}`]?.includes(YES)) return

      const selectedItemDescriptions = (
        sectionAnswers[`sub${subIndex}Items`] ?? []
      ).map(
        (code) =>
          subCategory.items?.find((i) => i.code === code)?.description ?? code,
      )

      const line =
        selectedItemDescriptions.length > 0
          ? `${subCategory.name}: ${selectedItemDescriptions.join(', ')}`
          : subCategory.name ?? ''

      valueLines.push(line)
    })

    if (sectionAnswers?.['dontKnow']?.length) {
      valueLines.push(section.dontKnowDescription ?? '')
    }

    if (valueLines.length > 0) {
      items.push({
        width: 'full',
        keyText: section.name ?? '',
        valueText: valueLines,
      })
    }
  }

  return items
}
