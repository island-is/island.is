import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { Routes } from '../../../utils/enums'
import * as m from '../../../lib/messages'

export const propertySearchSubsection = buildSubSection({
  id: Routes.REGISTERPROPERTY,
  title: m.propertySearch.search.subsectionName,
  children: [
    buildMultiField({
      id: Routes.PROPERTYSEARCH,
      title: m.propertySearch.search.pageTitle,
      description: m.propertySearch.search.pageDescription,
      children: [
        buildCustomField({
          id: Routes.PROPERTYSEARCH,
          component: 'PropertySearch',
        }),
        buildDescriptionField({
          id: Routes.PROPERTYSEARCH,
          description: m.propertySearch.search.spouseFamilyNotice,
          marginTop: 2,
        }),
      ],
    }),
  ],
})
