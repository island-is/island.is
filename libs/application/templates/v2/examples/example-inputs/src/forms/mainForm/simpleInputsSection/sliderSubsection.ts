import { SubSectionBuilder } from '@island.is/application/core'
import { theme } from '@island.is/island-ui/theme'

export const sliderSubsection = new SubSectionBuilder(
  'sliderSubsection',
  'Slider Field',
)
  .addPage('basicSlider1', '', (page) => {
    page
      .addTitleField('Minimal slider field')
      .addSliderField('basicSlider', 'Basic slider', {
        min: 1,
        max: 10,
        doesNotRequireAnswer: true,
      })
      .addDividerField({ useDividerLine: false })
      .addTitleField('Minimal slider field without default background')
      .addSliderField('basicSliderWithDefaultBackground', 'Basic slider', {
        min: 1,
        max: 10,
        showRemainderOverlay: false,
        doesNotRequireAnswer: true,
      })
      .addDividerField({ useDividerLine: false })
      .addTitleField('Minimal slider field with custom background')
      .addSliderField('basicSliderWithCustomBackground', 'Basic slider', {
        min: 1,
        max: 10,
        showRemainderOverlay: false,
        calculateCellStyle: () => {
          return {
            background: theme.color.black,
          }
        },
        doesNotRequireAnswer: true,
      })
      .addDividerField({ useDividerLine: false })
      .addTitleField('Minimal slider field with tooltip')
      .addSliderField('basicSliderTooltip', 'Basic slider', {
        min: 1,
        max: 10,
        showToolTip: true,
        label: {
          singular: 'day',
          plural: 'days',
        },
        doesNotRequireAnswer: true,
      })
      .addDividerField({ useDividerLine: false })
      .addTitleField('Thick slider field with tooltip')
      .addSliderField('thickSliderTooltip', 'Basic slider', {
        min: 1,
        max: 10,
        trackStyle: { gridTemplateRows: 16 },
        showToolTip: true,
        label: {
          singular: 'day',
          plural: 'days',
        },
        doesNotRequireAnswer: true,
      })
      .addDividerField({ useDividerLine: false })
      .addTitleField('Slider field with different colors and label')
      .addSliderField('basicSliderColorLabels', 'Basic slider', {
        min: 1,
        max: 10,
        textColor: theme.color.red600,
        progressOverlayColor: theme.color.yellow600,
        showLabel: true,
        label: {
          singular: 'day',
          plural: 'days',
        },
        calculateCellStyle: () => {
          return {
            background: theme.color.red600,
          }
        },
        doesNotRequireAnswer: true,
      })
      .addDividerField({ useDividerLine: false })
      .addTitleField('Slider field with different colors, label and tooltip')
      .addSliderField('basicSliderColorLabelsAndTooltip', 'Basic slider', {
        min: 1,
        max: 10,
        textColor: theme.color.red600,
        progressOverlayColor: theme.color.yellow600,
        showLabel: true,
        showToolTip: true,
        label: {
          singular: 'day',
          plural: 'days',
        },
        doesNotRequireAnswer: true,
      })
      .addDividerField({ useDividerLine: false })
      .addTitleField('Slider field with different colors and min max label')
      .addSliderField('basicSliderColorMinMaxLabels', 'Basic slider', {
        min: 1,
        max: 10,
        textColor: theme.color.red600,
        progressOverlayColor: theme.color.yellow600,
        showMinMaxLabels: true,
        label: {
          singular: 'day',
          plural: 'days',
        },
        doesNotRequireAnswer: true,
      })
      .addDividerField({ useDividerLine: false })
      .addTitleField(
        'Slider field with different colors, min max label and tooltip',
      )
      .addSliderField('basicSliderColorMinMaxLabelsTooltip', 'Basic slider', {
        min: 1,
        max: 10,
        textColor: theme.color.red600,
        progressOverlayColor: theme.color.yellow600,
        showMinMaxLabels: true,
        showToolTip: true,
        label: {
          singular: 'day',
          plural: 'days',
        },
        doesNotRequireAnswer: true,
      })
      .addDividerField({ useDividerLine: false })
      .addTitleField('Slider field with different colors and both labels')
      .addSliderField('basicSliderColorBothLabels', 'Basic slider', {
        min: 1,
        max: 10,
        textColor: theme.color.red600,
        progressOverlayColor: theme.color.yellow600,
        showLabel: true,
        showMinMaxLabels: true,
        label: {
          singular: 'day',
          plural: 'days',
        },
        doesNotRequireAnswer: true,
      })
      .addDividerField({ useDividerLine: false })
      .addTitleField('Slider field with different colors and all labels')
      .addSliderField('basicSliderAllLabels', 'Basic slider', {
        min: 1,
        max: 10,
        textColor: theme.color.purple400,
        progressOverlayColor: theme.color.red400,
        showLabel: true,
        showMinMaxLabels: true,
        showToolTip: true,
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
        doesNotRequireAnswer: true,
      })
      .addDividerField({ useDividerLine: false })
      .addTitleField(
        'Slider field with different colors, all labels and different default value',
      )
      .addSliderField('basicSliderAllLabelsDefaultValue', 'Basic slider', {
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
        doesNotRequireAnswer: true,
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
        saveAsString: true,
      })
      .addDividerField({ useDividerLine: false })
  })
  .build()
