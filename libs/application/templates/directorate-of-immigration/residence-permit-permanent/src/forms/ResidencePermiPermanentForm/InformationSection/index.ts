import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { TestSubSection } from './TestSubSection'

export const InformationSection = buildSection({
  id: 'information',
  title: information.general.sectionTitle,
  children: [TestSubSection],
})
