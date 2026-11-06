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
  notIncludedInSumbox?: boolean | null,
) => {
  const dispatch = jest.fn()
  const item: FormSystemField = {
    id: 'sum',
    name: { is: 'Total' },
    fieldType: FieldTypesEnum.ISK_SUMBOX,
    isPartOfMultiset,
  }
  const fields = [
    currencyField('before-previous-sum', ['9.000', '8.000']),
    { id: 'previous-sum', fieldType: FieldTypesEnum.ISK_SUMBOX },
    {
      ...currencyField('first', ['1.000', '2.000']),
      fieldSettings: { notIncludedInSumbox },
    },
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

it.each<[boolean, number, boolean | null | undefined, string]>([
  [true, 0, true, '300'],
  [true, 1, true, '400'],
  [false, 0, true, '31.200'],
  [true, 0, false, '1.300'],
  [false, 0, false, '34.200'],
  [true, 0, undefined, '1.300'],
  [false, 0, undefined, '34.200'],
  [true, 0, null, '1.300'],
  [false, 0, null, '34.200'],
])(
  'sums with multiset=%s, index=%s, exclusion=%s to %s',
  (isPartOfMultiset, valueIndex, notIncludedInSumbox, expected) => {
    const { dispatch } = renderSum(
      isPartOfMultiset,
      valueIndex,
      notIncludedInSumbox,
    )

    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe(
      `${expected} kr.`,
    )
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_CURRENCY',
      payload: { id: 'sum', value: expected, valueIndex },
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
