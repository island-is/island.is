import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const StaysAbroadSubSection = (index: number) =>
  buildSubSection({
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
