import {
  buildMultiField,
  buildSection,
  buildSelectField,
  buildCheckboxField,
  getValueViaPath,
  buildDisplayField,
} from '@island.is/application/core'
import { Fasteign } from '@island.is/clients/assets'
import { notkunareiningarOptions } from '../../utils/notkunareiningarUtils'
import * as m from '../../lib/messages/realEstateMessages'
import {
  sumUseageUnitsFireCompensation,
  totalFireCompensation,
} from '../../utils/sumUtils'
import { useageUnitsCondition } from '../../utils/conditionUtils'

export const realEstateSection = buildSection({
  id: 'realEstateSection',
  title: m.realEstateMessages.title,
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
                label: property?.sjalfgefidStadfang?.birting ?? '',
                value: property.fasteignanumer ?? '',
              })) ?? []
            )
          },
          clearOnChange: ['useageUnits'],
          marginBottom: 4,
        }),
        buildCheckboxField({
          condition: useageUnitsCondition,
          id: 'useageUnits',
          title: m.realEstateMessages.useageUnit,
          options: notkunareiningarOptions,
        }),
        buildDisplayField({
          condition: useageUnitsCondition,
          id: 'useageUnitsFireCompensation',
          label: m.realEstateMessages.useageUnitsFireCompensation,
          variant: 'currency',
          rightAlign: true,
          value: sumUseageUnitsFireCompensation,
        }),
        buildDisplayField({
          condition: useageUnitsCondition,
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
