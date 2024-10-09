import { buildSection } from '@island.is/application/core'
import { applicantInformation } from '../../lib/messages'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'
export const applicantInformationSection = buildSection({
  id: 'informationAboutApplicantSection',
  title: applicantInformation.general.title,
  condition: (_application, externalData) => {
    if (externalData.identity) {
      return false
    }
    return true
  },

  children: [applicantInformationMultiField()],
})
