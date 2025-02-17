import {
  buildMultiField,
  buildTextField,
  buildSection,
  buildDateField,
  buildCustomField,
} from '@island.is/application/core'
import { certificateOfTenure } from '../../lib/messages'

export const certificateOfTenureSection = buildSection({
  id: 'certificateOfTenureSection',
  title: certificateOfTenure.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'certificateOfTenureMultiField',
      title: certificateOfTenure.general.title,
      description: certificateOfTenure.general.description,
      children: [
        buildTextField({
          id: 'certificateOfTenure.machineNumber',
          title: certificateOfTenure.labels.machineNumber,
          width: 'half',
          clearOnChange: [
            'certificateOfTenure.machineType',
            'certificateOfTenure.practicalRight',
          ],
        }),
        buildTextField({
          id: 'certificateOfTenure.machineType',
          title: certificateOfTenure.labels.machineType,
          width: 'half',
          readOnly: true,
          defaultValue: () => 'temp',
        }),
        buildTextField({
          id: 'certificateOfTenure.practicalRight',
          title: certificateOfTenure.labels.practicalRight,
          readOnly: true,
          defaultValue: () => 'temp2',
        }),
        buildCustomField({
          id: 'certificateOfTenure.SetAnswersForCertificateOfTenure',
          title: '',
          component: 'SetAnswersForCertificateOfTenure',
        }),
        // TODO: Add alertMessage here
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
          variant: 'number',
        }),
      ],
    }),
  ],
})
