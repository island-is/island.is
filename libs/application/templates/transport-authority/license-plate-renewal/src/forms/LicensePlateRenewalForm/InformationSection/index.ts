import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { pickPlateSubSection } from './pickPlateSubSection'

export const informationSection = buildSection({
  id: 'informationSection',
  title: information.general.sectionTitle,
  children: [pickPlateSubSection],
})
