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
      description: overview.general.descriptionAssignee,
      children: [
        buildOverviewField({
          id: 'overviewApplicant',
          title: '',
          bottomLine: false,
          items: (answers, externalData) =>
            getApplicantOverviewInformation(answers, externalData, true),
        }),
        buildOverviewField({
          id: 'overviewMachineTenure',
          title: '',
          bottomLine: false,
          items: getMachineTenureOverviewInformation,
        }),
        buildOverviewField({
          id: 'overviewAssignee',
          title: '',
          bottomLine: false,
          items: getAssigneeOverviewInformation,
          condition: (answers) => !isContractor(answers),
        }),
        buildHiddenInput({
          id: 'rejected',
        }),
        buildCustomField({
          id: 'reviewOverviewSection.handleReject',
          title: '',
          component: 'HandleReject',
        }),
        buildSubmitField({
          id: 'submitReview',
          placement: 'footer',
          title: overview.general.approveButton,
          refetchApplicationAfterSubmit: true,
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
      ],
    }),
  ],
})
