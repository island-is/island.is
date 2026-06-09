import {
  buildCheckboxField,
  buildMultiField,
  buildRadioField,
  buildSection,
  NO,
  YES,
} from '@island.is/application/core'
import { prereqMessages as m } from '../../lib/messages'
import {
  devMockEnabled,
  devMockTaxChecked,
} from '../../utils/prerequisiteMockDataUtils'

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
            {
              value: 'filedWithinFiveYears',
              label: m.devMockTaxVariantFiveYears,
            },
          ],
          marginBottom: 2,
          condition: (answers) =>
            devMockEnabled(answers) && devMockTaxChecked(answers),
        }),
      ],
    }),
  ],
})
