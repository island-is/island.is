import {
  buildDividerField,
  buildMultiField,
  buildSliderField,
  buildSubSection,
  buildTitleField,
} from '@island.is/application/core'
import { theme } from '@island.is/island-ui/theme'

export const sliderSubsection = buildSubSection({
  id: 'sliderSubsection',
  title: 'Slider Field',
  children: [
    buildMultiField({
      id: 'basicSlider1',
      title: '',
      children: [
        buildTitleField({title: 'Minimal slider field'}),
        buildSliderField({
          id: 'basicSlider',
          title: 'Basic slider',
          min: 1,
          max: 10,
        }),
        buildDividerField({ useDividerLine: false }),

        buildTitleField({title: 'Minimal slider field with default background'}),
        buildSliderField({
          id: 'basicSliderWithDefaultBackground',
          title: 'Basic slider',
          min: 1,
          max: 10,
          showRemainderOverlay: true,
        }),
        buildDividerField({ useDividerLine: false }),

        buildTitleField({title: 'Minimal slider field with custom background'}),
        buildSliderField({
          id: 'basicSliderWithCustomBackground',
          title: 'Basic slider',
          min: 1,
          max: 10,
          calculateCellStyle: () => {
            return {
              background: theme.color.black,
            }
          },
        }),
        buildDividerField({ useDividerLine: false }),

        buildTitleField({title: 'Minimal slider field with tooltip'}),
        buildSliderField({
          id: 'basicSliderTooltip',
          title: 'Basic slider',
          min: 1,
          max: 10,
          showToolTip: true,
          label: {
            singular: 'day',
            plural: 'days',
          },
        }),
        buildDividerField({ useDividerLine: false }),

        buildTitleField({title: 'Thick slider field with tooltip'}),
        buildSliderField({
          id: 'thickSliderTooltip',
          title: 'Basic slider',
          min: 1,
          max: 10,
          trackStyle: { gridTemplateRows: 16 },
          showToolTip: true,
          label: {
            singular: 'day',
            plural: 'days',
          },
        }),
        buildDividerField({ useDividerLine: false }),

        buildTitleField({title: 'Slider field with different colors and label'}),
        buildSliderField({
          id: 'basicSliderColorLabels',
          title: 'Basic slider',
          min: 1,
          max: 10,
          textColor: theme.color.red600,
          progressOverlayColor: theme.color.yellow600,
          showLabel: true,
          label: {
            singular: 'day',
            plural: 'days',
          },
        }),
        buildDividerField({ useDividerLine: false }),

        buildTitleField({title: 'Slider field with different colors and all labels'}),
        buildSliderField({
          id: 'basicSliderAllLabels',
          title: 'Basic slider',
          min: 1,
          max: 10,
          textColor: theme.color.purple400,
          progressOverlayColor: theme.color.red400,
          showLabel: true,
          showMinMaxLabels: true,
          showToolTip: true,
          showRemainderOverlay: true,
          label: {
            singular: 'day',
            plural: 'days',
          },
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
        }),
        buildDividerField({ useDividerLine: false }),
        
        buildTitleField({title: 'Slider field with different colors, all labels and different default value'}),
        buildSliderField({
          id: 'basicSliderAllLabelsDefaultValue',
          title: 'Basic slider',
          min: 6,
          max: 12,
          defaultValue: 6,
          currentIndex: 6,
          step: 2,
          textColor: theme.color.purple400,
          progressOverlayColor: theme.color.red400,
          showLabel: true,
          showMinMaxLabels: true,
          showToolTip: true,
          showRemainderOverlay: true,
          label: {
            singular: 'day',
            plural: 'days',
          },
          rangeDates: {
            start: {
              date: new Date('2024-01-06'),
              message: 'Start date',
            },
            end: {
              date: new Date('2024-01-12'),
              message: 'End date',
            },
          },
          calculateCellStyle: () => {
            return {
              background: theme.color.blue200,
            }
          },
          saveAsString: true
        }),
        buildDividerField({ useDividerLine: false }),
/*
        buildSliderField({
          id: 'basicSlider3',
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

          id: 'slider2',
          title: '',
          textColor: theme.color.feedbackTagsYellowBackground,
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
          progressOverlayColor: 'red200',
          trackStyle: { gridTemplateRows: 16 },
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
              background: theme.color.dark200,
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
        */
      ],
    }),
  ],
})
