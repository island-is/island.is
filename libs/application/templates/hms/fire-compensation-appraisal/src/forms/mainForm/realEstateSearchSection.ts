import {
  buildMultiField,
  buildSection,
  buildCheckboxField,
  getValueViaPath,
  buildDisplayField,
  buildCustomField,
  YES,
  buildAsyncSelectField,
} from '@island.is/application/core'
import { notkunareiningarOptions } from '../../utils/notkunareiningarUtils'
import * as m from '../../lib/messages/realEstateMessages'
import {
  sumUsageUnitsFireCompensation,
  totalFireCompensation,
} from '../../utils/sumUtils'
import { usageUnitsCondition } from '../../utils/conditionUtils'
import { HmsPropertyInfo } from '@island.is/api/schema'

export const realEstateSearchSection = buildSection({
  id: 'realEstateSearchSection',
  title: m.realEstateMessages.title,
  condition: (answers) => {
    const otherPropertiesThanIOwn = getValueViaPath<string[]>(
      answers,
      'otherPropertiesThanIOwnCheckbox',
    )
    return !!otherPropertiesThanIOwn?.includes(YES)
  },
  children: [
    buildMultiField({
      id: 'realEstate',
      title: m.realEstateMessages.multifieldTitle,
      description: m.realEstateMessages.description,
      children: [
        buildCustomField(
          {
            id: 'anyonesProperty',
            component: 'PropertySearch',
            clearOnChange: ['selectedPropertyByCode'],
          },
          {
            onlyAddressSearch: true,
          },
        ),
        buildAsyncSelectField({
          id: 'selectedPropertyByCode',
          title: m.realEstateMessages.units,
          condition: (answers) => {
            const props = getValueViaPath<unknown[]>(
              answers,
              'anyonesProperty.propertiesByAddressCode',
            )
            return !!props?.length
          },
          loadingError: 'Loading error',
          loadOptions: async ({ selectedValues }) => {
            const watched = (selectedValues?.[0] ??
              []) as Array<HmsPropertyInfo>
            return watched.map((prop) => ({
              label: `(${prop.propertyCode?.toString()}) ${prop.address}`,
              value: prop.propertyCode?.toString() ?? '',
            }))
          },
          updateOnSelect: ['anyonesProperty.propertiesByAddressCode'],
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
