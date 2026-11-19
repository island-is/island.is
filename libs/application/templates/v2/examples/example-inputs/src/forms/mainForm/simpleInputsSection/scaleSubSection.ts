import { SubSectionBuilder } from '@island.is/application/core'

export const scaleSubSection = new SubSectionBuilder(
  'scaleSubSection',
  'Scale Field',
)
  .addPage('basicScale', 'Scale fields', (page) => {
    page
      .addScaleField('basicScale', 'Basic scale', {
        min: 1,
        max: 10,
        doesNotRequireAnswer: true,
        marginBottom: 2,
      })
      .addDividerField({ useDividerLine: false })
      .addScaleField(
        'basicScaleWithLabels',
        'Basic scale with max/min labels',
        {
          min: 1,
          max: 10,
          minLabel: 'minLabel',
          maxLabel: 'maxLabel',
          showLabels: true,
          marginTop: 2,
        },
      )
  })
  .build()
