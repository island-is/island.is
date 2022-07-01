import {
  Application,
  buildMultiField,
  buildSubSection,
  buildTextField,
  buildCustomField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const subSectionPropertyRepeater = buildSubSection({
  id: 'info.properties',
  title: m.propertyInfoTitle,
  children: [
    buildMultiField({
      id: 'info.properties',
      title: m.propertyInfoSubtitle,
      description: m.propertyInfoDescription,
      children: [
        buildCustomField({
          id: 'properties',
          title: 'asd',
          component: 'PropertyRepeater',
        }),
      ],
    }),
  ],
})
