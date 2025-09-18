import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { Routes } from '../../../utils/enums'
import * as m from '../../../lib/messages'

export const propertySearchSubsection = buildSubSection({
  id: Routes.REGISTERPROPERTY,
  title: m.registerProperty.search.subsectionName,
  children: [
    buildMultiField({
      id: Routes.PROPERTYSEARCH,
      title: m.registerProperty.search.pageTitle,
      description: m.registerProperty.search.pageDescription,
      children: [
        buildCustomField({
          id: Routes.PROPERTYSEARCH,
          component: 'PropertySearch',
        }),
      ],
    }),
  ],
})
