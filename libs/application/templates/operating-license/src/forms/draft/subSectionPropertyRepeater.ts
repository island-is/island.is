import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
} from '@island.is/application/core'
import {
  APPLICATION_TYPES,
  Operation,
  OPERATION_CATEGORY,
  YES,
} from '../../lib/constants'
import { m } from '../../lib/messages'

export const subSectionPropertyRepeater = buildSubSection({
  id: 'info.properties',
  title: m.propertyInfoTitle,
  children: [
    buildMultiField({
      id: 'info.properties',
      title: m.propertyInfoSubtitle,
      description: m.propertyInfoDescription,
      children: [
        buildCustomField({
          id: 'properties.stay',
          title: m.stayTitle,
          component: 'PropertyRepeater',
          condition: (answers) =>
            (answers.applicationInfo as Operation)?.operation ===
            APPLICATION_TYPES.HOTEL,
        }),
        buildCustomField({
          id: 'properties.dining',
          title: m.diningTitle,
          component: 'PropertyRepeater',
          condition: (answers) => {
            const { operation, category } = answers.applicationInfo as Operation

            return (
              operation === APPLICATION_TYPES.RESTURANT ||
              (operation === APPLICATION_TYPES.HOTEL &&
                category !== OPERATION_CATEGORY.TWO)
            )
          },
        }),
        buildCustomField({
          id: 'properties.outside',
          title: m.outsideTitle,
          component: 'PropertyRepeater',
          condition: (answers) => {
            const { willServe } = answers.applicationInfo as Operation
            return willServe?.includes(YES) || false
          },
        }),
      ],
    }),
  ],
})
