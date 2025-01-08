import {
  buildDividerField,
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
          id: 'basicSlider1',
          title: 'Basic slider',
          min: 1,
          max: 10,
        }),
        buildDividerField({ title: 'Some text'}),
        buildDividerField({ marginTop: 5, marginBottom: 5}),
        buildDividerField({ title: 'Some text'}),
        buildSliderField({
          id: 'basicSlider2',
          title: 'Basic slider',
          min: 1,
          max: 10,
          showLabel: true,
          showToolTip: true,
          trackStyle: { gridTemplateRows: 10 },
          calculateCellStyle: () => {
            return {
              background: '#fff2f6',
            }
          },
          label: {
            singular: 'day',
            plural: 'days',
          },
        }),
        buildDividerField({ title: 'Some text'}),
        buildDividerField({ marginTop: 5, marginBottom: 5}),
        buildDividerField({ title: 'Some text'}),
        buildSliderField({
          id: 'giveRights.giveDays',
          title: '',
          label: {
            singular: 'day',
            plural: 'days',
          },
          min: 1,
          max: 10,
          step: 1,
          defaultValue: 1,
          showMinMaxLabels: true,
          showToolTip: true,
          showRemainderOverlay: true,
          showProgressOverlay: true,
          trackStyle: { gridTemplateRows: 8 },
          rangeDates: {
            start: {
              date: new Date('2024-01-01'),
              message: 'Start date',
            },
            end: {
              date: new Date('2024-01-10'),
              message: 'End date',
            },
          },
          calculateCellStyle: () => {
            return {
              background: '#421c63',
            }
          },
          saveAsString: true,
          marginBottom: 5,
        }),
        buildSliderField({
          id: 'giveRights.giveDays',
          title: '',
          label: {
            singular: 'day',
            plural: 'days',
          },
          min: 1,
          max: 10,
          step: 1,
          defaultValue: 1,
          showMinMaxLabels: true,
          showToolTip: true,
          showRemainderOverlay: true,
          showProgressOverlay: false,
          trackStyle: { gridTemplateRows: 8 },
          rangeDates: {
            start: {
              date: new Date('2024-01-01'),
              message: 'Start date',
            },
            end: {
              date: new Date('2024-01-10'),
              message: 'End date',
            },
          },
          calculateCellStyle: () => {
            return {
              background: '#421c63',
            }
          },
          saveAsString: true,
          marginBottom: 5,
        }),
        buildSliderField({
          id: 'giveRights.giveDays',
          title: '',
          label: {
            singular: 'day',
            plural: 'days',
          },
          min: 1,
          max: 10,
          step: 1,
          defaultValue: 1,
          showMinMaxLabels: true,
          showToolTip: true,
          showRemainderOverlay: false,
          showProgressOverlay: true,
          trackStyle: { gridTemplateRows: 8 },
          rangeDates: {
            start: {
              date: new Date('2024-01-01'),
              message: 'Start date',
            },
            end: {
              date: new Date('2024-01-10'),
              message: 'End date',
            },
          },
          calculateCellStyle: () => {
            return {
              background: '#421c63',
            }
          },
          saveAsString: true,
          marginBottom: 5,
        }),
        buildSliderField({
          id: 'giveRights.giveDays',
          title: '',
          label: {
            singular: 'day',
            plural: 'days',
          },
          min: 1,
          max: 10,
          step: 1,
          defaultValue: 1,
          showMinMaxLabels: true,
          showToolTip: true,
          showRemainderOverlay: false,
          showProgressOverlay: false,
          trackStyle: { gridTemplateRows: 8 },
          rangeDates: {
            start: {
              date: new Date('2024-01-01'),
              message: 'Start date',
            },
            end: {
              date: new Date('2024-01-10'),
              message: 'End date',
            },
          },
          calculateCellStyle: () => {
            return {
              background: '#421c63',
            }
          },
          saveAsString: true,
          marginBottom: 5,
        }),
        /*
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
        }),*/
      ],
    }),
  ],
})
