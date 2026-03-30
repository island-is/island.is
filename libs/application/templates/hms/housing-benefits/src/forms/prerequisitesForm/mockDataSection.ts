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
import { prereqMessages as m } from '../../lib/messages'

const devMockEnabled = (answers: FormValue) =>
  getValueViaPath<string>(answers, 'devMockSettings.useMock') === YES

const devMockTaxChecked = (answers: FormValue) => {
  const tax = getValueViaPath<string[]>(
    answers,
    'devMockSettings.mockTaxReturn',
  )
  return Array.isArray(tax) && tax.includes(YES)
}

export const mockDataSection = buildSection({
  id: 'mockDataSection',
  title: m.devMockSectionTitle,
  children: [
    buildMultiField({
      id: 'devMockMultiField',
      title: m.devMockSectionTitle,
      children: [
        buildRadioField({
          id: 'devMockSettings.useMock',
          title: m.devMockUseMockTitle,
          width: 'full',
          options: [
            { value: YES, label: 'Já' },
            { value: NO, label: 'Nei' },
          ],
          marginBottom: 3,
        }),
        buildCheckboxField({
          id: 'devMockSettings.mockRentalAgreements',
          options: [{ value: YES, label: m.devMockRentalLabel }],
          marginBottom: 2,
          condition: devMockEnabled,
        }),
        buildCheckboxField({
          id: 'devMockSettings.mockTaxReturn',
          options: [{ value: YES, label: m.devMockTaxLabel }],
          marginBottom: 2,
          condition: devMockEnabled,
        }),
        buildRadioField({
          id: 'devMockSettings.mockTaxReturnVariant',
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
      ],
    }),
  ],
})
