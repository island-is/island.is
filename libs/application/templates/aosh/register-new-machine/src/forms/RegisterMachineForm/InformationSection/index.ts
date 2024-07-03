import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { ImporterInformationSubSection } from './ImporterInformation'

export const informationSection = buildSection({
  id: 'informationSection',
  title: information.general.sectionTitle,
  children: [ImporterInformationSubSection],
})
