import {
  buildCheckboxField,
  buildMultiField,
  buildRadioField,
  buildSection,
  NO,
  YES,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import {
  devMockEnabled,
  devMockTaxChecked,
} from '../../utils/prerequisiteMockDataUtils'

export const mockDataSection = buildSection({
  id: 'mockDataSection',
  title: m.prereqMessages.devMockSectionTitle,
  children: [
    buildMultiField({
      id: 'devMockMultiField',
      title: m.prereqMessages.devMockSectionTitle,
      children: [
        buildRadioField({
          id: 'devMockSettings.useMock',
          title: m.prereqMessages.devMockUseMockTitle,
          width: 'full',
          options: [
            { value: YES, label: m.miscMessages.yes },
            { value: NO, label: m.miscMessages.no },
          ],
          marginBottom: 3,
        }),
        buildCheckboxField({
          id: 'devMockSettings.mockRentalAgreements',
          options: [{ value: YES, label: m.prereqMessages.devMockRentalLabel }],
          marginBottom: 2,
          condition: devMockEnabled,
        }),
        buildCheckboxField({
          id: 'devMockSettings.mockTaxReturn',
          options: [{ value: YES, label: m.prereqMessages.devMockTaxLabel }],
          marginBottom: 2,
          condition: devMockEnabled,
        }),
        buildRadioField({
          id: 'devMockSettings.mockTaxReturnVariant',
          title: m.prereqMessages.devMockTaxVariantTitle,
          width: 'full',
          options: [
            {
              value: 'withSampleData',
              label: m.prereqMessages.devMockTaxVariantSample,
            },
            {
              value: 'emptySuccess',
              label: m.prereqMessages.devMockTaxVariantEmpty,
            },
            {
              value: 'filedWithinFiveYears',
              label: m.prereqMessages.devMockTaxVariantFiveYears,
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
