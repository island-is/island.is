import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'

export const selectChildInCustodySubSection = buildSubSection({
  id: 'selectChildInCustody',
  title: m.selectChildren.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'selectChildInCustodyMultiField',
      title: m.selectChildren.general.pageTitle,
      description: m.selectChildren.general.description,
      children: [
        buildCustomField({
          id: 'selectedChildren',
          title: m.selectChildren.general.pageTitle,
          component: 'SelectChildren',
        }),
      ],
    }),
  ],
})
