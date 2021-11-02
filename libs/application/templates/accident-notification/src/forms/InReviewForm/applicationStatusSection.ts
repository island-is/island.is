import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { inReview } from '../../lib/messages'

export const applicationStatusSection = buildSection({
  id: 'informationAboutApplicantSection',
  title: inReview.general.title,
  children: [
    buildCustomField({
      id: 'applicationStatusScreen',
      title: '',
      component: 'ApplicationStatus',
    }),
  ],
})
