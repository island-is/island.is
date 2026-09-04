import { SubSectionBuilder } from '@island.is/application/core'
import {
  defaultRadioOption,
  radioIllustrationOptions,
  radioOptions,
} from '../../../utils/options'

export const radioSubsection = new SubSectionBuilder('radio', 'Radio')
  .addPage('radioMultiField', 'Radio fields', (page) => {
    page
      .addRadioField('radio', 'Full width radio', {
        options: radioOptions,
      })
      .addRadioField('halfRadio', 'Half width radio', {
        width: 'half',
        options: radioOptions,
      })
      .addRadioField('smallButtonsRadio', 'Small radio buttons', {
        options: radioOptions,
        largeButtons: false,
      })
      .addRadioField('radioIllustrations', 'Radio with illustrations', {
        options: radioIllustrationOptions,
        widthWithIllustration: '1/3',
        hasIllustration: true,
      })
      .addRadioField('defaultRadio', 'Radio with a default value', {
        options: radioOptions,
        defaultValue: defaultRadioOption,
      })
      .addRadioField(
        'WhiteBackgroundRadio',
        'White background (try to use blue if possible)',
        {
          options: radioOptions,
          backgroundColor: 'white',
        },
      )
  })
  .build()
