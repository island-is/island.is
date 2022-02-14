import { buildCustomField, buildSection } from '@island.is/application/core'
import { inReview } from '../../lib/messages'

export const applicationStatusSection = (isAssignee?: boolean) =>
  buildSection({
    id: 'informationAboutApplicantSection',
    title: inReview.general.title,
    children: [
      buildCustomField(
        {
          id: 'applicationStatusScreen',
          title: '',
          component: 'ApplicationStatus',
        },
        {
          isAssignee,
        },
      ),
    ],
  })
