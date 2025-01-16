import {
  buildAlertMessageField,
  buildCheckboxField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { NO, YES } from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/newPrimarySchoolUtils'

export const supportSubSection = buildSubSection({
  id: 'supportSubSection',
  title: newPrimarySchoolMessages.differentNeeds.supportSubSectionTitle,
  children: [
    buildMultiField({
      id: 'support',
      title: newPrimarySchoolMessages.differentNeeds.supportSubSectionTitle,
      description: newPrimarySchoolMessages.differentNeeds.supportDescription,
      children: [
        buildRadioField({
          id: 'support.developmentalAssessment',
          title:
            newPrimarySchoolMessages.differentNeeds.developmentalAssessment,
          width: 'half',
          required: true,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'yes-option',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-option',
              value: NO,
            },
          ],
        }),
        buildRadioField({
          id: 'support.specialSupport',
          title: newPrimarySchoolMessages.differentNeeds.specialSupport,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'yes-option',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-option',
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
              dataTestId: 'yes-option',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-option',
              value: NO,
            },
          ],
          condition: (answers) => {
            const { developmentalAssessment, specialSupport } =
              getApplicationAnswers(answers)

            return developmentalAssessment === YES || specialSupport === YES
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
              dataTestId: 'yes-option',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-option',
              value: NO,
            },
          ],
          condition: (answers) => {
            const {
              developmentalAssessment,
              specialSupport,
              hasIntegratedServices,
            } = getApplicationAnswers(answers)

            return (
              (developmentalAssessment === YES || specialSupport === YES) &&
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
              developmentalAssessment,
              specialSupport,
              hasIntegratedServices,
              hasCaseManager,
            } = getApplicationAnswers(answers)

            return (
              (developmentalAssessment === YES || specialSupport === YES) &&
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
              developmentalAssessment,
              specialSupport,
              hasIntegratedServices,
              hasCaseManager,
            } = getApplicationAnswers(answers)

            return (
              (developmentalAssessment === YES || specialSupport === YES) &&
              hasIntegratedServices === YES &&
              hasCaseManager === YES
            )
          },
        }),
        buildAlertMessageField({
          id: 'support.supportAlertMessage',
          title: newPrimarySchoolMessages.shared.alertTitle,
          message: newPrimarySchoolMessages.differentNeeds.supportAlertMessage,
          doesNotRequireAnswer: true,
          alertType: 'warning',
          marginTop: 4,
        }),
        buildCheckboxField({
          id: 'support.requestMeeting',
          title: '',
          description: newPrimarySchoolMessages.differentNeeds.requestMeeting,
          options: [
            {
              value: YES,
              label:
                newPrimarySchoolMessages.differentNeeds
                  .requestMeetingDescription,
            },
          ],
        }),
      ],
    }),
  ],
})
