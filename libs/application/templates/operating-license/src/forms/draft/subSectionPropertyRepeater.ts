import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
  YES,
} from '@island.is/application/core'
import {
  APPLICATION_TYPES,
  Operation,
  OPERATION_CATEGORY,
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
            return (
              (answers.applicationInfo as Operation)?.operation ===
                APPLICATION_TYPES.RESTURANT ||
              ((answers.applicationInfo as Operation)?.operation ===
                APPLICATION_TYPES.HOTEL &&
                (answers.applicationInfo as Operation)?.category !==
                  OPERATION_CATEGORY.TWO)
            )
          },
        }),
        buildCustomField({
          id: 'properties.outside',
          title: m.outsideTitle,
          component: 'PropertyRepeater',
          condition: (answers) => {
            return (
              (answers.applicationInfo as Operation)?.willServe?.includes(
                YES,
              ) || false
            )
          },
        }),
      ],
    }),
  ],
})
