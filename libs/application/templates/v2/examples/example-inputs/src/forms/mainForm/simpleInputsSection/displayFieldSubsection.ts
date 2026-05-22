import { dataSchema, ExampleFieldsAnswers } from '@/lib/dataSchema'
import {
  expr,
  getValueViaPath,
  serverExpr,
  SubSectionBuilder,
} from '@island.is/application/core'

const toCurrencyNumber = (value: string | undefined): number => {
  if (!value) {
    return 0
  }

  const normalized = value.replace(/[^\d,-]/g, '').replace(',', '.')
  return Number(normalized || 0)
}
const serverExprHelper = serverExpr.forSchema<ExampleFieldsAnswers>()

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
          clientValueExpression: expr.sum(...summedInputIds.map(expr.get)),
        },
      )
      .addTextField('multiplyInput1', 'Multiply input 1', {
        variant: 'number',
        width: 'half',
        rightAlign: true,
      })
      .addTextField('multiplyInput2', 'Multiply input 2', {
        variant: 'number',
        width: 'half',
        rightAlign: true,
      })
      .addTextField('multiplyInput3', 'Value to add', {
        variant: 'number',
        width: 'half',
        rightAlign: true,
      })
      .addDisplayField(
        'displayFieldProduct',
        'Display Field Formula',
        (answers) => {
          const value1 = toCurrencyNumber(
            getValueViaPath<string>(answers, 'multiplyInput1'),
          )
          const value2 = toCurrencyNumber(
            getValueViaPath<string>(answers, 'multiplyInput2'),
          )
          const value3 = toCurrencyNumber(
            getValueViaPath<string>(answers, 'multiplyInput3'),
          )

          return `${value1 * value2 + value3}`
        },
        {
          variant: 'number',
          label: 'Multiply input 1 by multiply input 2, then add value',
          rightAlign: true,
          showWhen: (answers, externalData, user) => {
            const value1 = getValueViaPath<string>(answers, 'multiplyInput1')
            const value2 = getValueViaPath<string>(answers, 'multiplyInput2')
            const input4 = serverExprHelper.answer('input4').value ?? ''
            return value1 !== undefined && value2 !== undefined
          },
          clientShowWhen: expr.and(
            expr.isNotEmpty('multiplyInput1'),
            expr.isNotEmpty('multiplyInput2'),
          ),
          clientValueExpression: expr.sum(
            expr.multiply(
              expr.get('multiplyInput1'),
              expr.get('multiplyInput2'),
            ),
            expr.get('multiplyInput3'),
          ),
        },
      )
      .addTextField('input4', 'Upphæð leigu', {
        variant: 'currency',
        width: 'half',
        rightAlign: true,
        showWhen: serverExprHelper.any(
          serverExprHelper.contains(serverExprHelper.answer('input4'), ''),
          serverExprHelper.contains(
            serverExprHelper.answer('radioFieldForDisplayField'),
            'other',
          ),
        ),
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
          clientValueExpression: expr.if({
            condition: expr.or(
              expr.isEmpty('input4'),
              expr.isEmpty('radioFieldForDisplayField'),
            ),
            then: '',
            otherwise: expr.if({
              condition: expr.equals(
                expr.get('radioFieldForDisplayField'),
                'other',
              ),
              then: 'Önnur upphæð',
              otherwise: expr.multiply(
                expr.get('input4'),
                expr.get('displayField'),
              ),
            }),
          }),
        },
      )
  })
  .build()
