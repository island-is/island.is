import {
  buildActionCardListField,
  buildForm,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Logo } from '../assets/Logo'
import { applicationStatus } from '../lib/messages'
import { TrainingLicenseOnAWorkMachineAnswers } from '../lib/dataSchema'

export const ApplicantReview: Form = buildForm({
  id: 'ApplicantReview',
  title: '',
  logo: Logo,
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
              items: (application) => {
                const assigneeInformation = getValueViaPath<
                  TrainingLicenseOnAWorkMachineAnswers['assigneeInformation']
                >(application.answers, 'assigneeInformation')
                return (
                  assigneeInformation?.companyAndAssignee?.map(
                    ({ workMachine }) => ({
                      heading: {
                        ...applicationStatus.labels.actionCardTitle,
                        values: { value: workMachine.join(', ') },
                      },
                      tag: {
                        label: applicationStatus.labels.actionCardTag, // TODO: Make conditional
                        outlined: false,
                        variant: 'purple',
                      },
                      text: applicationStatus.labels.actionCardMessage,
                    }),
                  ) ?? []
                )
              },
            }),
          ],
        }),
      ],
    }),
  ],
})
