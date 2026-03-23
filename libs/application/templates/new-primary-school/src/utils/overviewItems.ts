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
import {
  childrenNGuardiansMessages,
  differentNeedsMessages,
  overviewMessages,
  primarySchoolMessages,
  sharedMessages,
} from '../lib/messages'
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
      keyText: sharedMessages.fullName,
      valueText: childInfo?.name,
    },
    {
      width: 'half',
      keyText: sharedMessages.nationalId,
      valueText: formatKennitala(childInfo?.nationalId ?? ''),
    },
    {
      width: 'half',
      keyText: sharedMessages.address,
      valueText: childInfo?.address?.streetAddress,
    },
    {
      width: 'half',
      keyText: sharedMessages.municipality,
      valueText: `${childInfo?.address?.postalCode}, ${childInfo?.address?.city}`,
    },

    {
      width: 'half',
      keyText: sharedMessages.gender,
      valueText: genderMessage,
    },
  ]

  const preferredNameItems: Array<KeyValueItem> =
    childInfo?.usePronounAndPreferredName?.includes(YES) &&
    childInfo?.preferredName?.trim().length > 0
      ? [
          {
            width: 'half',
            keyText: childrenNGuardiansMessages.childInfo.preferredName,
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
            keyText: childrenNGuardiansMessages.childInfo.pronouns,
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
      keyText: sharedMessages.fullName,
      valueText: guardians[index].fullName,
    },
    {
      width: 'half',
      keyText: sharedMessages.nationalId,
      valueText: formatKennitala(guardians[index].nationalId ?? ''),
    },
    {
      width: 'half',
      keyText: sharedMessages.address,
      valueText: guardians[index].address.streetAddress,
    },
    {
      width: 'half',
      keyText: sharedMessages.municipality,
      valueText: `${guardians[index].address.postalCode}, ${guardians[index].address.city}`,
    },
    {
      width: 'half',
      keyText: sharedMessages.email,
      valueText: guardians[index].email,
    },
    {
      width: 'half',
      keyText: sharedMessages.phoneNumber,
      valueText: formatNumber(guardians[index].phoneNumber, 'International'),
    },
    {
      width: 'half',
      keyText: childrenNGuardiansMessages.guardians.requiresInterpreter,
      valueText: guardians[index].requiresInterpreter.includes(YES)
        ? sharedMessages.yes
        : sharedMessages.no,
    },
  ]

  const requiresInterpreterItems: Array<KeyValueItem> = guardians[
    index
  ].requiresInterpreter.includes(YES)
    ? [
        {
          width: 'half',
          keyText: sharedMessages.language,
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
      sharedMessages.fullName,
      sharedMessages.nationalId,
      sharedMessages.phoneNumber,
      sharedMessages.relation,
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
      keyText: primarySchoolMessages.currentSchool.currentSchool,
      valueText:
        getCurrentSchoolName(externalData) ||
        getSchoolName(externalData, currentSchoolId ?? ''),
    },
  ]

  const gradeItems: Array<KeyValueItem> = primaryOrgId
    ? [
        {
          width: 'half',
          keyText: primarySchoolMessages.currentSchool.grade,
          valueText: {
            ...primarySchoolMessages.currentSchool.currentGrade,
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
      keyText: overviewMessages.currentNursery,
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
          ? overviewMessages.neighbourhoodSchool
          : overviewMessages.selectedSchool,
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
            keyText: overviewMessages.expectedStartDate,
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
            keyText: overviewMessages.expectedEndDate,
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
            ...primarySchoolMessages.newSchool
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
      keyText: primarySchoolMessages.reasonForApplication.subSectionTitle,
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
        primarySchoolMessages.counsellingRegardingApplication.subSectionTitle,
      valueText:
        getSelectedOptionLabel(
          reasonFriggOptions,
          counsellingRegardingApplication,
        ) || '',
    },
    {
      width: 'full',
      keyText:
        primarySchoolMessages.counsellingRegardingApplication.hasVisitedSchool,
      valueText:
        hasVisitedSchool === YES ? sharedMessages.yes : sharedMessages.no,
    },
  ]
}

export const siblingsTable = (answers: FormValue): TableData => {
  const { siblings } = getApplicationAnswers(answers)

  return {
    header: [sharedMessages.fullName, sharedMessages.nationalId],
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
      keyText: overviewMessages.languageEnvironment,
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
            ...differentNeedsMessages.language.languageSelectionTitle,
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
            keyText: overviewMessages.preferredLanguage,
            valueText: getLanguageByCode(preferredLanguage)?.name,
          },
        ]
      : []

  const baseItems2: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText: differentNeedsMessages.language.signLanguage,
      valueText: signLanguage === YES ? sharedMessages.yes : sharedMessages.no,
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
            keyText: overviewMessages.foodAllergiesOrIntolerances,
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
          keyText: overviewMessages.otherAllergies,
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
            keyText: overviewMessages.usesEpiPen,
            valueText:
              usesEpiPen === YES ? sharedMessages.yes : sharedMessages.no,
          },
        ]
      : []

  const baseItems: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText:
        differentNeedsMessages.healthProtection.hasConfirmedMedicalDiagnoses,
      valueText:
        hasConfirmedMedicalDiagnoses === YES
          ? sharedMessages.yes
          : sharedMessages.no,
    },
    {
      width: 'full',
      keyText:
        differentNeedsMessages.healthProtection
          .requestsMedicationAdministration,
      valueText:
        requestsMedicationAdministration === YES
          ? sharedMessages.yes
          : sharedMessages.no,
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
          ? differentNeedsMessages.support.enrollmentHasDiagnoses
          : differentNeedsMessages.support.hasDiagnoses,
      valueText: hasDiagnoses === YES ? sharedMessages.yes : sharedMessages.no,
    },
    {
      width: 'full',
      keyText:
        applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
          ? differentNeedsMessages.support.enrollmentHasHadSupport
          : differentNeedsMessages.support.hasHadSupport,
      valueText: hasHadSupport === YES ? sharedMessages.yes : sharedMessages.no,
    },
  ]

  const hasWelfareContactItems: Array<KeyValueItem> =
    hasDiagnoses === YES || hasHadSupport === YES
      ? [
          {
            width: 'full',
            keyText: differentNeedsMessages.support.hasWelfareContact,
            valueText:
              hasWelfareContact === YES
                ? sharedMessages.yes
                : sharedMessages.no,
          },
        ]
      : []

  const welfareContactItems: Array<KeyValueItem> =
    (hasDiagnoses === YES || hasHadSupport === YES) && hasWelfareContact === YES
      ? [
          {
            width: 'half',
            keyText: differentNeedsMessages.support.welfareContactName,
            valueText: welfareContactName,
          },
          {
            width: 'half',
            keyText: differentNeedsMessages.support.welfareContactEmail,
            valueText: welfareContactEmail,
          },
          {
            width: 'full',
            keyText: differentNeedsMessages.support.hasCaseManager,
            valueText:
              hasCaseManager === YES ? sharedMessages.yes : sharedMessages.no,
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
            keyText: differentNeedsMessages.support.caseManagerName,
            valueText: caseManagerName,
          },
          {
            width: 'half',
            keyText: differentNeedsMessages.support.caseManagerEmail,
            valueText: caseManagerEmail,
          },
        ]
      : []

  const welfareContactItems2: Array<KeyValueItem> =
    (hasDiagnoses === YES || hasHadSupport === YES) && hasWelfareContact === YES
      ? [
          {
            width: 'full',
            keyText: differentNeedsMessages.support.hasIntegratedServices,
            valueText:
              hasIntegratedServices === YES
                ? sharedMessages.yes
                : sharedMessages.no,
          },
        ]
      : []

  const baseItems2: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText: differentNeedsMessages.support.requestingMeetingDescription,
      valueText:
        requestingMeeting === YES ? sharedMessages.yes : sharedMessages.no,
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
      keyText: differentNeedsMessages.specialEducationSupport.hasWelfareContact,
      valueText:
        specialEducationHasWelfareContact === YES
          ? sharedMessages.yes
          : sharedMessages.no,
    },
  ]

  const welfareContactItems: Array<KeyValueItem> =
    hasSpecialEducationWelfareContact(answers)
      ? [
          {
            width: 'half',
            keyText: differentNeedsMessages.support.welfareContactName,
            valueText: specialEducationWelfareContactName,
          },
          {
            width: 'half',
            keyText: differentNeedsMessages.support.welfareContactEmail,
            valueText: specialEducationWelfareContactEmail,
          },
        ]
      : []

  const baseItems2: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText: differentNeedsMessages.specialEducationSupport.hasCaseManager,
      valueText:
        specialEducationHasCaseManager === YES
          ? sharedMessages.yes
          : sharedMessages.no,
    },
  ]

  const caseManagerItems: Array<KeyValueItem> = hasSpecialEducationCaseManager(
    answers,
  )
    ? [
        {
          width: 'half',
          keyText: differentNeedsMessages.support.caseManagerName,
          valueText: specialEducationCaseManagerName,
        },
        {
          width: 'half',
          keyText: differentNeedsMessages.support.caseManagerEmail,
          valueText: specialEducationCaseManagerEmail,
        },
      ]
    : []

  const baseItems3: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText:
        differentNeedsMessages.specialEducationSupport.hasIntegratedServices,
      valueText:
        specialEducationHasIntegratedServices === YES
          ? sharedMessages.yes
          : sharedMessages.no,
    },
    {
      width: 'full',
      keyText:
        differentNeedsMessages.specialEducationSupport
          .hasAssessmentOfSupportNeeds,
      valueText:
        hasAssessmentOfSupportNeeds === YES
          ? sharedMessages.yes
          : sharedMessages.no,
    },
  ]

  const isAssessmentOfSupportNeedsInProgressItems: Array<KeyValueItem> =
    hasAssessmentOfSupportNeeds === NO
      ? [
          {
            width: 'full',
            keyText:
              differentNeedsMessages.specialEducationSupport
                .isAssessmentOfSupportNeedsInProgress,
            valueText:
              isAssessmentOfSupportNeedsInProgress === YES
                ? sharedMessages.yes
                : sharedMessages.no,
          },
        ]
      : []

  const supportNeedsAssessmentByItems: Array<KeyValueItem> =
    shouldShowSupportNeedsAssessmentBy(answers)
      ? [
          {
            width: 'full',
            keyText:
              differentNeedsMessages.specialEducationSupport
                .supportNeedsAssessmentBy,
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
      keyText:
        differentNeedsMessages.specialEducationSupport.hasConfirmedDiagnosis,
      valueText:
        hasConfirmedDiagnosis === YES ? sharedMessages.yes : sharedMessages.no,
    },
  ]

  const isDiagnosisInProgressItems: Array<KeyValueItem> =
    hasConfirmedDiagnosis === NO
      ? [
          {
            width: 'full',
            keyText:
              differentNeedsMessages.specialEducationSupport
                .isDiagnosisInProgress,
            valueText:
              isDiagnosisInProgress === YES
                ? sharedMessages.yes
                : sharedMessages.no,
          },
        ]
      : []

  const diagnosticiansItems: Array<KeyValueItem> = shouldShowDiagnosticians(
    answers,
  )
    ? [
        {
          width: 'full',
          keyText:
            differentNeedsMessages.specialEducationSupport.atWhichDiagnostician,
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
      keyText:
        differentNeedsMessages.specialEducationSupport.hasOtherSpecialists,
      valueText:
        hasOtherSpecialists === YES ? sharedMessages.yes : sharedMessages.no,
    },
  ]

  const specialistsItems: Array<KeyValueItem> = shouldShowSpecialists(answers)
    ? [
        {
          width: 'full',
          keyText:
            differentNeedsMessages.specialEducationSupport.atWhichSpecialist,
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
        differentNeedsMessages.specialEducationSupport
          .hasReceivedServicesFromMunicipality,
      valueText:
        hasReceivedServicesFromMunicipality === YES
          ? sharedMessages.yes
          : sharedMessages.no,
    },
  ]

  const servicesFromMunicipalityItems: Array<KeyValueItem> =
    shouldShowServicesFromMunicipality(answers)
      ? [
          {
            width: 'full',
            keyText:
              differentNeedsMessages.specialEducationSupport.whichService,
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
            differentNeedsMessages.specialEducationSupport
              .hasReceivedChildAndAdolescentPsychiatryServices,
          valueText:
            hasReceivedChildAndAdolescentPsychiatryServices === YES
              ? sharedMessages.yes
              : sharedMessages.no,
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
              differentNeedsMessages.specialEducationSupport
                .isOnWaitlistForServices,
            valueText:
              isOnWaitlistForServices === YES
                ? sharedMessages.yes
                : sharedMessages.no,
          },
        ]
      : []

  const childAndAdolescentPsychiatryDepartmentItems: Array<KeyValueItem> =
    shouldShowChildAndAdolescentPsychiatryDepartment(answers, externalData)
      ? [
          {
            width: 'full',
            keyText:
              differentNeedsMessages.specialEducationSupport
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
              differentNeedsMessages.specialEducationSupport
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
            differentNeedsMessages.specialEducationSupport
              .hasBeenReportedToChildProtectiveServices,
          valueText:
            hasBeenReportedToChildProtectiveServices === YES
              ? sharedMessages.yes
              : sharedMessages.no,
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
              differentNeedsMessages.specialEducationSupport
                .isCaseOpenWithChildProtectiveServices,
            valueText:
              isCaseOpenWithChildProtectiveServices === YES
                ? sharedMessages.yes
                : sharedMessages.no,
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
          keyText: differentNeedsMessages.payer.subSectionTitle,
          valueText: differentNeedsMessages.payer.optionApplicant,
        },
      ]
    : [
        {
          width: 'half',
          keyText: sharedMessages.fullName,
          valueText: payerName,
        },
        {
          width: 'half',
          keyText: sharedMessages.nationalId,
          valueText: formatKennitala(payerNationalId ?? ''),
        },
      ]
}
