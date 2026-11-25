import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/enums'
import { expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { ReactNode } from 'react'
import { DefaultDisplay } from './DefaultDisplay'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ lang: 'is', formatMessage: () => '' }),
}))

jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}))

const item: FormSystemField = {
  id: 'amount',
  screenId: 'screen',
  name: { is: 'Amount' },
  isRequired: false,
}

it.each(
  [FieldTypesEnum.ISK_NUMBERBOX, FieldTypesEnum.ISK_SUMBOX].flatMap(
    (fieldType) =>
      [
        { value: '1.234', expected: '1.234 kr.' },
        { value: '0', expected: '0 kr.' },
        { value: 0, expected: '0 kr.' },
        { value: '', expected: '' },
        { value: null, expected: '' },
        { value: undefined, expected: '' },
      ].map((testCase) => ({ fieldType, ...testCase })),
  ),
)(
  'formats $fieldType value $value as "$expected"',
  ({ fieldType, value, expected }) => {
    const { container } = render(
      <DefaultDisplay
        item={{ ...item, fieldType, values: [{ json: { iskNumber: value } }] }}
        valueIndex={0}
      />,
    )

    expect(container.textContent).toBe(`Amount${expected}`)
  },
)

it('formats the selected multiset entry', () => {
  render(
    <DefaultDisplay
      item={{
        ...item,
        fieldType: FieldTypesEnum.ISK_SUMBOX,
        values: [
          { json: { iskNumber: '1.000' } },
          { json: { iskNumber: '2.000' } },
        ],
      }}
      valueIndex={1}
    />,
  )

  expect(screen.getByText('2.000 kr.')).toBeTruthy()
})

it('does not add a currency suffix to ordinary numbers', () => {
  const { container } = render(
    <DefaultDisplay
      item={{
        ...item,
        fieldType: FieldTypesEnum.NUMBERBOX,
        values: [{ json: { number: '1234' } }],
      }}
      valueIndex={0}
    />,
  )

  expect(container.textContent).toBe('Amount1234')
})
