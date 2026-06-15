import {
  buildCheckboxField,
  buildMultiField,
  buildRadioField,
  buildSection,
  NO,
  YES,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { nationalIdPreface } from '../../../utils/assigneeUtils'
import {
  assigneeUseMock,
  assigneeUseTaxReturnMock,
} from '../../../utils/conditions'

export const assigneeMockDataSection = buildSection({
  id: 'assigneeMockDataSection',
  title: m.prereqMessages.devMockSectionTitle,
  children: [
    buildMultiField({
      id: 'assigneeDevMockMultiField',
      title: m.prereqMessages.devMockSectionTitle,
      children: [
        buildRadioField({
          id: (application, user) =>
            nationalIdPreface(
              application,
              user,
              'assigneeDevMockSettings.useMock',
            ),
          title: m.prereqMessages.devMockUseMockTitle,
          width: 'full',
          options: [
            { value: YES, label: m.miscMessages.yes },
            { value: NO, label: m.miscMessages.no },
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
            { value: YES, label: m.prereqMessages.devMockNationalRegistryAddressLabel },
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
          options: [{ value: YES, label: m.prereqMessages.devMockTaxLabel }],
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
          ],
          marginBottom: 2,
        }),
      ],
    }),
  ],
})
