import {
  buildSubSection,
  buildDisplayField,
  buildMultiField,
  buildDescriptionField,
  buildTextField,
  getValueViaPath,
  buildRadioField,
} from '@island.is/application/core'

export const displayFieldSubsection = buildSubSection({
  id: 'displayFieldSubsection',
  title: 'Display Field',
  children: [
    buildMultiField({
      id: 'displayField',
      title: 'Display Field',
      children: [
        buildDescriptionField({
          id: 'displayFieldDescription',
          description:
            'Display field is just a read only input field behind the scenes. What is special about the display field is that the value takes a function that listens to changes in answers and updates the value accordingly. This is useful for displaying sums, multiples or anything else that is calculated from other fields.',
        }),
        buildTextField({
          id: 'input1',
          title: 'Input 1',
          variant: 'currency',
          width: 'half',
          rightAlign: true,
        }),
        buildTextField({
          id: 'input2',
          title: 'Input 2',
          variant: 'currency',
          width: 'half',
          rightAlign: true,
        }),
        buildTextField({
          id: 'input3',
          title: 'Input 3',
          variant: 'currency',
          width: 'half',
          rightAlign: true,
        }),
        buildDisplayField({
          id: 'displayField',
          title: 'Display Field',
          variant: 'currency',
          label: 'Sum of inputs 1, 2 and 3',
          rightAlign: true,
          value: (answers) => {
            const value1 = Number(getValueViaPath<string>(answers, 'input1'))
            const value2 = Number(getValueViaPath<string>(answers, 'input2'))
            const value3 = Number(getValueViaPath<string>(answers, 'input3'))
            return `${value1 + value2 + value3}`
          },
        }),

        buildTextField({
          id: 'input4',
          title: 'Upphæð leigu',
          variant: 'currency',
          width: 'half',
          rightAlign: true,
        }),
        buildRadioField({
          id: 'radioFieldForDisplayField',
          title: 'Trygging fyrir íbúð',
          width: 'half',
          options: [
            { label: 'Einföld leiga', value: '1' },
            { label: 'Tvöföld leiga', value: '2' },
            { label: 'Þreföld leiga', value: '3' },
            { label: 'Önnur upphæð', value: 'other' },
          ],
        }),
        buildDisplayField({
          id: 'displayField2',
          title: 'Upphæð leigu',
          variant: 'currency',
          rightAlign: true,
          value: (answers) => {
            const value4 = Number(getValueViaPath<string>(answers, 'input4'))
            const value5 = getValueViaPath<string>(
              answers,
              'radioFieldForDisplayField',
            )

            if (!value4 || !value5) {
              return ''
            }

            if (value5 === 'other') {
              return 'Önnur upphæð'
            }

            return `${value4 * Number(value5)}`
          },
        }),
      ],
    }),
  ],
})
