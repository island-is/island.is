import {
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { yesNoOptions } from '../../utils/options'
import * as m from '../../lib/messages'

export const appraisalMethodSection = buildSection({
  id: 'appraisalMethodSection',
  title: m.appraisalMethodMessages.title,
  children: [
    buildMultiField({
      id: 'appraisalMethod',
      title: m.appraisalMethodMessages.title,
      children: [
        buildRadioField({
          id: 'becauseOfRenovations',
          title: m.appraisalMethodMessages.becauseOfRenovations,
          width: 'half',
          options: yesNoOptions,
        }),
        buildRadioField({
          id: 'becauseOfAdditions',
          title: m.appraisalMethodMessages.becauseOfAdditions,
          width: 'half',
          options: yesNoOptions,
        }),
      ],
    }),
  ],
})
