import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { selectOptions } from '../../../utils/options'
import { input } from 'libs/island-ui/core/src/lib/Input/Input.mixins'
import { name } from 'libs/island-ui/core/src/lib/FormStepper/FormStepperSection.css'

export const tableRepeaterSubsection = buildSubSection({
  id: 'repeater',
  title: 'Table Repeater',
  children: [
    buildMultiField({
      id: 'tableRepeater',
      title: 'Table Repeater Field',
      children: [
        buildDescriptionField({
          id: 'tableRepeaterDescription',
          title: '',
          description:
            'Í table repeater smíðar þú lítið form sem notandinn fyllir út og svörunum er síðan raðað inn í töflu. Aðeins eitt eintak af þessu formi er sýnilegt á hverjum tímapunkti. Í töflunni er hægt að eyða línum og breyta, hægt er að afvirkja þessa möguleika. Einnig er hægt að setja gögn inn í töfluna út frá answers eða external data svipað og í staticTable.',
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'tableRepeaterDescription2',
          title: '',
          description:
            'Í table repeater er í boði að nota input, select, radio, checkbox, date, nationalIdWithName og phone.',
        }),
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
                input: 'John Doe',
                select: 'option 1',
                radio: 'option 2',
                checkbox: 'option 3',
                date: '2024-01-01',
                name: 'Test Name',
                nationalId: '000000-0000',
                phone: '6666666',
              },
              {
                input: 'Jane Doe',
                select: 'option 1',
                radio: 'option 2',
                checkbox: 'option 3',
                date: '2024-01-01',
                name: 'Test Name 2',
                nationalId: '100000-0000',
                phone: '6666666',
              },
            ]
          },
          // Possible fields: input, select, radio, checkbox, date, nationalIdWithName
          fields: {
            input: {
              component: 'input',
              label: 'Regular input',
              width: 'half',
              required: true,
              type: 'text',
            },
            select: {
              component: 'select',
              label: 'Select',
              width: 'half',
              options: [
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
              ],
            },
            radio: {
              component: 'radio',
              width: 'half',
              options: [
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
                { label: 'Option 3', value: 'option3' },
              ],
            },
            checkbox: {
              component: 'checkbox',
              options: [
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
              ],
            },
            date: {
              component: 'date',
              label: 'Date',
              width: 'half',
            },
            nationalIdWithName: {
              component: 'nationalIdWithName',
              label: 'National ID with name',
            },
            phone: {
              component: 'phone',
              label: 'Phone',
              width: 'half',
            },
          },
          table: {
            // Format values for display in the table
            format: {
              input: (value) => `${value} - custom format`,
              nationalIdWithName: (value) => {
                return `${value} - custom format`
              },
            },
            // Overwrite header for the table. If not provided, the labels from the fields will be used
            header: [
              'Input',
              'Select',
              'Radio',
              'Checkbox',
              'Date',
              'Name',
              'NationalId',
              'Phone',
            ],
          },
        }),
      ],
    }),
  ],
})
