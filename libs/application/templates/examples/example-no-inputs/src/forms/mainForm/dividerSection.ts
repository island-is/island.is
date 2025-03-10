import {
  buildDividerField,
  buildMultiField,
  buildSection,
  buildTitleField,
} from '@island.is/application/core'

export const dividerSection = buildSection({
  id: 'dividerSection',
  title: 'Divider',
  children: [
    buildMultiField({
      id: 'dividerMultiField',
      title: 'BuildDividerField',
      children: [
        buildTitleField({
          title: 'Below this is a divider line:',
          marginTop: 0,
          marginBottom: 0,
        }),
        buildDividerField({}),
        buildTitleField({
          title: 'Below this is a divider with no line, only margin:',
          marginTop: 0,
          marginBottom: 0,
        }),
        buildDividerField({
          useDividerLine: false,
          marginTop: 7,
          marginBottom: 7,
        }),
        buildTitleField({
          title: 'Look at all that space:',
          marginTop: 0,
          marginBottom: 0,
        }),
      ],
    }),
  ],
})
