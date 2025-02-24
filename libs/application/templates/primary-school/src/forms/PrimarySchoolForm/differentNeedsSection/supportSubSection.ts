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
import { primarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/primarySchoolUtils'

export const supportSubSection = buildSubSection({
  id: 'supportSubSection',
  title: primarySchoolMessages.differentNeeds.supportSubSectionTitle,
  children: [
    buildMultiField({
      id: 'support',
      title: primarySchoolMessages.differentNeeds.supportSubSectionTitle,
      description: (application) => {
        const { applicationType } = getApplicationAnswers(application.answers)

        return applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
          ? primarySchoolMessages.differentNeeds.enrollmentSupportDescription
          : primarySchoolMessages.differentNeeds.supportDescription
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
              ? primarySchoolMessages.differentNeeds.enrollmentHasDiagnoses
              : primarySchoolMessages.differentNeeds.hasDiagnoses
          },
          width: 'half',
          required: true,
          options: [
            {
              label: primarySchoolMessages.shared.yes,
              dataTestId: 'yes-option',
              value: YES,
            },
            {
              label: primarySchoolMessages.shared.no,
              dataTestId: 'no-option',
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
              ? primarySchoolMessages.differentNeeds.enrollmentHasHadSupport
              : primarySchoolMessages.differentNeeds.hasHadSupport
          },
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: primarySchoolMessages.shared.yes,
              dataTestId: 'yes-option',
              value: YES,
            },
            {
              label: primarySchoolMessages.shared.no,
              dataTestId: 'no-option',
              value: NO,
            },
          ],
        }),
        buildRadioField({
          id: 'support.hasIntegratedServices',
          title: primarySchoolMessages.differentNeeds.hasIntegratedServices,
          description:
            primarySchoolMessages.differentNeeds
              .hasIntegratedServicesDescription,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: primarySchoolMessages.shared.yes,
              dataTestId: 'yes-option',
              value: YES,
            },
            {
              label: primarySchoolMessages.shared.no,
              dataTestId: 'no-option',
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
          title: primarySchoolMessages.differentNeeds.hasCaseManager,
          description:
            primarySchoolMessages.differentNeeds.hasCaseManagerDescription,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: primarySchoolMessages.shared.yes,
              dataTestId: 'yes-option',
              value: YES,
            },
            {
              label: primarySchoolMessages.shared.no,
              dataTestId: 'no-option',
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
          title: primarySchoolMessages.differentNeeds.caseManagerName,
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
          title: primarySchoolMessages.differentNeeds.caseManagerEmail,
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
          title: primarySchoolMessages.shared.alertTitle,
          message: (application) => {
            const { applicationType } = getApplicationAnswers(
              application.answers,
            )

            return applicationType ===
              ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
              ? primarySchoolMessages.differentNeeds
                  .enrollmentSupportAlertMessage
              : primarySchoolMessages.differentNeeds.supportAlertMessage
          },
          doesNotRequireAnswer: true,
          alertType: 'warning',
          marginTop: 4,
        }),
        buildCheckboxField({
          id: 'support.requestingMeeting',
          description: primarySchoolMessages.differentNeeds.requestingMeeting,
          options: [
            {
              value: YES,
              label:
                primarySchoolMessages.differentNeeds
                  .requestingMeetingDescription,
            },
          ],
        }),
      ],
    }),
  ],
})
