import {
  buildAlertMessageField,
  buildCheckboxField,
  buildHiddenInput,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  NO,
  YES,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { differentNeedsMessages, sharedMessages } from '../../../lib/messages'
import {
  hasSpecialEducationSubType,
  isWelfareContactSelected,
  shouldShowPage,
  showCaseManagerFields,
} from '../../../utils/conditionUtils'
import {
  ApplicationFeatureKey,
  ApplicationType,
  CaseWorkerInputTypeEnum,
  OrganizationSubType,
} from '../../../utils/constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getDefaultSupportCaseworker,
  getDefaultYESNOValue,
  getSelectedSchoolSubType,
  getWelfareContactDescription,
  hasDefaultSupportCaseworker,
} from '../../../utils/newPrimarySchoolUtils'

export const supportSubSection = buildSubSection({
  id: 'supportSubSection',
  title: differentNeedsMessages.support.subSectionTitle,
  condition: (answers, externalData) =>
    //Business logic override as applicationConfig isn't ready on MMS side
    //Should be removed when applicationConfig is ready
    true ||
    (shouldShowPage(answers, externalData, ApplicationFeatureKey.SOCIAL_INFO) &&
      !hasSpecialEducationSubType(answers, externalData)),
  children: [
    buildMultiField({
      id: 'support',
      title: differentNeedsMessages.support.subSectionTitle,
      description: (application) => {
        const { applicationType } = getApplicationAnswers(application.answers)

        return applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
          ? differentNeedsMessages.support.enrollmentDescription
          : differentNeedsMessages.support.description
      },
      children: [
        buildRadioField({
          id: 'support.hasDiagnoses',
          title: (application) => {
            const { applicationType } = getApplicationAnswers(
              application.answers,
            )

            return applicationType ===
              ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
              ? differentNeedsMessages.support.enrollmentHasDiagnoses
              : differentNeedsMessages.support.hasDiagnoses
          },
          width: 'half',
          required: true,
          options: [
            {
              label: sharedMessages.yes,
              dataTestId: 'has-diagnoses',
              value: YES,
            },
            {
              label: sharedMessages.no,
              dataTestId: 'no-has-diagnoses',
              value: NO,
            },
          ],
          defaultValue: (application: Application) => {
            const { socialProfile } = getApplicationExternalData(
              application.externalData,
            )

            return getDefaultYESNOValue(socialProfile?.hasDiagnoses)
          },
        }),
        buildRadioField({
          id: 'support.hasHadSupport',
          title: (application) => {
            const { applicationType } = getApplicationAnswers(
              application.answers,
            )

            return applicationType ===
              ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
              ? differentNeedsMessages.support.enrollmentHasHadSupport
              : differentNeedsMessages.support.hasHadSupport
          },
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: sharedMessages.yes,
              dataTestId: 'has-had-support',
              value: YES,
            },
            {
              label: sharedMessages.no,
              dataTestId: 'no-has-had-support',
              value: NO,
            },
          ],
          defaultValue: (application: Application) => {
            const { socialProfile } = getApplicationExternalData(
              application.externalData,
            )

            return getDefaultYESNOValue(socialProfile?.hasHadSupport)
          },
        }),
        buildRadioField({
          id: 'support.hasWelfareContact',
          title: differentNeedsMessages.support.hasWelfareContact,
          description: getWelfareContactDescription,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: sharedMessages.yes,
              dataTestId: 'has-welfare-contact',
              value: YES,
            },
            {
              label: sharedMessages.no,
              dataTestId: 'no-has-welfare-contact',
              value: NO,
            },
          ],
          condition: (answers) => {
            const { hasDiagnoses, hasHadSupport } =
              getApplicationAnswers(answers)

            return hasDiagnoses === YES || hasHadSupport === YES
          },
          defaultValue: (application: Application) =>
            hasDefaultSupportCaseworker(
              application.externalData,
              CaseWorkerInputTypeEnum.SupportManager,
            ),
        }),
        buildTextField({
          id: 'support.welfareContact.name',
          title: differentNeedsMessages.support.welfareContactName,
          width: 'half',
          required: true,
          condition: isWelfareContactSelected,
          defaultValue: (application: Application) =>
            getDefaultSupportCaseworker(
              application.externalData,
              CaseWorkerInputTypeEnum.SupportManager,
            )?.name,
        }),
        buildTextField({
          id: 'support.welfareContact.email',
          title: differentNeedsMessages.support.welfareContactEmail,
          width: 'half',
          required: true,
          condition: isWelfareContactSelected,
          defaultValue: (application: Application) =>
            getDefaultSupportCaseworker(
              application.externalData,
              CaseWorkerInputTypeEnum.SupportManager,
            )?.email,
        }),
        buildRadioField({
          id: 'support.hasCaseManager',
          title: differentNeedsMessages.support.hasCaseManager,
          description: differentNeedsMessages.support.hasCaseManagerDescription,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: sharedMessages.yes,
              dataTestId: 'has-case-manager',
              value: YES,
            },
            {
              label: sharedMessages.no,
              dataTestId: 'no-has-case-manager',
              value: NO,
            },
          ],
          condition: isWelfareContactSelected,
          defaultValue: (application: Application) =>
            hasDefaultSupportCaseworker(
              application.externalData,
              CaseWorkerInputTypeEnum.CaseManager,
            ),
        }),
        buildTextField({
          id: 'support.caseManager.name',
          title: differentNeedsMessages.support.caseManagerName,
          width: 'half',
          required: true,
          condition: showCaseManagerFields,
          defaultValue: (application: Application) =>
            getDefaultSupportCaseworker(
              application.externalData,
              CaseWorkerInputTypeEnum.CaseManager,
            )?.name,
        }),
        buildTextField({
          id: 'support.caseManager.email',
          title: differentNeedsMessages.support.caseManagerEmail,
          width: 'half',
          required: true,
          condition: showCaseManagerFields,
          defaultValue: (application: Application) =>
            getDefaultSupportCaseworker(
              application.externalData,
              CaseWorkerInputTypeEnum.CaseManager,
            )?.email,
        }),
        buildRadioField({
          id: 'support.hasIntegratedServices',
          title: differentNeedsMessages.support.hasIntegratedServices,
          description:
            differentNeedsMessages.support.hasIntegratedServicesDescription,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: sharedMessages.yes,
              dataTestId: 'has-integrated-services',
              value: YES,
            },
            {
              label: sharedMessages.no,
              dataTestId: 'no-has-integrated-services',
              value: NO,
            },
          ],
          condition: isWelfareContactSelected,
          defaultValue: (application: Application) => {
            const { socialProfile } = getApplicationExternalData(
              application.externalData,
            )

            return getDefaultYESNOValue(socialProfile?.hasIntegratedServices)
          },
        }),
        buildAlertMessageField({
          id: 'support.supportAlertMessage',
          title: sharedMessages.alertTitle,
          message: (application) => {
            const { applicationType } = getApplicationAnswers(
              application.answers,
            )

            return applicationType === ApplicationType.NEW_PRIMARY_SCHOOL &&
              getSelectedSchoolSubType(
                application.answers,
                application.externalData,
              ) === OrganizationSubType.INTERNATIONAL_SCHOOL
              ? differentNeedsMessages.support.internationalSchoolAlertMessage
              : differentNeedsMessages.support.alertMessage
          },
          doesNotRequireAnswer: true,
          alertType: 'warning',
          marginTop: 4,
        }),
        buildCheckboxField({
          id: 'support.requestingMeeting',
          description: differentNeedsMessages.support.requestingMeeting,
          options: [
            {
              value: YES,
              label:
                differentNeedsMessages.support.requestingMeetingDescription,
            },
          ],
        }),
        buildHiddenInput({
          id: 'support.triggerHiddenInput',
          doesNotRequireAnswer: true,
          defaultValue: '',
        }),
      ],
    }),
  ],
})
