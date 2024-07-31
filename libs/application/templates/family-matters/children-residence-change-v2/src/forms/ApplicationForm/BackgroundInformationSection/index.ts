import { buildSection } from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { selectChildInCustodySubSection } from './selectChildInCustodySubSection'
import { contactSubSection } from './contactSubSection'

export const backgroundInformationSection = buildSection({
  id: 'backgroundInformation',
  title: m.section.backgroundInformation,
  children: [selectChildInCustodySubSection, contactSubSection],
})
