import { YES } from '@island.is/application/core'
import {
  ApplicationType,
  getApplicationAnswers,
  getApplicationExternalData,
  getOtherGuardian,
  hasBehaviorSchoolOrDepartmentSubType,
  hasSpecialEducationCaseManager,
  hasSpecialEducationSubType,
  hasSpecialEducationWelfareContact,
  LanguageEnvironmentOptions,
  needsOtherGuardianApproval,
  needsPayerApproval,
  ReasonForApplicationOptions,
  shouldShowAlternativeSpecialEducationDepartment,
  shouldShowExpectedEndDate,
  shouldShowReasonForApplicationPage,
} from '@island.is/application/templates/new-primary-school'
import { Application } from '@island.is/application/types'
import {
  CaseWorkerInput,
  CaseWorkerInputTypeEnum,
  RegistrationApplicationInput,
  RegistrationApplicationInputApplicationTypeEnum,
} from '@island.is/clients/mms/frigg'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { join } from 'path'

export const getSocialProfile = (application: Application) => {
  const {
    hasDiagnoses,
    hasHadSupport,
    hasWelfareContact,
    welfareContactName,
    welfareContactEmail,
    hasCaseManager,
    caseManagerName,
    caseManagerEmail,
    hasIntegratedServices,
  } = getApplicationAnswers(application.answers)

  if (
    (hasHadSupport === YES || hasDiagnoses === YES) &&
    hasWelfareContact === YES
  ) {
    return {
      hasHadSupport: hasHadSupport === YES,
      hasDiagnoses: hasDiagnoses === YES,
      hasIntegratedServices: hasIntegratedServices === YES,
      caseWorkers: [
        {
          name: welfareContactName || '',
          email: welfareContactEmail || '',
          type: CaseWorkerInputTypeEnum.SupportManager,
        },
        ...(hasCaseManager === YES
          ? [
              {
                name: caseManagerName || '',
                email: caseManagerEmail || '',
                type: CaseWorkerInputTypeEnum.CaseManager,
              },
            ]
          : []),
      ],
    }
  }

  // If hasWelfareContact is NO or not defined, return empty caseWorkers array
  return {
    hasHadSupport: hasHadSupport === YES,
    hasDiagnoses: hasDiagnoses === YES,
    hasIntegratedServices: false,
    caseWorkers: [],
  }
}

export const getSpecialEducationSocialProfile = (application: Application) => {
  const {
    specialEducationWelfareContactName,
    specialEducationWelfareContactEmail,
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
  } = getApplicationAnswers(application.answers)

  const caseWorkers: CaseWorkerInput[] = []
  const previousSocialServices: string[] = []
  const ongoingSocialServices: string[] = []

  const hasBehaviorSubType = hasBehaviorSchoolOrDepartmentSubType(
    application.answers,
    application.externalData,
  )

  if (hasSpecialEducationWelfareContact(application.answers)) {
    caseWorkers.push({
      name: specialEducationWelfareContactName || '',
      email: specialEducationWelfareContactEmail || '',
      type: CaseWorkerInputTypeEnum.SupportManager,
    })
  }

  if (hasSpecialEducationCaseManager(application.answers)) {
    caseWorkers.push({
      name: specialEducationCaseManagerName || '',
      email: specialEducationCaseManagerEmail || '',
      type: CaseWorkerInputTypeEnum.CaseManager,
    })
  }

  if (hasAssessmentOfSupportNeeds === YES) {
    previousSocialServices.push(supportNeedsAssessmentBy || '')
  } else if (isAssessmentOfSupportNeedsInProgress === YES) {
    ongoingSocialServices.push(supportNeedsAssessmentBy || '')
  }

  if (hasConfirmedDiagnosis === YES) {
    previousSocialServices.push(...diagnosticians)
  } else if (isDiagnosisInProgress === YES) {
    ongoingSocialServices.push(...diagnosticians)
  }

  if (hasOtherSpecialists === YES) {
    previousSocialServices.push(...specialists)
  }

  if (hasReceivedServicesFromMunicipality === YES) {
    previousSocialServices.push(...servicesFromMunicipality)
  }

  if (hasBehaviorSubType) {
    if (hasReceivedChildAndAdolescentPsychiatryServices === YES) {
      previousSocialServices.push(childAndAdolescentPsychiatryDepartment || '')
      previousSocialServices.push(
        ...childAndAdolescentPsychiatryServicesReceived,
      )
    } else if (isOnWaitlistForServices === YES) {
      ongoingSocialServices.push(childAndAdolescentPsychiatryDepartment || '')
    }
  }

  return {
    caseWorkers: caseWorkers,
    hasIntegratedServices: specialEducationHasIntegratedServices === YES,
    previousSocialServices: previousSocialServices,
    ongoingSocialServices: ongoingSocialServices,
    ...(hasBehaviorSubType && {
      previousChildProtectionCase:
        hasBeenReportedToChildProtectiveServices === YES,
      ...(hasBeenReportedToChildProtectiveServices === YES && {
        openChildProtectionCase: isCaseOpenWithChildProtectiveServices === YES,
      }),
    }),
  }
}

export const transformApplicationToNewPrimarySchoolDTO = (
  application: Application,
): RegistrationApplicationInput => {
  const {
    applicationType,
    childInfo,
    guardians,
    relatives,
    reasonForApplication,
    reasonForApplicationId,
    counsellingRegardingApplication,
    hasVisitedSchool,
    siblings,
    languageEnvironmentId,
    languageEnvironment,
    selectedLanguages,
    preferredLanguage,
    signLanguage,
    hasFoodAllergiesOrIntolerances,
    foodAllergiesOrIntolerances,
    hasOtherAllergies,
    otherAllergies,
    usesEpiPen,
    hasConfirmedMedicalDiagnoses,
    requestsMedicationAdministration,
    requestingMeeting,
    expectedStartDate,
    temporaryStay,
    expectedEndDate,
    selectedSchoolId,
    alternativeSpecialEducationDepartment,
    currentSchoolId,
    currentNursery,
    applyForPreferredSchool,
    payerName,
    payerNationalId,
  } = getApplicationAnswers(application.answers)

  const { primaryOrgId, preferredSchool } = getApplicationExternalData(
    application.externalData,
  )

  const otherGuardian = getOtherGuardian(
    application.answers,
    application.externalData,
  )

  const alternativeSpecialEducationDepartmentIds =
    alternativeSpecialEducationDepartment
      .filter((item) => item.department)
      .map((item) => item.department)

  const isSpecialEducation = hasSpecialEducationSubType(
    application.answers,
    application.externalData,
  )

  const newPrimarySchoolDTO: RegistrationApplicationInput = {
    id: application.id,
    applicationType: mapApplicationType(application),
    approvalRequester: application.applicant,
    ...(needsOtherGuardianApproval(application) &&
      otherGuardian && {
        additionalRequesters: [otherGuardian.nationalId],
      }),
    registration: {
      applicant: {
        nationalId: childInfo?.nationalId || '',
        ...(childInfo?.usePronounAndPreferredName?.includes(YES) && {
          preferredName: childInfo?.preferredName,
          pronounIds: childInfo?.pronouns,
        }),
      },
      guardians: guardians.map((guardian) => ({
        nationalId: guardian.nationalId,
        email: guardian.email,
        phone: guardian.phoneNumber,
        requiresInterpreter: guardian.requiresInterpreter.includes(YES),
        ...(guardian.requiresInterpreter.includes(YES) && {
          preferredLanguage: guardian.preferredLanguage,
        }),
      })),
      ...(reasonForApplication ===
        ReasonForApplicationOptions.SIBLINGS_IN_SAME_SCHOOL && {
        siblings: siblings.map(
          (sibling) => sibling.nationalIdWithName.nationalId,
        ),
      }),
      emergencyContacts: relatives.map((relative) => ({
        nationalId: relative.nationalIdWithName.nationalId,
        phone: relative.phoneNumber,
        relationTypeId: relative.relation,
      })),
      ...(applicationType === ApplicationType.NEW_PRIMARY_SCHOOL
        ? { defaultOrganizationId: primaryOrgId || currentSchoolId }
        : applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL && {
            defaultOrganizationId: currentNursery,
          }),
      selectedOrganizationId:
        (applicationType === ApplicationType.NEW_PRIMARY_SCHOOL
          ? selectedSchoolId
          : applicationType === ApplicationType.CONTINUING_ENROLLMENT
          ? primaryOrgId
          : applyForPreferredSchool === YES
          ? preferredSchool?.id
          : selectedSchoolId) || '',
      ...(shouldShowAlternativeSpecialEducationDepartment(
        application.answers,
        application.externalData,
      ) &&
        alternativeSpecialEducationDepartmentIds.length > 0 && {
          alternativeOrganizationIds: alternativeSpecialEducationDepartmentIds,
        }),
      requestingMeeting: requestingMeeting === YES,
      ...(applicationType === ApplicationType.NEW_PRIMARY_SCHOOL && {
        expectedStartDate: expectedStartDate
          ? new Date(expectedStartDate)
          : undefined,
        ...(shouldShowExpectedEndDate(
          application.answers,
          application.externalData,
        ) &&
          temporaryStay === YES && {
            expectedEndDate: expectedEndDate
              ? new Date(expectedEndDate)
              : undefined,
          }),
      }),
      ...(shouldShowReasonForApplicationPage(application.answers) && {
        ...(isSpecialEducation
          ? {
              reasonId: counsellingRegardingApplication,
              visitedAndResearched: hasVisitedSchool === YES,
            }
          : { reasonId: reasonForApplicationId }),
      }),
      health: {
        ...(hasFoodAllergiesOrIntolerances?.includes(YES) && {
          foodAllergiesOrIntoleranceIds: foodAllergiesOrIntolerances,
        }),
        ...(hasOtherAllergies?.includes(YES) && {
          allergiesIds: otherAllergies,
        }),
        ...((hasFoodAllergiesOrIntolerances?.includes(YES) ||
          hasOtherAllergies?.includes(YES)) && {
          usesEpipen: usesEpiPen === YES,
        }),
        hasConfirmedMedicalDiagnoses: hasConfirmedMedicalDiagnoses === YES,
        requestsMedicationAdministration:
          requestsMedicationAdministration === YES,
      },
      social: isSpecialEducation
        ? getSpecialEducationSocialProfile(application)
        : getSocialProfile(application),
      language: {
        languageEnvironmentId: languageEnvironmentId,
        signLanguage: signLanguage === YES,
        ...(languageEnvironment !== LanguageEnvironmentOptions.ONLY_ICELANDIC
          ? {
              preferredLanguage: preferredLanguage || '',
              languages: selectedLanguages.map((language) => language.code),
            }
          : {
              preferredLanguage: 'is',
              languages: ['is'],
            }),
      },
      ...(needsPayerApproval(application) && {
        payer: {
          name: payerName || '',
          nationalId: payerNationalId || '',
        },
      }),
    },
  }

  return newPrimarySchoolDTO
}

export const mapApplicationType = (application: Application) => {
  const { applicationType, applyForPreferredSchool } = getApplicationAnswers(
    application.answers,
  )

  switch (applicationType) {
    case ApplicationType.NEW_PRIMARY_SCHOOL:
      return RegistrationApplicationInputApplicationTypeEnum.Transfer

    case ApplicationType.CONTINUING_ENROLLMENT:
      return RegistrationApplicationInputApplicationTypeEnum.Continuation

    case ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL:
      return applyForPreferredSchool === YES
        ? RegistrationApplicationInputApplicationTypeEnum.Enrollment
        : RegistrationApplicationInputApplicationTypeEnum.Transfer

    default:
      return RegistrationApplicationInputApplicationTypeEnum.Enrollment
  }
}

export const pathToAsset = (file: string) => {
  if (isRunningOnEnvironment('local')) {
    return join(
      __dirname,
      `../../../../libs/application/template-api-modules/src/lib/modules/templates/new-primary-school/emailGenerators/assets/${file}`,
    )
  }

  return join(__dirname, `./new-primary-school-assets/${file}`)
}
