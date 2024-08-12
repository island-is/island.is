import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages/information'
import { companySection } from './companySection'

export const informationSection = buildSection({
  id: 'informationSection',
  title: information.general.sectionTitle,
  children: [companySection],
})
