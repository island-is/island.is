import {
  buildDividerField,
  buildMultiField,
  buildScaleField,
  buildSubSection,
} from '@island.is/application/core'

export const scaleSubSection = buildSubSection({
  id: 'scaleSubSection',
  title: 'Scale Field',
  children: [
    buildMultiField({
      id: 'basicScale',
      title: 'Scale fields',
      children: [
        buildScaleField({
          id: 'basicScale',
          title: 'Basic scale',
          min: 1,
          max: 10,
          doesNotRequireAnswer: true,
          marginBottom: 2,
        }),
        buildDividerField({ useDividerLine: false }),

        buildScaleField({
          id: 'basicScaleWithLabels',
          title: 'Basic scale with max/min labels',
          min: 1,
          max: 10,
          minLabel: 'minLabel',
          maxLabel: 'maxLabel',
          showLabels: true,
          marginTop: 2,
        }),
      ],
    }),
  ],
})
