import { ApolloClient } from '@apollo/client'
import {
  EducationFriggOptionsListInput,
  OrganizationTypeEnum,
  Query,
} from '@island.is/api/schema'
import { NO, YES } from '@island.is/application/core'
import {
  AttachmentItem,
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
import {
  hasBehaviorSchoolOrDepartmentSubType,
  hasSpecialEducationCaseManager,
  hasSpecialEducationWelfareContact,
  shouldShowAlternativeSpecialEducationDepartment,
  shouldShowChildAndAdolescentPsychiatryDepartment,
  shouldShowChildAndAdolescentPsychiatryServicesReceived,
  shouldShowDiagnosticians,
  shouldShowExpectedEndDate,
  shouldShowServicesFromMunicipality,
  shouldShowSpecialists,
  shouldShowSupportNeedsAssessmentBy,
} from './conditionUtils'
import {
  ApplicationType,
  LanguageEnvironmentOptions,
  OptionsType,
  PayerOption,
} from './constants'
import {
  formatGrade,
  getApplicationAnswers,
  getApplicationExternalData,
  getCurrentSchoolName,
  getGenderMessage,
  getPreferredSchoolName,
  getReasonOptionsType,
  getSchoolName,
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

  return [...baseItems, ...preferredNameItems, ...pronounsItems]
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
      newPrimarySchoolMessages.shared.nationalId,
      newPrimarySchoolMessages.shared.phoneNumber,
      newPrimarySchoolMessages.shared.relation,
    ],
    rows: relatives.map((r) => [
      r.nationalIdWithName.name,
      formatKennitala(r.nationalIdWithName.nationalId),
      formatPhoneNumber(removeCountryCode(r.phoneNumber ?? '')),
      getSelectedOptionLabel(relationFriggOptions, r.relation) ?? '',
    ]),
  }
}

export const currentSchoolItems = (
  answers: FormValue,
  externalData: ExternalData,
  _userNationalId: string,
  locale: Locale,
): KeyValueItem[] => {
  const { currentSchoolId } = getApplicationAnswers(answers)
  const { childGradeLevel, primaryOrgId } =
    getApplicationExternalData(externalData)

  const baseItems: Array<KeyValueItem> = [
    {
      width: 'half',
      keyText: newPrimarySchoolMessages.primarySchool.currentSchool,
      valueText:
        getCurrentSchoolName(externalData) ||
        getSchoolName(externalData, currentSchoolId ?? ''),
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
    variables: {
      input: {
        type: OrganizationTypeEnum.ChildCare,
      },
    },
  })
  const currentNurseryName = data?.friggOrganizationsByType?.find(
    (nursery) => nursery?.id === currentNursery,
  )?.name

  return [
    {
      width: 'full',
      keyText: newPrimarySchoolMessages.overview.currentNursery,
      valueText: currentNurseryName,
    },
  ]
}

export const schoolItems = (
  answers: FormValue,
  externalData: ExternalData,
): KeyValueItem[] => {
  const {
    applicationType,
    expectedStartDate,
    selectedSchoolId,
    applyForPreferredSchool,
    temporaryStay,
    expectedEndDate,
    alternativeSpecialEducationDepartment,
  } = getApplicationAnswers(answers)

  const baseItems: Array<KeyValueItem> = [
    {
      width: 'half',
      keyText:
        applyForPreferredSchool === YES
          ? newPrimarySchoolMessages.overview.neighbourhoodSchool
          : newPrimarySchoolMessages.overview.selectedSchool,
      valueText:
        applyForPreferredSchool === YES
          ? getPreferredSchoolName(externalData)
          : getSchoolName(externalData, selectedSchoolId ?? ''),
    },
  ]

  const expectedStartDateItems: Array<KeyValueItem> =
    applicationType === ApplicationType.NEW_PRIMARY_SCHOOL
      ? [
          {
            width: 'half',
            keyText: newPrimarySchoolMessages.overview.expectedStartDate,
            valueText: format(parseISO(expectedStartDate ?? ''), 'dd.MM.yyyy', {
              locale: is,
            }),
          },
        ]
      : []

  const expectedEndDateItems: Array<KeyValueItem> =
    applicationType === ApplicationType.NEW_PRIMARY_SCHOOL &&
    shouldShowExpectedEndDate(answers, externalData) &&
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

  const alternativeSpecialEducationDepartmentItems: Array<KeyValueItem> =
    shouldShowAlternativeSpecialEducationDepartment(answers, externalData)
      ? alternativeSpecialEducationDepartment.map(({ department }, index) => ({
          width: 'half',
          keyText: {
            ...newPrimarySchoolMessages.primarySchool
              .alternativeSpecialEducationDepartment,
            values: { index: index + 2 },
          },
          valueText: getSchoolName(externalData, department ?? ''),
          hideIfEmpty: true,
        }))
      : []

  return [
    ...baseItems,
    ...expectedStartDateItems,
    ...expectedEndDateItems,
    ...alternativeSpecialEducationDepartmentItems,
  ]
}

export const reasonForApplicationItems = async (
  answers: FormValue,
  externalData: ExternalData,
  _userNationalId: string,
  apolloClient: ApolloClient<object>,
  locale: Locale,
): Promise<KeyValueItem[]> => {
  const { reasonForApplicationId } = getApplicationAnswers(answers)

  const reasonFriggOptions = await getFriggOptions(
    apolloClient,
    getReasonOptionsType(answers, externalData),
    locale,
  )

  return [
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
}

export const counsellingRegardingApplicationItems = async (
  answers: FormValue,
  externalData: ExternalData,
  _userNationalId: string,
  apolloClient: ApolloClient<object>,
  locale: Locale,
): Promise<KeyValueItem[]> => {
  const { counsellingRegardingApplication, hasVisitedSchool } =
    getApplicationAnswers(answers)

  const reasonFriggOptions = await getFriggOptions(
    apolloClient,
    OptionsType.REASON_SPECIAL_EDUCATION,
    locale,
  )

  return [
    {
      width: 'full',
      keyText:
        newPrimarySchoolMessages.primarySchool
          .counsellingRegardingApplicationSubSectionTitle,
      valueText:
        getSelectedOptionLabel(
          reasonFriggOptions,
          counsellingRegardingApplication,
        ) || '',
    },
    {
      width: 'full',
      keyText:
        newPrimarySchoolMessages.primarySchool
          .counsellingRegardingApplicationHasVisitedSchool,
      valueText:
        hasVisitedSchool === YES
          ? newPrimarySchoolMessages.shared.yes
          : newPrimarySchoolMessages.shared.no,
    },
  ]
}

export const siblingsTable = (answers: FormValue): TableData => {
  const { siblings } = getApplicationAnswers(answers)

  return {
    header: [
      newPrimarySchoolMessages.shared.fullName,
      newPrimarySchoolMessages.shared.nationalId,
    ],
    rows: siblings.map((s) => [
      s.nationalIdWithName.name,
      formatKennitala(s.nationalIdWithName.nationalId),
    ]),
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

export const attachmentItems = (answers: FormValue): Array<AttachmentItem> => {
  const { attachmentsFiles } = getApplicationAnswers(answers)

  return attachmentsFiles.map((file) => {
    const fullName = file.name || ''
    const nameArray = fullName.split('.')
    const fileType = nameArray.pop()?.toUpperCase()
    const fileName = nameArray.join('.')

    return {
      width: 'full',
      fileName: fileName,
      fileType: fileType || undefined,
    }
  })
}

export const specialEducationSupportItems = async (
  answers: FormValue,
  externalData: ExternalData,
  _userNationalId: string,
  apolloClient: ApolloClient<object>,
  locale: Locale,
): Promise<KeyValueItem[]> => {
  const {
    specialEducationHasWelfareContact,
    specialEducationWelfareContactName,
    specialEducationWelfareContactEmail,
    specialEducationHasCaseManager,
    specialEducationCaseManagerName,
    specialEducationCaseManagerEmail,
    specialEducationHasIntegratedServices,
    hasAssessmentOfSupportNeeds,
    isAssessmentOfSupportNeedsInProgress,
    supportNeedsAssessmentBy,
    hasConfirmedDiagnosis,
    isDiagnosisInProgress,
    diagnosticians,
    hasOtherSpecialists,
    specialists,
    hasReceivedServicesFromMunicipality,
    servicesFromMunicipality,
    hasReceivedChildAndAdolescentPsychiatryServices,
    isOnWaitlistForServices,
    childAndAdolescentPsychiatryDepartment,
    childAndAdolescentPsychiatryServicesReceived,
    hasBeenReportedToChildProtectiveServices,
    isCaseOpenWithChildProtectiveServices,
  } = getApplicationAnswers(answers)

  const assessorOptions = await getFriggOptions(
    apolloClient,
    OptionsType.ASSESSOR,
    locale,
  )

  const diagnosisSpecialistOptions = await getFriggOptions(
    apolloClient,
    OptionsType.DIAGNOSIS_SPECIALIST,
    locale,
  )

  const professionalOptions = await getFriggOptions(
    apolloClient,
    OptionsType.PROFESSIONAL,
    locale,
  )

  const serviceCenterOptions = await getFriggOptions(
    apolloClient,
    OptionsType.SERVICE_CENTER,
    locale,
  )

  const childAndAdolescentMentalHealthDepartmentOptions = await getFriggOptions(
    apolloClient,
    OptionsType.CHILD_AND_ADOLESCENT_MENTAL_HEALTH_DEPARTMENT,
    locale,
  )

  const childAndAdolescentMentalHealthServiceOptions = await getFriggOptions(
    apolloClient,
    OptionsType.CHILD_AND_ADOLESCENT_MENTAL_HEALTH_SERVICE,
    locale,
  )

  const baseItems: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText:
        newPrimarySchoolMessages.differentNeeds
          .specialEducationHasWelfareContact,
      valueText:
        specialEducationHasWelfareContact === YES
          ? newPrimarySchoolMessages.shared.yes
          : newPrimarySchoolMessages.shared.no,
    },
  ]

  const welfareContactItems: Array<KeyValueItem> =
    hasSpecialEducationWelfareContact(answers)
      ? [
          {
            width: 'half',
            keyText: newPrimarySchoolMessages.differentNeeds.welfareContactName,
            valueText: specialEducationWelfareContactName,
          },
          {
            width: 'half',
            keyText:
              newPrimarySchoolMessages.differentNeeds.welfareContactEmail,
            valueText: specialEducationWelfareContactEmail,
          },
        ]
      : []

  const baseItems2: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText:
        newPrimarySchoolMessages.differentNeeds.specialEducationHasCaseManager,
      valueText:
        specialEducationHasCaseManager === YES
          ? newPrimarySchoolMessages.shared.yes
          : newPrimarySchoolMessages.shared.no,
    },
  ]

  const caseManagerItems: Array<KeyValueItem> = hasSpecialEducationCaseManager(
    answers,
  )
    ? [
        {
          width: 'half',
          keyText: newPrimarySchoolMessages.differentNeeds.caseManagerName,
          valueText: specialEducationCaseManagerName,
        },
        {
          width: 'half',
          keyText: newPrimarySchoolMessages.differentNeeds.caseManagerEmail,
          valueText: specialEducationCaseManagerEmail,
        },
      ]
    : []

  const baseItems3: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText:
        newPrimarySchoolMessages.differentNeeds
          .specialEducationHasIntegratedServices,
      valueText:
        specialEducationHasIntegratedServices === YES
          ? newPrimarySchoolMessages.shared.yes
          : newPrimarySchoolMessages.shared.no,
    },
    {
      width: 'full',
      keyText:
        newPrimarySchoolMessages.differentNeeds.hasAssessmentOfSupportNeeds,
      valueText:
        hasAssessmentOfSupportNeeds === YES
          ? newPrimarySchoolMessages.shared.yes
          : newPrimarySchoolMessages.shared.no,
    },
  ]

  const isAssessmentOfSupportNeedsInProgressItems: Array<KeyValueItem> =
    hasAssessmentOfSupportNeeds === NO
      ? [
          {
            width: 'full',
            keyText:
              newPrimarySchoolMessages.differentNeeds
                .isAssessmentOfSupportNeedsInProgress,
            valueText:
              isAssessmentOfSupportNeedsInProgress === YES
                ? newPrimarySchoolMessages.shared.yes
                : newPrimarySchoolMessages.shared.no,
          },
        ]
      : []

  const supportNeedsAssessmentByItems: Array<KeyValueItem> =
    shouldShowSupportNeedsAssessmentBy(answers)
      ? [
          {
            width: 'full',
            keyText:
              newPrimarySchoolMessages.differentNeeds.supportNeedsAssessmentBy,
            valueText: getSelectedOptionLabel(
              assessorOptions,
              supportNeedsAssessmentBy,
            ),
          },
        ]
      : []

  const baseItems4: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText: newPrimarySchoolMessages.differentNeeds.hasConfirmedDiagnosis,
      valueText:
        hasConfirmedDiagnosis === YES
          ? newPrimarySchoolMessages.shared.yes
          : newPrimarySchoolMessages.shared.no,
    },
  ]

  const isDiagnosisInProgressItems: Array<KeyValueItem> =
    hasConfirmedDiagnosis === NO
      ? [
          {
            width: 'full',
            keyText:
              newPrimarySchoolMessages.differentNeeds.isDiagnosisInProgress,
            valueText:
              isDiagnosisInProgress === YES
                ? newPrimarySchoolMessages.shared.yes
                : newPrimarySchoolMessages.shared.no,
          },
        ]
      : []

  const diagnosticiansItems: Array<KeyValueItem> = shouldShowDiagnosticians(
    answers,
  )
    ? [
        {
          width: 'full',
          keyText: newPrimarySchoolMessages.differentNeeds.atWhichDiagnostician,
          valueText: diagnosticians
            .map((diagnostician) =>
              getSelectedOptionLabel(diagnosisSpecialistOptions, diagnostician),
            )
            .join(', '),
        },
      ]
    : []

  const baseItems5: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText: newPrimarySchoolMessages.differentNeeds.hasOtherSpecialists,
      valueText:
        hasOtherSpecialists === YES
          ? newPrimarySchoolMessages.shared.yes
          : newPrimarySchoolMessages.shared.no,
    },
  ]

  const specialistsItems: Array<KeyValueItem> = shouldShowSpecialists(answers)
    ? [
        {
          width: 'full',
          keyText: newPrimarySchoolMessages.differentNeeds.atWhichSpecialist,
          valueText: specialists
            .map((specialist) =>
              getSelectedOptionLabel(professionalOptions, specialist),
            )
            .join(', '),
        },
      ]
    : []

  const baseItems6: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText:
        newPrimarySchoolMessages.differentNeeds
          .hasReceivedServicesFromMunicipality,
      valueText:
        hasReceivedServicesFromMunicipality === YES
          ? newPrimarySchoolMessages.shared.yes
          : newPrimarySchoolMessages.shared.no,
    },
  ]

  const servicesFromMunicipalityItems: Array<KeyValueItem> =
    shouldShowServicesFromMunicipality(answers)
      ? [
          {
            width: 'full',
            keyText: newPrimarySchoolMessages.differentNeeds.whichService,
            valueText: servicesFromMunicipality
              .map((service) =>
                getSelectedOptionLabel(serviceCenterOptions, service),
              )
              .join(', '),
          },
        ]
      : []

  const baseItems7: Array<KeyValueItem> = hasBehaviorSchoolOrDepartmentSubType(
    answers,
    externalData,
  )
    ? [
        {
          width: 'full',
          keyText:
            newPrimarySchoolMessages.differentNeeds
              .hasReceivedChildAndAdolescentPsychiatryServices,
          valueText:
            hasReceivedChildAndAdolescentPsychiatryServices === YES
              ? newPrimarySchoolMessages.shared.yes
              : newPrimarySchoolMessages.shared.no,
        },
      ]
    : []

  const isOnWaitlistForServicesItems: Array<KeyValueItem> =
    hasBehaviorSchoolOrDepartmentSubType(answers, externalData) &&
    hasReceivedChildAndAdolescentPsychiatryServices === NO
      ? [
          {
            width: 'full',
            keyText:
              newPrimarySchoolMessages.differentNeeds.isOnWaitlistForServices,
            valueText:
              isOnWaitlistForServices === YES
                ? newPrimarySchoolMessages.shared.yes
                : newPrimarySchoolMessages.shared.no,
          },
        ]
      : []

  const childAndAdolescentPsychiatryDepartmentItems: Array<KeyValueItem> =
    shouldShowChildAndAdolescentPsychiatryDepartment(answers, externalData)
      ? [
          {
            width: 'full',
            keyText:
              newPrimarySchoolMessages.differentNeeds
                .whichChildAndAdolescentPsychiatryDepartment,
            valueText: getSelectedOptionLabel(
              childAndAdolescentMentalHealthDepartmentOptions,
              childAndAdolescentPsychiatryDepartment,
            ),
          },
        ]
      : []

  const childAndAdolescentPsychiatryServicesReceivedItems: Array<KeyValueItem> =
    shouldShowChildAndAdolescentPsychiatryServicesReceived(
      answers,
      externalData,
    )
      ? [
          {
            width: 'full',
            keyText:
              newPrimarySchoolMessages.differentNeeds
                .childAndAdolescentPsychiatryServicesReceived,
            valueText: childAndAdolescentPsychiatryServicesReceived
              .map((service) =>
                getSelectedOptionLabel(
                  childAndAdolescentMentalHealthServiceOptions,
                  service,
                ),
              )
              .join(', '),
          },
        ]
      : []

  const baseItems8: Array<KeyValueItem> = hasBehaviorSchoolOrDepartmentSubType(
    answers,
    externalData,
  )
    ? [
        {
          width: 'full',
          keyText:
            newPrimarySchoolMessages.differentNeeds
              .hasBeenReportedToChildProtectiveServices,
          valueText:
            hasBeenReportedToChildProtectiveServices === YES
              ? newPrimarySchoolMessages.shared.yes
              : newPrimarySchoolMessages.shared.no,
        },
      ]
    : []

  const isCaseOpenWithChildProtectiveServicesItems: Array<KeyValueItem> =
    hasBehaviorSchoolOrDepartmentSubType(answers, externalData) &&
    hasBeenReportedToChildProtectiveServices === YES
      ? [
          {
            width: 'full',
            keyText:
              newPrimarySchoolMessages.differentNeeds
                .isCaseOpenWithChildProtectiveServices,
            valueText:
              isCaseOpenWithChildProtectiveServices === YES
                ? newPrimarySchoolMessages.shared.yes
                : newPrimarySchoolMessages.shared.no,
          },
        ]
      : []

  return [
    ...baseItems,
    ...welfareContactItems,
    ...baseItems2,
    ...caseManagerItems,
    ...baseItems3,
    ...isAssessmentOfSupportNeedsInProgressItems,
    ...supportNeedsAssessmentByItems,
    ...baseItems4,
    ...isDiagnosisInProgressItems,
    ...diagnosticiansItems,
    ...baseItems5,
    ...specialistsItems,
    ...baseItems6,
    ...servicesFromMunicipalityItems,
    ...baseItems7,
    ...isOnWaitlistForServicesItems,
    ...childAndAdolescentPsychiatryDepartmentItems,
    ...childAndAdolescentPsychiatryServicesReceivedItems,
    ...baseItems8,
    ...isCaseOpenWithChildProtectiveServicesItems,
  ]
}

export const payerItems = (answers: FormValue): Array<KeyValueItem> => {
  const { payer, payerName, payerNationalId } = getApplicationAnswers(answers)

  return payer === PayerOption.APPLICANT
    ? [
        {
          width: 'full',
          keyText: newPrimarySchoolMessages.differentNeeds.payerSubSectionTitle,
          valueText:
            newPrimarySchoolMessages.differentNeeds.payerOptionApplicant,
        },
      ]
    : [
        {
          width: 'half',
          keyText: newPrimarySchoolMessages.shared.fullName,
          valueText: payerName,
        },
        {
          width: 'half',
          keyText: newPrimarySchoolMessages.shared.nationalId,
          valueText: formatKennitala(payerNationalId ?? ''),
        },
      ]
}
