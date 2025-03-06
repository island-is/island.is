import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Routes } from '../../../lib/constants'

export const StaysAbroadSubSection = buildSubSection({
  id: Routes.STAYSABROAD,
  title: information.labels.staysAbroad.subSectionTitle,
  children: [
    buildMultiField({
      id: Routes.STAYSABROAD,
      title: information.labels.staysAbroad.pageTitle,
      children: [
        buildCustomField({
          id: 'staysAbroad',
          component: 'StaysAbroad',
        }),
      ],
    }),
  ],
})
