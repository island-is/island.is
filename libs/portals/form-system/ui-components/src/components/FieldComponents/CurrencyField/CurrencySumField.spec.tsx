import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/enums'
import { render, screen } from '@testing-library/react'
import { InputHTMLAttributes, ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { ApplicationState } from '../../../lib/reducerTypes'
import { CurrencySumField } from './CurrencySumField'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ lang: 'is', formatMessage: () => '' }),
}))

jest.mock('@island.is/island-ui/core', () => ({
  GridColumn: ({ children }: { children: ReactNode }) => <>{children}</>,
  GridRow: ({ children }: { children: ReactNode }) => <>{children}</>,
  Input: ({
    label,
    errorMessage,
    ...props
  }: InputHTMLAttributes<HTMLInputElement> & {
    label: string
    errorMessage?: string
  }) => (
    <label>
      {label}
      <input {...props} />
    </label>
  ),
}))

const currencyField = (
  id: string,
  values: string[],
  isPartOfMultiset = true,
): FormSystemField => ({
  id,
  fieldType: FieldTypesEnum.ISK_NUMBERBOX,
  isPartOfMultiset,
  values: values.map((iskNumber) => ({ json: { iskNumber } })),
})

const renderSum = (
  isPartOfMultiset: boolean,
  valueIndex = 0,
  fieldsToSum?: string[] | null,
) => {
  const dispatch = jest.fn()
  const item: FormSystemField = {
    id: 'sum',
    name: { is: 'Total' },
    fieldType: FieldTypesEnum.ISK_SUMBOX,
    isPartOfMultiset,
    fieldSettings: { fieldsToSum },
  }
  const fields = [
    currencyField('before-previous-sum', ['9.000', '8.000']),
    { id: 'previous-sum', fieldType: FieldTypesEnum.ISK_SUMBOX },
    currencyField('first', ['1.000', '2.000']),
    currencyField('second', ['300', '400']),
    currencyField('outside-multiset', ['500'], false),
    item,
    currencyField('after-sum', ['7.000', '6.000']),
  ]
  const state = { currentScreen: { data: { fields } } } as ApplicationState
  const Form = () => {
    const methods = useForm()
    return (
      <FormProvider {...methods}>
        <CurrencySumField
          item={item}
          dispatch={dispatch}
          state={state}
          valueIndex={valueIndex}
        />
      </FormProvider>
    )
  }
  render(<Form />)
  return { dispatch }
}

it.each<[number, string]>([
  [0, '1.300'],
  [1, '2.400'],
  [2, ''],
])(
  'sums only currency values within multiset entry %s',
  (valueIndex, value) => {
    const { dispatch } = renderSum(true, valueIndex)
    expect(screen.getByRole('textbox').getAttribute('name')).toBe(
      `sum.${valueIndex}`,
    )
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe(
      value ? `${value} kr.` : '',
    )
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_CURRENCY',
      payload: { id: 'sum', value, valueIndex },
    })
  },
)

it('sums every currency field on the screen for sum fields outside the multiset', () => {
  const { dispatch } = renderSum(false)
  expect(screen.getByRole('textbox').getAttribute('name')).toBe('sum')
  expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe(
    '34.200 kr.',
  )
  expect(dispatch).toHaveBeenCalledWith({
    type: 'SET_CURRENCY',
    payload: { id: 'sum', value: '34.200', valueIndex: 0 },
  })
})

it.each([
  { isPartOfMultiset: false, valueIndex: 0, expected: '30.000' },
  { isPartOfMultiset: true, valueIndex: 0, expected: '16.000' },
  { isPartOfMultiset: true, valueIndex: 1, expected: '14.000' },
])(
  'sums selected fields regardless of position with multiset=$isPartOfMultiset, index=$valueIndex',
  ({ isPartOfMultiset, valueIndex, expected }) => {
    const { dispatch } = renderSum(isPartOfMultiset, valueIndex, [
      'before-previous-sum',
      'after-sum',
      'previous-sum',
      'missing-field',
    ])

    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe(
      `${expected} kr.`,
    )
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_CURRENCY',
      payload: { id: 'sum', value: expected, valueIndex },
    })
  },
)

it.each([
  { fieldsToSum: [], isPartOfMultiset: false, expected: '34.200' },
  { fieldsToSum: null, isPartOfMultiset: false, expected: '34.200' },
  { fieldsToSum: [], isPartOfMultiset: true, expected: '1.300' },
  { fieldsToSum: null, isPartOfMultiset: true, expected: '1.300' },
])(
  'uses default sums for fieldsToSum=$fieldsToSum with multiset=$isPartOfMultiset',
  ({ fieldsToSum, isPartOfMultiset, expected }) => {
    const { dispatch } = renderSum(isPartOfMultiset, 0, fieldsToSum)

    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe(
      `${expected} kr.`,
    )
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_CURRENCY',
      payload: { id: 'sum', value: expected, valueIndex: 0 },
    })
  },
)
