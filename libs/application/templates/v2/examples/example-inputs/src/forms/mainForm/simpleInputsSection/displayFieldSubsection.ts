import { getValueViaPath, SubSectionBuilder } from '@island.is/application/core'

export const displayFieldSubsection = new SubSectionBuilder(
  'displayFieldSubsection',
  'Display Field',
)
  .addPage('displayField', 'Display Field', (page) => {
    page
      .addDescriptionField('displayFieldDescription', '', {
        description:
          'Display field is just a read only input field behind the scenes. What is special about the display field is that the value takes a function that listens to changes in answers and updates the value accordingly. This is useful for displaying sums, multiples or anything else that is calculated from other fields.',
      })
      .addTextField('input1', 'Input 1', {
        variant: 'currency',
        width: 'half',
        rightAlign: true,
      })
      .addTextField('input2', 'Input 2', {
        variant: 'currency',
        width: 'half',
        rightAlign: true,
      })
      .addTextField('input3', 'Input 3', {
        variant: 'currency',
        width: 'half',
        rightAlign: true,
      })
      .addDisplayField(
        'displayField',
        'Display Field',
        (answers) => {
          const value1 = Number(getValueViaPath<string>(answers, 'input1'))
          const value2 = Number(getValueViaPath<string>(answers, 'input2'))
          const value3 = Number(getValueViaPath<string>(answers, 'input3'))
          return `${value1 + value2 + value3}`
        },
        {
          variant: 'currency',
          label: 'Sum of inputs 1, 2 and 3',
          rightAlign: true,
        },
      )
      .addTextField('input4', 'Upphæð leigu', {
        variant: 'currency',
        width: 'half',
        rightAlign: true,
      })
      .addRadioField('radioFieldForDisplayField', 'Trygging fyrir íbúð', {
        width: 'half',
        options: [
          { label: 'Einföld leiga', value: '1' },
          { label: 'Tvöföld leiga', value: '2' },
          { label: 'Þreföld leiga', value: '3' },
          { label: 'Önnur upphæð', value: 'other' },
        ],
      })
      .addDisplayField(
        'displayField2',
        'Upphæð leigu',
        (answers) => {
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
        {
          variant: 'currency',
          rightAlign: true,
        },
      )
  })
  .build()
