import {
  buildDividerField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'

export const dividerSubsection = buildSubSection({
  id: 'dividerSubsection',
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
