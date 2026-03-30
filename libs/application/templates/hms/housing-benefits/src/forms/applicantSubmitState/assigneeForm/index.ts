import {
  buildAlertMessageField,
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { applicantSubmitMessages as m } from '../../../lib/messages/applicantSubmitMessages'

/** Read-only conclusion for assignees: applicant must submit the application. */
export const ApplicantSubmitFormAssigneeVersion = buildForm({
  id: 'ApplicantSubmitAssignee',
  mode: FormModes.IN_PROGRESS,
  logo: HmsLogo,
  children: [
    buildSection({
      id: 'applicantSubmitAssigneeSection',
      tabTitle: m.assigneeFormTitle,
      children: [
        buildMultiField({
          id: 'applicantSubmitAssigneeMultiField',
          title: m.assigneeFormTitle,
          children: [
            buildAlertMessageField({
              id: 'applicantSubmitAssigneeNextSteps',
              title: m.assigneeAlertTitle,
              message: m.assigneeAlertMessage,
              alertType: 'info',
              doesNotRequireAnswer: true,
              marginBottom: 4,
            }),
          ],
        }),
      ],
    }),
  ],
})
