import {
  buildActionCardListField,
  buildForm,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { AoshLogo } from '@island.is/application/assets/institution-logos'
import { applicationStatus } from '../lib/messages'
import { TrainingLicenseOnAWorkMachineAnswers } from '../lib/dataSchema'

export const ApplicantReview: Form = buildForm({
  id: 'ApplicantReview',
  title: '',
  logo: AoshLogo,
  mode: FormModes.IN_PROGRESS,
  children: [
    buildSection({
      id: 'applicationStatusSection',
      title: applicationStatus.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'applicationStatusSection.multiField',
          title: applicationStatus.general.title,
          description: applicationStatus.general.description,
          children: [
            buildActionCardListField({
              id: 'approvalActionCard',
              doesNotRequireAnswer: true,
              marginTop: 2,
              title: '',
              items: (application, _lang) => {
                const assigneeInformation = getValueViaPath<
                  TrainingLicenseOnAWorkMachineAnswers['assigneeInformation']
                >(application.answers, 'assigneeInformation')
                const approved =
                  getValueViaPath<string[]>(application.answers, 'approved') ??
                  []
                return (
                  assigneeInformation?.map(({ workMachine, assignee }) => ({
                    heading: {
                      ...applicationStatus.labels.actionCardTitle,
                      values: { value: workMachine.join(', ') },
                    },
                    tag: {
                      label: approved.includes(assignee.nationalId)
                        ? applicationStatus.labels.actionCardTagApproved
                        : applicationStatus.labels.actionCardTag,
                      outlined: false,
                      variant: approved.includes(assignee.nationalId)
                        ? 'mint'
                        : 'purple',
                    },
                    text: approved.includes(assignee.nationalId)
                      ? applicationStatus.labels.actionCardMessageApproved
                      : applicationStatus.labels.actionCardMessage,
                  })) ?? []
                )
              },
            }),
          ],
        }),
      ],
    }),
  ],
})
