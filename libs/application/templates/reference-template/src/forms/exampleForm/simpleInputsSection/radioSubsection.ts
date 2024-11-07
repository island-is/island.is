import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import {
  defaultRadioOption,
  radioIllustrationOptions,
  radioOptions,
} from '../../../utils/options'

export const radioSubsection = buildSubSection({
  id: 'radio',
  title: 'Radio',
  children: [
    buildMultiField({
      id: 'radioMultiField',
      title: 'Radio fields',
      children: [
        buildRadioField({
          id: 'radio',
          title: 'Full width radio',
          options: radioOptions,
        }),
        buildRadioField({
          id: 'halfRadio',
          title: 'Half width radio',
          width: 'half',
          options: radioOptions,
        }),
        buildRadioField({
          id: 'smallButtonsRadio',
          title: 'Small radio buttons',
          options: radioOptions,
          largeButtons: false,
        }),
        buildRadioField({
          id: 'radioIllustrations',
          title: 'Radio with illustrations',
          options: radioIllustrationOptions,
          widthWithIllustration: '1/3',
          hasIllustration: true,
        }),
        buildRadioField({
          id: 'defaultRadio',
          title: 'Radio with a default value',
          options: radioOptions,
          defaultValue: defaultRadioOption,
        }),
        buildRadioField({
          id: 'WhiteBackgroundRadio',
          title: 'White background (try to use blue if possible)',
          options: radioOptions,
          backgroundColor: 'white',
        }),
      ],
    }),
  ],
})
