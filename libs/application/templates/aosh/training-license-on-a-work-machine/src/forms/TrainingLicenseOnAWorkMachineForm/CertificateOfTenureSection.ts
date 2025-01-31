import {
  buildMultiField,
  buildTextField,
  buildSection,
  buildCheckboxField,
  buildSelectField,
  buildDateField,
} from '@island.is/application/core'
import { certificateOfTenure, information } from '../../lib/messages'

export const certificateOfTenureSection = buildSection({
  id: 'certificateOfTenureSection',
  title: information.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'certificateOfTenureMultiField',
      title: information.general.title,
      description: information.general.description,
      children: [
        buildSelectField({
          id: 'certificateOfTenure.practicalRight',
          title: certificateOfTenure.labels.practicalRight,
          options: [
            { value: 'test', label: 'test' },
            { value: 'test2', label: 'test2' },
          ],
          placeholder: certificateOfTenure.labels.practicalRightPlaceholder,
        }),
        buildTextField({
          id: 'certificateOfTenure.machineNumber',
          title: certificateOfTenure.labels.machineNumber,
          width: 'half',
        }),
        buildTextField({
          id: 'certificateOfTenure.machineType',
          title: certificateOfTenure.labels.machineType,
          width: 'half',
          readOnly: true,
          defaultValue: () => 'temp',
        }),
        buildDateField({
          id: 'certificateOfTenure.dateFrom',
          title: certificateOfTenure.labels.dateFrom,
          width: 'half',
          placeholder: certificateOfTenure.labels.datePlaceholder,
        }),
        buildDateField({
          id: 'certificateOfTenure.dateTo',
          title: certificateOfTenure.labels.dateTo,
          width: 'half',
          placeholder: certificateOfTenure.labels.datePlaceholder,
        }),
        buildTextField({
          id: 'certificateOfTenure.tenureInHours',
          title: certificateOfTenure.labels.tenureInHours,
          width: 'half',
          format: '####',
          // variant: 'number',
        }),
        buildCheckboxField({
          id: 'certificateOfTenure.approveMachines',
          title: '',
          marginTop: 4,
          options: [
            {
              label: certificateOfTenure.labels.approveMachines,
              value: 'approveMachines',
            },
          ],
        }),
      ],
    }),
  ],
})
