import {
  buildCheckboxField,
  buildMultiField,
  buildRadioField,
  buildSection,
  NO,
  YES,
} from '@island.is/application/core'
import { prereqMessages as m } from '../../../lib/messages'
import { nationalIdPreface } from '../../../utils/assigneeUtils'
import {
  assigneeUseMock,
  assigneeUseTaxReturnMock,
} from '../../../utils/conditions'

export const assigneeMockDataSection = buildSection({
  id: 'assigneeMockDataSection',
  title: m.devMockSectionTitle,
  children: [
    buildMultiField({
      id: 'assigneeDevMockMultiField',
      title: m.devMockSectionTitle,
      children: [
        buildRadioField({
          id: (application, user) =>
            nationalIdPreface(
              application,
              user,
              'assigneeDevMockSettings.useMock',
            ),
          title: m.devMockUseMockTitle,
          width: 'full',
          options: [
            { value: YES, label: 'Já' },
            { value: NO, label: 'Nei' },
          ],
          marginBottom: 3,
        }),
        buildCheckboxField({
          condition: assigneeUseMock,
          id: (application, user) =>
            nationalIdPreface(
              application,
              user,
              'assigneeDevMockSettings.mockNationalRegistryAddress',
            ),
          options: [
            { value: YES, label: m.devMockNationalRegistryAddressLabel },
          ],
          marginBottom: 2,
        }),
        buildCheckboxField({
          condition: assigneeUseMock,
          id: (application, user) =>
            nationalIdPreface(
              application,
              user,
              'assigneeDevMockSettings.mockTaxReturn',
            ),
          options: [{ value: YES, label: m.devMockTaxLabel }],
          marginBottom: 2,
        }),
        buildRadioField({
          condition: assigneeUseTaxReturnMock,
          id: (application, user) =>
            nationalIdPreface(
              application,
              user,
              'assigneeDevMockSettings.mockTaxReturnVariant',
            ),
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
          marginBottom: 2,
        }),
      ],
    }),
  ],
})
