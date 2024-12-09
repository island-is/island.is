import {
  buildDividerField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Colors } from '@island.is/island-ui/theme'

export const dividerSection = buildSection({
  id: 'dividerSection',
  title: 'Divider',
  children: [
    buildMultiField({
      id: 'dividerMultiField',
      title: 'Divider',
      children: [
        buildDividerField({}),
        buildDividerField({
          title: 'Divider with title',
        }),
        buildDividerField({
          color: 'red600',
        }),
      ],
    }),
  ],
})
