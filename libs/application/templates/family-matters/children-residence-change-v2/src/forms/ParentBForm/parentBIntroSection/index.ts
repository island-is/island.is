import { buildCustomField, buildSection } from '@island.is/application/core'
import * as m from '../../../lib/messages'

export const parentBIntroSection = buildSection({
  id: 'parentBIntro',
  title: m.parentBIntro.general.sectionTitle,
  children: [
    buildCustomField({
      id: 'acceptContract',
      title: m.parentBIntro.general.pageTitle,
      component: 'ParentBIntro',
    }),
  ],
})
