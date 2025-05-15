import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { SubSection } from '@island.is/application/types'
import { Routes } from '../../../utils/enums'
import { registerProperty } from '../../../lib/messages'

export const RentalHousingPropertySearch: SubSection = buildSubSection({
  id: Routes.PROPERTYINFORMATION,
  title: registerProperty.search.subsectionName,
  children: [
    buildMultiField({
      id: Routes.PROPERTYSEARCH,
      title: registerProperty.search.pageTitle,
      description: registerProperty.search.pageDescription,
      children: [
        buildCustomField({
          id: Routes.PROPERTYSEARCH,
          component: 'PropertySearch',
        }),
      ],
    }),
  ],
})
