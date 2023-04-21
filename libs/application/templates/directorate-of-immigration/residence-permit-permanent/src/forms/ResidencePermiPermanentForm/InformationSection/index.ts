import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { TestSubSection } from './TestSubSection'

export const InformationSection = (index: number) =>
  buildSection({
    id: `information${index}`,
    title: {
      ...information.general.sectionTitleWithPerson,
      values: { person: (index + 1).toString() },
    },
    children: [TestSubSection],
  })
