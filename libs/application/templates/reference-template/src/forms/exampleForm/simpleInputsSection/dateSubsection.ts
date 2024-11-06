import { buildDateField, buildSubSection } from '@island.is/application/core'

export const dateSubsection = buildSubSection({
  id: 'date',
  title: 'Date',
  children: [
    buildDateField({
      id: 'date',
      title: 'Date',
    }),
  ],
})
