import {
  buildCheckboxField,
  buildMultiField,
  buildRadioField,
  buildSection,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { prereqMessages as m } from '../../../lib/messages'

const devMockEnabled = (answers: FormValue) =>
  getValueViaPath<string>(answers, 'assigneeDevMockSettings.useMock') === YES

const devMockTaxChecked = (answers: FormValue) => {
  const tax = getValueViaPath<string[]>(
    answers,
    'assigneeDevMockSettings.mockTaxReturn',
  )
  return Array.isArray(tax) && tax.includes(YES)
}

export const assigneeMockDataSection = buildSection({
  id: 'assigneeMockDataSection',
  title: m.devMockSectionTitle,
  children: [
    buildMultiField({
      id: 'assigneeDevMockMultiField',
      title: m.devMockSectionTitle,
      children: [
        buildRadioField({
          id: 'assigneeDevMockSettings.useMock',
          title: m.devMockUseMockTitle,
          width: 'full',
          options: [
            { value: YES, label: 'Já' },
            { value: NO, label: 'Nei' },
          ],
          marginBottom: 3,
        }),
        buildCheckboxField({
          id: 'assigneeDevMockSettings.mockTaxReturn',
          options: [{ value: YES, label: m.devMockTaxLabel }],
          marginBottom: 2,
          condition: devMockEnabled,
        }),
        buildRadioField({
          id: 'assigneeDevMockSettings.mockTaxReturnVariant',
          title: m.devMockTaxVariantTitle,
          width: 'full',
          options: [
            {
              value: 'withSampleData',
              label: m.devMockTaxVariantSample,
            },
            {
              value: 'emptySuccess',
              label: m.devMockTaxVariantEmpty,
            },
          ],
          defaultValue: 'withSampleData',
          marginBottom: 2,
          condition: (answers) =>
            devMockEnabled(answers) && devMockTaxChecked(answers),
        }),
        buildCheckboxField({
          id: 'assigneeDevMockSettings.mockNationalRegistryAddress',
          options: [
            { value: YES, label: m.devMockNationalRegistryAddressLabel },
          ],
          marginBottom: 2,
          condition: devMockEnabled,
        }),
      ],
    }),
  ],
})
