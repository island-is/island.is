import {
  buildAlertMessageField,
  buildCheckboxField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  NO,
  YES,
} from '@island.is/application/core'
import { ApplicationType } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/newPrimarySchoolUtils'

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
            const { hasDiagnoses, hasHadSupport } =
              getApplicationAnswers(answers)

            return hasDiagnoses === YES || hasHadSupport === YES
          },
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
            const { hasDiagnoses, hasHadSupport, hasIntegratedServices } =
              getApplicationAnswers(answers)

            return (
              (hasDiagnoses === YES || hasHadSupport === YES) &&
              hasIntegratedServices === YES
            )
          },
        }),
        buildTextField({
          id: 'support.caseManager.name',
          title: newPrimarySchoolMessages.differentNeeds.caseManagerName,
          width: 'half',
          required: true,
          condition: (answers) => {
            const {
              hasDiagnoses,
              hasHadSupport,
              hasIntegratedServices,
              hasCaseManager,
            } = getApplicationAnswers(answers)

            return (
              (hasDiagnoses === YES || hasHadSupport === YES) &&
              hasIntegratedServices === YES &&
              hasCaseManager === YES
            )
          },
        }),
        buildTextField({
          id: 'support.caseManager.email',
          title: newPrimarySchoolMessages.differentNeeds.caseManagerEmail,
          width: 'half',
          required: true,
          condition: (answers) => {
            const {
              hasDiagnoses,
              hasHadSupport,
              hasIntegratedServices,
              hasCaseManager,
            } = getApplicationAnswers(answers)

            return (
              (hasDiagnoses === YES || hasHadSupport === YES) &&
              hasIntegratedServices === YES &&
              hasCaseManager === YES
            )
          },
        }),
        buildAlertMessageField({
          id: 'support.supportAlertMessage',
          title: newPrimarySchoolMessages.shared.alertTitle,
          message: (application) => {
            const { applicationType } = getApplicationAnswers(
              application.answers,
            )

            return applicationType ===
              ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
              ? newPrimarySchoolMessages.differentNeeds
                  .enrollmentSupportAlertMessage
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
      ],
    }),
  ],
})
