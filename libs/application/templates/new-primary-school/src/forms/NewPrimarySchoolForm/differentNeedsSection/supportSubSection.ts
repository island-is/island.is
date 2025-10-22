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
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  isWelfareContactSelected,
  showCaseManagerFields,
} from '../../../utils/conditionUtils'
import {
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
  hasDefaultSupportCaseworker,
} from '../../../utils/newPrimarySchoolUtils'

export const supportSubSection = buildSubSection({
  id: 'supportSubSection',
  title: newPrimarySchoolMessages.differentNeeds.supportSubSectionTitle,
  children: [
    buildMultiField({
      id: 'support',
      title: newPrimarySchoolMessages.differentNeeds.supportSubSectionTitle,
      description: (application) => {
        const { applicationType } = getApplicationAnswers(application.answers)

        return applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
          ? newPrimarySchoolMessages.differentNeeds.enrollmentSupportDescription
          : newPrimarySchoolMessages.differentNeeds.supportDescription
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
              ? newPrimarySchoolMessages.differentNeeds.enrollmentHasDiagnoses
              : newPrimarySchoolMessages.differentNeeds.hasDiagnoses
          },
          width: 'half',
          required: true,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'has-diagnoses',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
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
              ? newPrimarySchoolMessages.differentNeeds.enrollmentHasHadSupport
              : newPrimarySchoolMessages.differentNeeds.hasHadSupport
          },
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'has-had-support',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
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
          title: newPrimarySchoolMessages.differentNeeds.hasWelfareContact,
          description: (application) => {
            const { applicationType } = getApplicationAnswers(
              application.answers,
            )

            return applicationType ===
              ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
              ? newPrimarySchoolMessages.differentNeeds
                  .hasWelfareNurserySchoolContactDescription
              : newPrimarySchoolMessages.differentNeeds
                  .hasWelfarePrimarySchoolContactDescription
          },
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'has-welfare-contact',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
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
          title: newPrimarySchoolMessages.differentNeeds.welfareContactName,
          width: 'half',
          required: true,
          condition: (answers) => {
            return isWelfareContactSelected(answers)
          },
          defaultValue: (application: Application) =>
            getDefaultSupportCaseworker(
              application.externalData,
              CaseWorkerInputTypeEnum.SupportManager,
            )?.name,
        }),
        buildTextField({
          id: 'support.welfareContact.email',
          title: newPrimarySchoolMessages.differentNeeds.welfareContactEmail,
          width: 'half',
          required: true,
          condition: (answers) => {
            return isWelfareContactSelected(answers)
          },
          defaultValue: (application: Application) =>
            getDefaultSupportCaseworker(
              application.externalData,
              CaseWorkerInputTypeEnum.SupportManager,
            )?.email,
        }),
        buildRadioField({
          id: 'support.hasCaseManager',
          title: newPrimarySchoolMessages.differentNeeds.hasCaseManager,
          description:
            newPrimarySchoolMessages.differentNeeds.hasCaseManagerDescription,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'has-case-manager',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-has-case-manager',
              value: NO,
            },
          ],
          condition: (answers) => {
            return isWelfareContactSelected(answers)
          },
          defaultValue: (application: Application) =>
            hasDefaultSupportCaseworker(
              application.externalData,
              CaseWorkerInputTypeEnum.CaseManager,
            ),
        }),
        buildTextField({
          id: 'support.caseManager.name',
          title: newPrimarySchoolMessages.differentNeeds.caseManagerName,
          width: 'half',
          required: true,
          condition: (answers) => showCaseManagerFields(answers),
          defaultValue: (application: Application) =>
            getDefaultSupportCaseworker(
              application.externalData,
              CaseWorkerInputTypeEnum.CaseManager,
            )?.name || '',
        }),
        buildTextField({
          id: 'support.caseManager.email',
          title: newPrimarySchoolMessages.differentNeeds.caseManagerEmail,
          width: 'half',
          required: true,
          condition: (answers) => showCaseManagerFields(answers),
          defaultValue: (application: Application) =>
            getDefaultSupportCaseworker(
              application.externalData,
              CaseWorkerInputTypeEnum.CaseManager,
            )?.email || '',
        }),
        buildRadioField({
          id: 'support.hasIntegratedServices',
          title: newPrimarySchoolMessages.differentNeeds.hasIntegratedServices,
          description:
            newPrimarySchoolMessages.differentNeeds
              .hasIntegratedServicesDescription,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'has-integrated-services',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-has-integrated-services',
              value: NO,
            },
          ],
          condition: (answers) => {
            return isWelfareContactSelected(answers)
          },
          defaultValue: (application: Application) => {
            const { socialProfile } = getApplicationExternalData(
              application.externalData,
            )

            return getDefaultYESNOValue(socialProfile?.hasIntegratedServices)
          },
        }),
        buildAlertMessageField({
          id: 'support.supportAlertMessage',
          title: (application) => {
            const { applicationType } = getApplicationAnswers(
              application.answers,
            )

            return applicationType === ApplicationType.NEW_PRIMARY_SCHOOL &&
              getSelectedSchoolSubType(
                application.answers,
                application.externalData,
              ) === OrganizationSubType.INTERNATIONAL_SCHOOL
              ? newPrimarySchoolMessages.shared.alertTitle.description
              : newPrimarySchoolMessages.shared.alertTitle
          },
          message: (application) => {
            const { applicationType } = getApplicationAnswers(
              application.answers,
            )

            return applicationType === ApplicationType.NEW_PRIMARY_SCHOOL &&
              getSelectedSchoolSubType(
                application.answers,
                application.externalData,
              ) === OrganizationSubType.INTERNATIONAL_SCHOOL
              ? newPrimarySchoolMessages.differentNeeds
                  .internationalSchoolSupportAlertMessage
              : newPrimarySchoolMessages.differentNeeds.supportAlertMessage
          },
          doesNotRequireAnswer: true,
          alertType: 'warning',
          marginTop: 4,
        }),
        buildCheckboxField({
          id: 'support.requestingMeeting',
          description:
            newPrimarySchoolMessages.differentNeeds.requestingMeeting,
          options: [
            {
              value: YES,
              label:
                newPrimarySchoolMessages.differentNeeds
                  .requestingMeetingDescription,
            },
          ],
        }),
        buildHiddenInput({
          id: 'support.triggerHiddenInput',
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
