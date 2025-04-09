import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
  YES,
} from '@island.is/application/core'
import {
  ApplicationTypes,
  Operation,
  OperationCategory,
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
            ApplicationTypes.HOTEL,
        }),
        buildCustomField({
          id: 'properties.dining',
          title: m.diningTitle,
          component: 'PropertyRepeater',
          condition: (answers) => {
            return (
              (answers.applicationInfo as Operation)?.operation ===
                ApplicationTypes.RESTURANT ||
              ((answers.applicationInfo as Operation)?.operation ===
                ApplicationTypes.HOTEL &&
                (answers.applicationInfo as Operation)?.category !==
                  OperationCategory.TWO)
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
