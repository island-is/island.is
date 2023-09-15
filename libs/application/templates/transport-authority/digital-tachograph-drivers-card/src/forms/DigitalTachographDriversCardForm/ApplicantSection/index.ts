import { buildSection } from '@island.is/application/core'
import { applicant } from '../../../lib/messages'
import { userInformationSubSection } from './userInformationSubSection'
import { cardDeliverySubSection } from './cardDeliverySubSection'

export const applicantSection = buildSection({
  id: 'applicantSection',
  title: applicant.general.sectionTitle,
  children: [userInformationSubSection, cardDeliverySubSection],
})
