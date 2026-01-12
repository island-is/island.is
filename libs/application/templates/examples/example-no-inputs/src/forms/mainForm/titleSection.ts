import {
  buildMultiField,
  buildSection,
  buildTitleField,
} from '@island.is/application/core'

export const titleSection = buildSection({
  id: 'titleSection',
  title: 'Title',
  children: [
    buildMultiField({
      id: 'titleMultiField',
      title: 'BuildTitleField',
      children: [
        buildTitleField({
          title:
            'The title form field is a simpler version of the description field, but with the ability to customize color.',
          titleVariant: 'h3',
          marginTop: 0,
          marginBottom: 3,
        }),
        buildTitleField({
          title: 'This is a simple H1 title',
          titleVariant: 'h1',
          marginTop: 0,
          marginBottom: 3,
        }),
        buildTitleField({
          title: 'This is a simple H2 title',
          titleVariant: 'h2',
          marginTop: 0,
          marginBottom: 3,
        }),
        buildTitleField({
          title: 'This is a simple H3 title',
          titleVariant: 'h3',
          marginTop: 0,
          marginBottom: 3,
        }),
        buildTitleField({
          title: 'This is a simple H4 title',
          titleVariant: 'h4',
          marginTop: 0,
          marginBottom: 3,
        }),
        buildTitleField({
          title: 'This is a simple H5 title',
          titleVariant: 'h5',
          marginTop: 0,
          marginBottom: 5,
        }),
        buildTitleField({
          title: 'This is a simple H1 title with a different color',
          titleVariant: 'h1',
          color: 'mint400',
          marginTop: 0,
          marginBottom: 3,
        }),
      ],
    }),
  ],
})
