import {
  buildDescriptionField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { overview } from '../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'
import {
  getApplicantOverviewInformation,
  getAssigneeOverviewInformation,
  isContractor,
} from '../../utils'
import { getMachineTenureOverviewInformation } from '../../utils/getMachineTenureInformation'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewSection.multiField',
      title: overview.general.pageTitle,
      description: overview.general.description,
      children: [
        buildOverviewField({
          id: 'overviewApplicant',
          title: '',
          backId: 'informationMultiField',
          bottomLine: false,
          items: (answers) => getApplicantOverviewInformation(answers),
        }),
        buildOverviewField({
          id: 'overviewMachineTenure',
          title: overview.labels.machineTenure,
          backId: 'certificateOfTenureMultiField',
          bottomLine: false,
          items: (answers, externalData, userNationalId) =>
            getMachineTenureOverviewInformation(
              answers,
              externalData,
              userNationalId,
            ),
        }),
        buildOverviewField({
          id: 'overviewAssignee',
          title: '',
          backId: 'assigneeInformationMultiField',
          bottomLine: false,
          items: (answers, externalData, userNationalId) =>
            getAssigneeOverviewInformation(
              answers,
              externalData,
              userNationalId,
            ),
          condition: (answers) => !isContractor(answers),
        }),
        buildDescriptionField({
          id: 'overviewSection.agreementText',
          title: overview.general.agreementText,
          titleVariant: 'h5',
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: overview.general.approveButton,
          refetchApplicationAfterSubmit: (event) =>
            event === DefaultEvents.SUBMIT,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: overview.general.approveButton,
              type: 'primary',
              condition: (answers) => isContractor(answers),
            },
            {
              event: DefaultEvents.ASSIGN,
              name: overview.general.approveButton,
              type: 'primary',
              condition: (answers) => !isContractor(answers),
            },
          ],
        }),
      ],
    }),
  ],
})
