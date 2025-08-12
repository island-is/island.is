import {
  buildCustomField,
  buildHiddenInput,
  buildMultiField,
  buildOverviewField,
  buildSection,
} from '@island.is/application/core'
import { overview } from '../../lib/messages'
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
          items: (answers) => getApplicantOverviewInformation(answers, true),
        }),
        buildOverviewField({
          id: 'overviewMachineTenure',
          title: '',
          bottomLine: false,
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
          id: 'reviewOverviewSection.handleApprove',
          title: '',
          component: 'HandleApproveOrReject',
        }),
      ],
    }),
  ],
})
