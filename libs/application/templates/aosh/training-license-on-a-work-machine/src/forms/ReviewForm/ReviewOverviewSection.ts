import {
  buildCustomField,
  buildHiddenInput,
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

export const reviewOverviewSection = buildSection({
  id: 'reviewOverviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'reviewOverviewSection.multiField',
      title: overview.general.pageTitle,
      children: [
        buildOverviewField({
          id: 'overviewApplicant',
          title: '',
          // backId: unde,
          bottomLine: false,
          items: (answers, externalData) =>
            getApplicantOverviewInformation(answers, externalData, true),
        }),
        buildOverviewField({
          id: 'overviewApplicant',
          title: '',
          // backId: 'certificateOfTenureMultiField',
          bottomLine: false,
          items: getMachineTenureOverviewInformation,
        }),
        buildOverviewField({
          id: 'overviewAssignee',
          title: '',
          // backId: 'assigneeInformationMultiField',
          bottomLine: false,
          items: getAssigneeOverviewInformation,
          condition: (answers) => !isContractor(answers),
        }),
        buildCustomField(
          {
            id: 'reviewOverview',
            title: '',
            component: 'Overview',
          },
          {
            hideActionButtons: true,
          },
        ),
        buildSubmitField({
          id: 'submitReview',
          placement: 'footer',
          title: overview.general.approveButton,
          actions: [
            {
              event: DefaultEvents.REJECT,
              name: overview.general.rejectButton,
              type: 'reject',
            },
            {
              event: DefaultEvents.SUBMIT,
              name: overview.general.agreeButton,
              type: 'primary',
            },
          ],
        }),
        buildHiddenInput({
          id: 'rejected',
        }),
        buildCustomField({
          id: 'reviewOverviewSection.handleReject',
          title: '',
          component: 'HandleReject',
        }),
      ],
    }),
  ],
})
