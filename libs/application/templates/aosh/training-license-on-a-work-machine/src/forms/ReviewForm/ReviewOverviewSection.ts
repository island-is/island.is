import {
  buildCustomField,
  buildHiddenInput,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
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
  title: '',
  children: [
    buildMultiField({
      id: 'reviewOverviewSection.multiField',
      title: overview.general.pageTitleAssignee,
      description: overview.general.descriptionAssignee,
      children: [
        buildOverviewField({
          id: 'overviewApplicant',
          title: '',
          bottomLine: false,
          items: (answers, externalData, userNationalId) =>
            getApplicantOverviewInformation(
              answers,
              externalData,
              userNationalId,
              true,
            ),
        }),
        buildOverviewField({
          id: 'overviewMachineTenure',
          title: '',
          bottomLine: false,
          width: 'half',
          items: (answers, externalData, userNationalId) =>
            getMachineTenureOverviewInformation(
              answers,
              externalData,
              userNationalId,
              true,
            ),
        }),
        buildOverviewField({
          id: 'overviewAssignee',
          title: '',
          bottomLine: false,
          items: (answers, externalData, userNationalId) =>
            getAssigneeOverviewInformation(
              answers,
              externalData,
              userNationalId,
              true,
            ),
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
              condition: (answers) => {
                const approved = getValueViaPath<string[]>(answers, 'approved')
                // Change...
                return approved?.includes('true') ?? true
              },
            },
            {
              event: DefaultEvents.APPROVE,
              name: overview.general.agreeButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
