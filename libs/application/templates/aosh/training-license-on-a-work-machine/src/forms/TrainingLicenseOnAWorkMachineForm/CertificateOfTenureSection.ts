import {
  buildMultiField,
  buildTextField,
  buildSection,
  buildPhoneField,
  getValueViaPath,
  buildTableRepeaterField,
  buildCheckboxField,
} from '@island.is/application/core'
import { certificateOfTenure, information } from '../../lib/messages'
import { Application } from '@island.is/api/schema'

export const certificateOfTenureSection = buildSection({
  id: 'certificateOfTenureSection',
  title: information.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'certificateOfTenureMultiField',
      title: information.general.title,
      description: information.general.description,
      children: [
        buildTableRepeaterField({
          id: 'certificateOfTenure',
          title: '',
          addItemButtonText:
            certificateOfTenure.labels.registerMachineButtonText,
          table: {
            header: ['bla', 'kla', 'far', 'bar', 'baz'],
          },
          fields: {
            practicalRight: {
              component: 'select',
              label: certificateOfTenure.labels.practicalRight,
              placeholder: certificateOfTenure.labels.practicalRightPlaceholder,
              width: 'full',
              displayInTable: false,
              options: [
                {
                  label: 'Bla',
                  value: 'bla',
                },
                {
                  label: 'sa',
                  value: 'sa',
                },
              ],
            },
            machineNumber: {
              component: 'input',
              label: certificateOfTenure.labels.machineNumber,
              width: 'half',
            },
            machineType: {
              component: 'input',
              label: certificateOfTenure.labels.machineType,
              width: 'half',
              // readonly: true,
              // backgroundColor: 'white',
            },
            tenureInHours: {
              component: 'input',
              label: certificateOfTenure.labels.tenureInHours,
              width: 'full',
            },
            dateFrom: {
              component: 'date',
              label: certificateOfTenure.labels.dateFrom,
              placeholder: certificateOfTenure.labels.datePlaceholder,
              width: 'half',
            },
            dateTo: {
              component: 'date',
              label: certificateOfTenure.labels.dateTo,
              placeholder: certificateOfTenure.labels.datePlaceholder,
              width: 'half',
            },
          },
        }),
        buildCheckboxField({
          id: 'approveMachines',
          title: '',
          marginTop: 4,
          options: [
            {
              label:
                'Það vottast hér með að ég hef stjórnað og  fylgst með viðhaldi eftirtalinna véla.',
              value: 'approveMachines',
            },
          ],
        }),
      ],
    }),
  ],
})
