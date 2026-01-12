import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
  YES,
  getValueViaPath,
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
            getValueViaPath(answers, 'applicationInfo.operation') ===
            ApplicationTypes.HOTEL,
        }),
        buildCustomField({
          id: 'properties.dining',
          title: m.diningTitle,
          component: 'PropertyRepeater',
          condition: (answers) => {
            const info = getValueViaPath<Operation>(answers, 'applicationInfo')
            return (
              info?.operation === ApplicationTypes.RESTURANT ||
              (info?.operation === ApplicationTypes.HOTEL &&
                info?.category !== OperationCategory.TWO)
            )
          },
        }),
        buildCustomField({
          id: 'properties.outside',
          title: m.outsideTitle,
          component: 'PropertyRepeater',
          condition: (answers) => {
            return (
              getValueViaPath<string>(
                answers,
                'applicationInfo.willServe',
              )?.includes(YES) || false
            )
          },
        }),
      ],
    }),
  ],
})
