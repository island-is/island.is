import {
  buildMultiField,
  buildSection,
  buildSelectField,
  buildCheckboxField,
  getValueViaPath,
  buildDisplayField,
  YES,
} from '@island.is/application/core'
import { Fasteign } from '@island.is/clients/assets'
import { notkunareiningarOptions } from '../../utils/notkunareiningarUtils'
import * as m from '../../lib/messages/realEstateMessages'
import {
  sumUsageUnitsFireCompensation,
  totalFireCompensation,
} from '../../utils/sumUtils'
import { usageUnitsCondition } from '../../utils/conditionUtils'

export const realEstateSection = buildSection({
  id: 'realEstateSection',
  title: m.realEstateMessages.title,
  condition: (answers) => {
    const otherPropertiesThanIOwn = getValueViaPath<string[]>(
      answers,
      'otherPropertiesThanIOwnCheckbox',
    )
    return !otherPropertiesThanIOwn?.includes(YES)
  },
  children: [
    buildMultiField({
      id: 'realEstate',
      title: m.realEstateMessages.multifieldTitle,
      description: m.realEstateMessages.description,
      children: [
        buildSelectField({
          id: 'realEstate',
          title: 'Fasteign',
          options: (application) => {
            const properties = getValueViaPath<Array<Fasteign>>(
              application.externalData,
              'getProperties.data',
            )

            return (
              properties?.map((property) => ({
                label: `(${property.fasteignanumer}) ${property?.sjalfgefidStadfang?.birting} `,
                value: property.fasteignanumer ?? '',
              })) ?? []
            )
          },
          clearOnChange: ['usageUnits'],
          marginBottom: 4,
        }),
        buildCheckboxField({
          condition: usageUnitsCondition,
          id: 'usageUnits',
          title: m.realEstateMessages.usageUnit,
          description: m.realEstateMessages.usageUnitDescription,
          options: notkunareiningarOptions,
        }),
        buildDisplayField({
          condition: usageUnitsCondition,
          id: 'usageUnitsFireCompensation',
          label: m.realEstateMessages.usageUnitsFireCompensation,
          variant: 'currency',
          rightAlign: true,
          value: sumUsageUnitsFireCompensation,
        }),
        buildDisplayField({
          condition: usageUnitsCondition,
          id: 'totalFireCompensation',
          label: m.realEstateMessages.totalFireCompensation,
          variant: 'currency',
          rightAlign: true,
          value: totalFireCompensation,
        }),
      ],
    }),
  ],
})
