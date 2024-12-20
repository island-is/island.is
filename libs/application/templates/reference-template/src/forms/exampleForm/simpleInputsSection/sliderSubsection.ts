import {
  buildMultiField,
  buildSliderField,
  buildSubSection,
} from '@island.is/application/core'

export const sliderSubsection = buildSubSection({
  id: 'sliderSubsection',
  title: 'Slider Field',
  children: [
    buildMultiField({
      id: 'slider',
      title: '',
      children: [
        buildSliderField({
          id: 'basicSlider',
          title: 'Basic slider',
          min: 1,
          max: 10,
          trackStyle: { gridTemplateRows: 5 },
          calculateCellStyle: () => {
            return {
              background: 'ccccd8',
            }
          },
          label: {
            singular: 'day',
            plural: 'days',
          },
        }),
        buildSliderField({
          id: 'basicSliderWithLabels',
          title: 'Slider with labels',
          min: 1,
          max: 10,
          trackStyle: { gridTemplateRows: 5 },
          calculateCellStyle: () => {
            return {
              background: 'ccccd8',
            }
          },
          label: {
            singular: 'day',
            plural: 'days',
          },
          showMinMaxLabels: true,
          showLabel: true,
          showToolTip: true,
        }),
        buildSliderField({
          id: 'basicSliderWithProgressOverlay',
          title: 'Slider with progress overlay',
          min: 1,
          max: 10,
          trackStyle: { gridTemplateRows: 5 },
          calculateCellStyle: () => {
            return {
              background: 'ccccd8',
            }
          },
          label: {
            singular: 'day',
            plural: 'days',
          },
          showRemainderOverlay: true,
          showProgressOverlay: true,
        }),
        buildSliderField({
          id: 'basicSliderRangeDates',
          title: 'Slider with range dates',
          min: 1,
          max: 10,
          trackStyle: { gridTemplateRows: 5 },
          calculateCellStyle: () => {
            return {
              background: 'ccccd8',
            }
          },
          label: {
            singular: 'day',
            plural: 'days',
          },
          rangeDates: {
            start: {
              date: '2024-01-01',
              message: 'Start date',
            },
            end: {
              date: '2024-01-10',
              message: 'End date',
            },
          },
          showToolTip: true,
        }),
        buildSliderField({
          id: 'basicSliderWithSteps',
          title: 'Slider with steps',
          min: 1,
          max: 10,
          step: 2,
          trackStyle: { gridTemplateRows: 5 },
          calculateCellStyle: () => {
            return {
              background: 'ccccd8',
            }
          },
          label: {
            singular: 'day',
            plural: 'days',
          },
        }),

        buildSliderField({
          id: 'thickSlider',
          title: 'Thick slider',
          min: 0,
          max: 100,
          step: 1,
          label: {
            singular: 'day',
            plural: 'days',
          },
          defaultValue: 5,
          trackStyle: { gridTemplateRows: 200 },
          calculateCellStyle: () => {
            return {
              background: 'ccccd8',
            }
          },
        }),
      ],
    }),
  ],
})
