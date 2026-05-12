import { getValueViaPath, SubSectionBuilder } from '@island.is/application/core'

const toCurrencyNumber = (value: string | undefined): number => {
  if (!value) {
    return 0
  }

  const normalized = value.replace(/[^\d,-]/g, '').replace(',', '.')
  return Number(normalized || 0)
}

const summedInputIds = ['input1', 'input2', 'input3']

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
          const sum = summedInputIds.reduce(
            (total, inputId) =>
              total +
              toCurrencyNumber(getValueViaPath<string>(answers, inputId)),
            0,
          )
          return `${sum}`
        },
        {
          variant: 'currency',
          label: 'Sum of inputs 1, 2 and 3',
          rightAlign: true,
          clientExpression: {
            type: 'sum',
            fields: summedInputIds,
          },
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
          const sum = Number(getValueViaPath<string>(answers, 'displayField'))

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

          return `${value4 * sum}`
        },
        {
          variant: 'currency',
          rightAlign: true,
          clientExpression: {
            type: 'sum',
            fields: ['input4', ...summedInputIds],
          },
        },
      )
  })
  .build()
