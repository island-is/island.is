import { ApolloClient } from '@apollo/client'
import { YES } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  KeyValueItem,
  TableData,
} from '@island.is/application/types'
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import { Locale } from '@island.is/shared/types'
import { getLanguageByCode } from '@island.is/shared/utils'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import parseISO from 'date-fns/parseISO'
import { format as formatKennitala } from 'kennitala'
import { formatNumber } from 'libphonenumber-js'
import {
  friggOptionsQuery,
  friggOrganizationsByTypeQuery,
} from '../graphql/queries'
import { newPrimarySchoolMessages } from '../lib/messages'
import { EducationFriggOptionsListInput, Query } from '@island.is/api/schema'
import {
  ApplicationType,
  LanguageEnvironmentOptions,
  OptionsType,
  ReasonForApplicationOptions,
  SchoolType,
} from './constants'
import {
  formatGrade,
  getApplicationAnswers,
  getApplicationExternalData,
  getCurrentSchoolName,
  getGenderMessage,
  getNeighbourhoodSchoolName,
  getSelectedOptionLabel,
} from './newPrimarySchoolUtils'

const getFriggOptions = async (
  apolloClient: ApolloClient<object>,
  friggOptionsType: OptionsType,
  locale: Locale,
) => {
  const { data } = await apolloClient.query<
    Query,
    { type: EducationFriggOptionsListInput }
  >({
    query: friggOptionsQuery,
    variables: {
      type: {
        type: friggOptionsType,
      },
    },
  })

  const options =
    data?.friggOptions?.flatMap(({ options }) =>
      options.flatMap(({ value, id }) => {
        const content = value.find(
          ({ language }) => language === locale,
        )?.content

        if (!content) return []

        return { value: id, label: content }
      }),
    ) ?? []

  return options
}

export const childItems = async (
  answers: FormValue,
  externalData: ExternalData,
  _userNationalId: string,
  apolloClient: ApolloClient<object>,
  locale: Locale,
): Promise<KeyValueItem[]> => {
  const { childInfo } = getApplicationAnswers(answers)

  const pronounOptions = await getFriggOptions(
    apolloClient,
    OptionsType.PRONOUN,
    locale,
  )

  const genderMessage = getGenderMessage(answers, externalData)

  const baseItems: Array<KeyValueItem> = [
    {
      width: 'half',
      keyText: newPrimarySchoolMessages.shared.fullName,
      valueText: childInfo?.name,
    },
    {
      width: 'half',
      keyText: newPrimarySchoolMessages.shared.nationalId,
      valueText: formatKennitala(childInfo?.nationalId ?? ''),
    },
    {
      width: 'half',
      keyText: newPrimarySchoolMessages.shared.address,
      valueText: childInfo?.address?.streetAddress,
    },
    {
      width: 'half',
      keyText: newPrimarySchoolMessages.shared.municipality,
      valueText: `${childInfo?.address?.postalCode}, ${childInfo?.address?.city}`,
    },

    {
      width: 'half',
      keyText: newPrimarySchoolMessages.shared.gender,
      valueText: genderMessage,
    },
  ]

  const preferredNameItems: Array<KeyValueItem> =
    childInfo?.usePronounAndPreferredName?.includes(YES) &&
    childInfo?.preferredName?.trim().length > 0
      ? [
          {
            width: 'half',
            keyText:
              newPrimarySchoolMessages.childrenNGuardians
                .childInfoPreferredName,
            valueText: childInfo?.preferredName,
          },
        ]
      : []

  const pronounsItems: Array<KeyValueItem> =
    childInfo?.usePronounAndPreferredName?.includes(YES) &&
    childInfo?.pronouns?.length > 0
      ? [
          {
            width: 'half',
            keyText:
              newPrimarySchoolMessages.childrenNGuardians.childInfoPronouns,
            valueText: childInfo?.pronouns
              .map((pronoun) => getSelectedOptionLabel(pronounOptions, pronoun))
              .join(', '),
          },
        ]
      : []

  const differentPlaceOfResidenceItems: Array<KeyValueItem> =
    childInfo?.differentPlaceOfResidence === YES
      ? [
          {
            width: 'half',
            keyText:
              newPrimarySchoolMessages.childrenNGuardians
                .childInfoPlaceOfResidence,
            valueText: `${childInfo?.placeOfResidence?.streetAddress}, ${childInfo.placeOfResidence?.postalCode}`,
          },
        ]
      : []

  return [
    ...baseItems,
    ...preferredNameItems,
    ...pronounsItems,
    ...differentPlaceOfResidenceItems,
  ]
}

export const guardiansItems = (
  answers: FormValue,
  _externalData: ExternalData,
  _userNationalId: string,
  index: number,
): Array<KeyValueItem> => {
  const { guardians } = getApplicationAnswers(answers)

  const baseItems: Array<KeyValueItem> = [
    {
      width: 'half',
      keyText: newPrimarySchoolMessages.shared.fullName,
      valueText: guardians[index].fullName,
    },
    {
      width: 'half',
      keyText: newPrimarySchoolMessages.shared.nationalId,
      valueText: formatKennitala(guardians[index].nationalId ?? ''),
    },
    {
      width: 'half',
      keyText: newPrimarySchoolMessages.shared.address,
      valueText: guardians[index].address.streetAddress,
    },
    {
      width: 'half',
      keyText: newPrimarySchoolMessages.shared.municipality,
      valueText: `${guardians[index].address.postalCode}, ${guardians[index].address.city}`,
    },
    {
      width: 'half',
      keyText: newPrimarySchoolMessages.shared.email,
      valueText: guardians[index].email,
    },
    {
      width: 'half',
      keyText: newPrimarySchoolMessages.shared.phoneNumber,
      valueText: formatNumber(guardians[index].phoneNumber, 'International'),
    },
    {
      width: 'half',
      keyText: newPrimarySchoolMessages.childrenNGuardians.requiresInterpreter,
      valueText: guardians[index].requiresInterpreter.includes(YES)
        ? newPrimarySchoolMessages.shared.yes
        : newPrimarySchoolMessages.shared.no,
    },
  ]

  const requiresInterpreterItems: Array<KeyValueItem> = guardians[
    index
  ].requiresInterpreter.includes(YES)
    ? [
        {
          width: 'half',
          keyText: newPrimarySchoolMessages.shared.language,
          valueText: getLanguageByCode(guardians[index].preferredLanguage ?? '')
            ?.name,
        },
      ]
    : []

  return [...baseItems, ...requiresInterpreterItems]
}

export const relativesTable = async (
  answers: FormValue,
  _externalData: ExternalData,
  apolloClient: ApolloClient<object>,
  locale: Locale,
): Promise<TableData> => {
  const { relatives } = getApplicationAnswers(answers)

  const relationFriggOptions = await getFriggOptions(
    apolloClient,
    OptionsType.RELATION,
    locale,
  )

  return {
    header: [
      newPrimarySchoolMessages.shared.fullName,
      newPrimarySchoolMessages.shared.phoneNumber,
      newPrimarySchoolMessages.shared.nationalId,
      newPrimarySchoolMessages.shared.relation,
    ],
    rows: relatives.map((r) => [
      r.fullName,
      formatPhoneNumber(removeCountryCode(r.phoneNumber ?? '')),
      formatKennitala(r.nationalId),
      getSelectedOptionLabel(relationFriggOptions, r.relation) ?? '',
    ]),
  }
}

export const currentSchoolItems = async (
  answers: FormValue,
  externalData: ExternalData,
  _userNationalId: string,
  apolloClient: ApolloClient<object>,
  locale: Locale,
): Promise<KeyValueItem[]> => {
  const { currentSchoolId } = getApplicationAnswers(answers)
  const { childGradeLevel, primaryOrgId } =
    getApplicationExternalData(externalData)

  const { data } = await apolloClient.query<Query>({
    query: friggOrganizationsByTypeQuery,
  })
  const selectedSchoolName = data?.friggOrganizationsByType
    ?.flatMap((m) => m.managing ?? [])
    .find((school) => school?.id === currentSchoolId)?.name

  const baseItems: Array<KeyValueItem> = [
    {
      width: 'half',
      keyText: newPrimarySchoolMessages.primarySchool.currentSchool,
      valueText: getCurrentSchoolName(externalData) || selectedSchoolName,
    },
  ]

  const gradeItems: Array<KeyValueItem> = primaryOrgId
    ? [
        {
          width: 'half',
          keyText: newPrimarySchoolMessages.primarySchool.grade,
          valueText: {
            ...newPrimarySchoolMessages.primarySchool.currentGrade,
            values: {
              grade: formatGrade(childGradeLevel ?? '', locale),
            },
          },
        },
      ]
    : []

  return [...baseItems, ...gradeItems]
}

export const currentNurseryItems = async (
  answers: FormValue,
  _externalData: ExternalData,
  _userNationalId: string,
  apolloClient: ApolloClient<object>,
): Promise<KeyValueItem[]> => {
  const { currentNursery } = getApplicationAnswers(answers)

  const { data } = await apolloClient.query<Query>({
    query: friggOrganizationsByTypeQuery,
  })
  const currentNurseryName = data?.friggOrganizationsByType
    ?.flatMap((municipality) => municipality.managing)
    .find((nursery) => nursery?.id === currentNursery)?.name

  return [
    {
      width: 'half',
      keyText: newPrimarySchoolMessages.overview.currentNursery,
      valueText: currentNurseryName,
    },
  ]
}

export const schoolItems = async (
  answers: FormValue,
  externalData: ExternalData,
  _userNationalId: string,
  apolloClient: ApolloClient<object>,
): Promise<KeyValueItem[]> => {
  const {
    applicationType,
    expectedStartDate,
    selectedSchool,
    applyForNeighbourhoodSchool,
    selectedSchoolType,
    temporaryStay,
    expectedEndDate,
  } = getApplicationAnswers(answers)

  const { data } = await apolloClient.query<Query>({
    query: friggOrganizationsByTypeQuery,
  })
  const selectedSchoolName = data?.friggOrganizationsByType
    ?.flatMap((municipality) => municipality.managing)
    .find((school) => school?.id === selectedSchool)?.name

  const baseItems: Array<KeyValueItem> = [
    {
      width: 'half',
      keyText:
        applyForNeighbourhoodSchool === YES
          ? newPrimarySchoolMessages.overview.neighbourhoodSchool
          : newPrimarySchoolMessages.overview.selectedSchool,
      valueText:
        applyForNeighbourhoodSchool === YES
          ? getNeighbourhoodSchoolName(externalData)
          : selectedSchoolName,
    },
  ]

  const expectedStartDateItems: Array<KeyValueItem> =
    applicationType === ApplicationType.NEW_PRIMARY_SCHOOL
      ? [
          {
            width: 'half',
            keyText: newPrimarySchoolMessages.shared.date,
            valueText: format(parseISO(expectedStartDate ?? ''), 'dd.MM.yyyy', {
              locale: is,
            }),
          },
        ]
      : []

  const expectedEndDateItems: Array<KeyValueItem> =
    applicationType === ApplicationType.NEW_PRIMARY_SCHOOL &&
    selectedSchoolType === SchoolType.INTERNATIONAL_SCHOOL &&
    temporaryStay === YES
      ? [
          {
            width: 'half',
            keyText: newPrimarySchoolMessages.overview.expectedEndDate,
            valueText: format(parseISO(expectedEndDate ?? ''), 'dd.MM.yyyy', {
              locale: is,
            }),
          },
        ]
      : []

  return [...baseItems, ...expectedStartDateItems, ...expectedEndDateItems]
}

export const reasonForApplicationItems = async (
  answers: FormValue,
  _externalData: ExternalData,
  _userNationalId: string,
  apolloClient: ApolloClient<object>,
  locale: Locale,
): Promise<KeyValueItem[]> => {
  const {
    reasonForApplication,
    reasonForApplicationId,
    reasonForApplicationStreetAddress,
    reasonForApplicationPostalCode,
    selectedSchoolType,
  } = getApplicationAnswers(answers)

  const friggOptionsType =
    selectedSchoolType === SchoolType.PRIVATE_SCHOOL
      ? OptionsType.REASON_PRIVATE_SCHOOL
      : selectedSchoolType === SchoolType.INTERNATIONAL_SCHOOL
      ? OptionsType.REASON_INTERNATIONAL_SCHOOL
      : OptionsType.REASON

  const reasonFriggOptions = await getFriggOptions(
    apolloClient,
    friggOptionsType,
    locale,
  )

  const baseItems: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText:
        newPrimarySchoolMessages.primarySchool
          .reasonForApplicationSubSectionTitle,
      valueText:
        getSelectedOptionLabel(reasonFriggOptions, reasonForApplicationId) ||
        '',
    },
  ]

  const movingMunicipalityItems: Array<KeyValueItem> =
    reasonForApplication === ReasonForApplicationOptions.MOVING_MUNICIPALITY
      ? [
          {
            width: 'half',
            keyText: newPrimarySchoolMessages.shared.address,
            valueText: reasonForApplicationStreetAddress,
          },
          {
            width: 'half',
            keyText: newPrimarySchoolMessages.shared.postalCode,
            valueText: reasonForApplicationPostalCode,
          },
        ]
      : []

  return [...baseItems, ...movingMunicipalityItems]
}

export const siblingsTable = (answers: FormValue): TableData => {
  const { siblings } = getApplicationAnswers(answers)

  return {
    header: [
      newPrimarySchoolMessages.shared.fullName,
      newPrimarySchoolMessages.shared.nationalId,
    ],
    rows: siblings.map((s) => [s.fullName, formatKennitala(s.nationalId)]),
  }
}

export const languagesItems = async (
  answers: FormValue,
  _externalData: ExternalData,
  _userNationalId: string,
  apolloClient: ApolloClient<object>,
  locale: Locale,
): Promise<KeyValueItem[]> => {
  const {
    languageEnvironment,
    languageEnvironmentId,
    selectedLanguages,
    preferredLanguage,
    signLanguage,
  } = getApplicationAnswers(answers)

  const languageEnvironmentOptions = await getFriggOptions(
    apolloClient,
    OptionsType.LANGUAGE_ENVIRONMENT,
    locale,
  )

  const baseItems: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText: newPrimarySchoolMessages.overview.languageEnvironment,
      valueText:
        getSelectedOptionLabel(
          languageEnvironmentOptions,
          languageEnvironmentId,
        ) || '',
    },
  ]

  const selectedLanguagesItems: Array<KeyValueItem> =
    languageEnvironment !== LanguageEnvironmentOptions.ONLY_ICELANDIC
      ? selectedLanguages?.map(({ code }, index) => ({
          width: 'half',
          keyText: {
            ...newPrimarySchoolMessages.differentNeeds.languageSelectionTitle,
            values: { index: `${index + 1}` },
          },
          valueText: getLanguageByCode(code)?.name,
          hideIfEmpty: true,
        }))
      : []

  const preferredLanguageItems: Array<KeyValueItem> =
    languageEnvironment !== LanguageEnvironmentOptions.ONLY_ICELANDIC &&
    preferredLanguage
      ? [
          {
            width: 'full',
            keyText: newPrimarySchoolMessages.overview.preferredLanguage,
            valueText: getLanguageByCode(preferredLanguage)?.name,
          },
        ]
      : []

  const baseItems2: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText: newPrimarySchoolMessages.differentNeeds.signLanguage,
      valueText:
        signLanguage === YES
          ? newPrimarySchoolMessages.shared.yes
          : newPrimarySchoolMessages.shared.no,
    },
  ]

  return [
    ...baseItems,
    ...selectedLanguagesItems,
    ...preferredLanguageItems,
    ...baseItems2,
  ]
}

export const healthProtectionItems = async (
  answers: FormValue,
  _externalData: ExternalData,
  _userNationalId: string,
  apolloClient: ApolloClient<object>,
  locale: Locale,
): Promise<KeyValueItem[]> => {
  const {
    hasFoodAllergiesOrIntolerances,
    foodAllergiesOrIntolerances,
    hasOtherAllergies,
    otherAllergies,
    usesEpiPen,
    hasConfirmedMedicalDiagnoses,
    requestsMedicationAdministration,
  } = getApplicationAnswers(answers)

  const foodAllergiesOrIntolerancesOptions = await getFriggOptions(
    apolloClient,
    OptionsType.FOOD_ALLERGY_AND_INTOLERANCE,
    locale,
  )

  const otherAllergiesOptions = await getFriggOptions(
    apolloClient,
    OptionsType.ALLERGY,
    locale,
  )

  const foodAllergiesOrIntolerancesItems: Array<KeyValueItem> =
    hasFoodAllergiesOrIntolerances.includes(YES)
      ? [
          {
            width: 'full',
            keyText:
              newPrimarySchoolMessages.overview.foodAllergiesOrIntolerances,
            valueText: foodAllergiesOrIntolerances
              .map((foodAllergyOrIntolerance) =>
                getSelectedOptionLabel(
                  foodAllergiesOrIntolerancesOptions,
                  foodAllergyOrIntolerance,
                ),
              )
              .join(', '),
          },
        ]
      : []

  const otherAllergiesItems: Array<KeyValueItem> = hasOtherAllergies.includes(
    YES,
  )
    ? [
        {
          width: 'full',
          keyText: newPrimarySchoolMessages.overview.otherAllergies,
          valueText: otherAllergies
            .map((otherAllergy) =>
              getSelectedOptionLabel(otherAllergiesOptions, otherAllergy),
            )
            .join(', '),
        },
      ]
    : []

  const usesEpiPenItems: Array<KeyValueItem> =
    hasFoodAllergiesOrIntolerances.includes(YES) ||
    hasOtherAllergies.includes(YES)
      ? [
          {
            width: 'full',
            keyText: newPrimarySchoolMessages.overview.usesEpiPen,
            valueText:
              usesEpiPen === YES
                ? newPrimarySchoolMessages.shared.yes
                : newPrimarySchoolMessages.shared.no,
          },
        ]
      : []

  const baseItems: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText:
        newPrimarySchoolMessages.differentNeeds.hasConfirmedMedicalDiagnoses,
      valueText:
        hasConfirmedMedicalDiagnoses === YES
          ? newPrimarySchoolMessages.shared.yes
          : newPrimarySchoolMessages.shared.no,
    },
    {
      width: 'full',
      keyText:
        newPrimarySchoolMessages.differentNeeds
          .requestsMedicationAdministration,
      valueText:
        requestsMedicationAdministration === YES
          ? newPrimarySchoolMessages.shared.yes
          : newPrimarySchoolMessages.shared.no,
    },
  ]

  return [
    ...foodAllergiesOrIntolerancesItems,
    ...otherAllergiesItems,
    ...usesEpiPenItems,
    ...baseItems,
  ]
}

export const supportItems = (answers: FormValue): Array<KeyValueItem> => {
  const {
    applicationType,
    hasDiagnoses,
    hasHadSupport,
    hasWelfareContact,
    welfareContactName,
    welfareContactEmail,
    hasIntegratedServices,
    hasCaseManager,
    caseManagerName,
    caseManagerEmail,
    requestingMeeting,
  } = getApplicationAnswers(answers)

  const baseItems: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText:
        applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
          ? newPrimarySchoolMessages.differentNeeds.enrollmentHasDiagnoses
          : newPrimarySchoolMessages.differentNeeds.hasDiagnoses,
      valueText:
        hasDiagnoses === YES
          ? newPrimarySchoolMessages.shared.yes
          : newPrimarySchoolMessages.shared.no,
    },
    {
      width: 'full',
      keyText:
        applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
          ? newPrimarySchoolMessages.differentNeeds.enrollmentHasHadSupport
          : newPrimarySchoolMessages.differentNeeds.hasHadSupport,
      valueText:
        hasHadSupport === YES
          ? newPrimarySchoolMessages.shared.yes
          : newPrimarySchoolMessages.shared.no,
    },
  ]

  const hasWelfareContactItems: Array<KeyValueItem> =
    hasDiagnoses === YES || hasHadSupport === YES
      ? [
          {
            width: 'full',
            keyText: newPrimarySchoolMessages.differentNeeds.hasWelfareContact,
            valueText:
              hasWelfareContact === YES
                ? newPrimarySchoolMessages.shared.yes
                : newPrimarySchoolMessages.shared.no,
          },
        ]
      : []

  const welfareContactItems: Array<KeyValueItem> =
    (hasDiagnoses === YES || hasHadSupport === YES) && hasWelfareContact === YES
      ? [
          {
            width: 'half',
            keyText: newPrimarySchoolMessages.differentNeeds.welfareContactName,
            valueText: welfareContactName,
          },
          {
            width: 'half',
            keyText:
              newPrimarySchoolMessages.differentNeeds.welfareContactEmail,
            valueText: welfareContactEmail,
          },
          {
            width: 'full',
            keyText: newPrimarySchoolMessages.differentNeeds.hasCaseManager,
            valueText:
              hasCaseManager === YES
                ? newPrimarySchoolMessages.shared.yes
                : newPrimarySchoolMessages.shared.no,
          },
        ]
      : []

  const caseManagerItems: Array<KeyValueItem> =
    (hasDiagnoses === YES || hasHadSupport === YES) &&
    hasWelfareContact === YES &&
    hasCaseManager === YES
      ? [
          {
            width: 'half',
            keyText: newPrimarySchoolMessages.differentNeeds.caseManagerName,
            valueText: caseManagerName,
          },
          {
            width: 'half',
            keyText: newPrimarySchoolMessages.differentNeeds.caseManagerEmail,
            valueText: caseManagerEmail,
          },
        ]
      : []

  const welfareContactItems2: Array<KeyValueItem> =
    (hasDiagnoses === YES || hasHadSupport === YES) && hasWelfareContact === YES
      ? [
          {
            width: 'full',
            keyText:
              newPrimarySchoolMessages.differentNeeds.hasIntegratedServices,
            valueText:
              hasIntegratedServices === YES
                ? newPrimarySchoolMessages.shared.yes
                : newPrimarySchoolMessages.shared.no,
          },
        ]
      : []

  const baseItems2: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText:
        newPrimarySchoolMessages.differentNeeds.requestingMeetingDescription,
      valueText:
        requestingMeeting === YES
          ? newPrimarySchoolMessages.shared.yes
          : newPrimarySchoolMessages.shared.no,
    },
  ]

  return [
    ...baseItems,
    ...hasWelfareContactItems,
    ...welfareContactItems,
    ...caseManagerItems,
    ...welfareContactItems2,
    ...baseItems2,
  ]
}
