import {
  buildSection,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { selectOptions } from '../../../utils/options'

export const tableRepeaterSection = buildSection({
  id: 'repeater',
  title: 'Table Repeater',
  children: [
    buildTableRepeaterField({
      id: 'tableRepeater',
      title: 'Table Repeater Field',
      formTitle: 'Table Repeater Form Title', // Todo: doesn't work
      addItemButtonText: 'Custom Add item text',
      saveItemButtonText: 'Custom Save item text',
      removeButtonTooltipText: 'Custom Remove item text',
      editButtonTooltipText: 'Custom Edit item text',
      editField: true,
      maxRows: 10,
      getStaticTableData: (_application) => {
        // Possibility to populate the table with data from the answers or external data
        // Populated data will not be editable or deletable
        return [
          {
            fullName: 'John Doe',
            nationalId: '000000-0000',
            relation: 'select1',
          },
          {
            fullName: 'Jane Doe',
            nationalId: '000000-0001',
            relation: 'select2',
          },
        ]
      },
      // Possible fields: input, select, radio, checkbox, date, nationalIdWithName
      fields: {
        fullName: {
          component: 'input',
          label: 'Input label',
          width: 'half',
          type: 'text',
          dataTestId: 'sibling-full-name',
        },
        nationalId: {
          component: 'input',
          label: 'National ID label',
          width: 'half',
          type: 'text',
          format: '######-####',
          placeholder: '000000-0000',
          dataTestId: 'sibling-national-id',
        },
        relation: {
          component: 'select',
          label: 'Select label',
          placeholder: 'Select placeholder',
          options: selectOptions,
          dataTestId: 'sibling-relation',
        },
      },
      table: {
        // Format values for display in the table
        format: {
          fullName: (value) => `${value} - custom format`,
        },
        // Overwrite header for the table. If not provided, the labels from the fields will be used
        header: ['Full name', 'National ID', 'Relation'],
      },
    }),
  ],
})
