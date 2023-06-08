import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildRadioField,
  buildCustomField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Answer, Application } from '@island.is/application/types'

export const StaysAbroadSubSection = buildSubSection({
  id: 'staysAbroad',
  title: information.labels.staysAbroad.subSectionTitle,
  children: [
    buildMultiField({
      id: 'staysAbroadMultiField',
      title: information.labels.staysAbroad.pageTitle,
      children: [
        buildCustomField({
          id: 'staysAbroad',
          title: '',
          component: 'StaysAbroad',
        }),
      ],
    }),
  ],
})
