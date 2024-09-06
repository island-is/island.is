import { buildMultiField, buildSubSection } from '@island.is/application/core'

export const overviewSubSection = buildSubSection({
  id: 'overviewSubSection',
  title: '',
  children: [
    buildMultiField({
      id: 'overview',
      title: '',
      children: [],
    }),
  ],
})
