import {
  buildMultiField,
  buildSection,
  buildSelectField,
  buildCheckboxField,
  getValueViaPath,
  buildDisplayField,
  buildCustomField,
  YES,
  buildAsyncSelectField,
} from '@island.is/application/core'
import { Fasteign } from '@island.is/clients/assets'
import { notkunareiningarOptions } from '../../utils/notkunareiningarUtils'
import * as m from '../../lib/messages/realEstateMessages'
import {
  sumUsageUnitsFireCompensation,
  totalFireCompensation,
} from '../../utils/sumUtils'
import { usageUnitsCondition } from '../../utils/conditionUtils'
import { HmsPropertyInfo } from '@island.is/api/schema'

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
          condition: (answers) => {
            const otherPropertiesThanIOwn = getValueViaPath<string[]>(
              answers,
              'otherPropertiesThanIOwnCheckbox',
            )
            return !otherPropertiesThanIOwn?.includes(YES)
          },
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
        buildCustomField({
          id: 'anyonesProperty',
          component: 'PropertySearch',
          condition: (answers) => {
            const otherPropertiesThanIOwn = getValueViaPath<string[]>(
              answers,
              'otherPropertiesThanIOwnCheckbox',
            )
            return !!otherPropertiesThanIOwn?.includes(YES)
          },
        },
        {
          onlyAddressSearch: true,
        }),
        buildAsyncSelectField({
          id: 'selectedPropertyByCode',
          title: 'Eignir',
          condition: (answers) => {
            const properties = getValueViaPath<unknown[]>(
              answers,
              'anyonesProperty.propertiesByAddressCode',
            )
            return (properties?.length ?? 0) > 0
          },
          loadingError: 'Loading error',
          loadOptions: async ({ application }) => {
            const allProps = getValueViaPath<Array<HmsPropertyInfo>>(
              application.answers,
              'anyonesProperty.propertiesByAddressCode',
            )

            return allProps?.map((prop) => ({
              label: `(${prop.propertyCode?.toString()}) ${prop.address}`,
              value: prop.propertyCode?.toString() ?? '',
            })) ?? []
          },
          clearOnChange: ['usageUnits'],
          marginBottom: 4,
        }),
        buildCustomField({
          id: 'fetchPropertiesByCodes',
          component: 'FetchPropertiesByCodes',
          condition: (answers) => {
            const properties = getValueViaPath<string>(
              answers,
              'selectedPropertyByCode',
            )
            return !!properties
          },
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
