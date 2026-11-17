import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/enums'
import {
  GET_PUBLIC_VEHICLE_SEARCH,
  GET_REAL_ESTATE_PROPERTIES,
  GET_REAL_ESTATE_PROPERTY,
  GET_VEHICLES_LIST_V3,
} from '@island.is/form-system/graphql'
import { fireEvent, render, screen } from '@testing-library/react'
import { InputHTMLAttributes, ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Asset } from './Asset'

const mockQuery = jest.fn(() => new Promise(() => undefined))

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useApolloClient: () => ({ query: mockQuery }),
}))

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ lang: 'is', formatMessage: () => 'Message' }),
}))

jest.mock('@island.is/island-ui/core', () => ({
  GridColumn: ({ children }: { children: ReactNode }) => <>{children}</>,
  GridRow: ({ children }: { children: ReactNode }) => <>{children}</>,
  Stack: ({ children }: { children: ReactNode }) => <>{children}</>,
  Box: ({ children }: { children: ReactNode }) => <>{children}</>,
  LoadingDots: () => null,
  SkeletonLoader: () => null,
  Select: ({ label }: { label: string }) => <select aria-label={label} />,
  Input: ({
    label,
    value,
    onChange,
    onBlur,
    onFocus,
  }: InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
    <input
      aria-label={label}
      value={value ?? ''}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      readOnly={!onChange}
    />
  ),
}))

beforeEach(() => mockQuery.mockClear())

const renderAsset = (
  assetType: string,
  isDropdown: boolean,
  isPreview?: boolean,
) => {
  const item = {
    id: 'asset',
    fieldType: FieldTypesEnum.ASSETS,
    name: { is: 'Asset' },
    fieldSettings: { assetType, isDropdown },
    values: [],
  } as FormSystemField
  const Form = () => {
    const methods = useForm()
    return (
      <FormProvider {...methods}>
        <Asset item={item} isPreview={isPreview} />
      </FormProvider>
    )
  }
  render(<Form />)
}

it.each(['VEHICLE', 'REAL_ESTATE'])(
  'does not fetch the %s dropdown list in preview',
  (assetType) => {
    renderAsset(assetType, true, true)

    expect(screen.getByRole('combobox', { name: 'Asset' })).toBeTruthy()
    expect(mockQuery).not.toHaveBeenCalled()
  },
)

it.each([
  ['VEHICLE', GET_VEHICLES_LIST_V3],
  ['REAL_ESTATE', GET_REAL_ESTATE_PROPERTIES],
])('still fetches the %s dropdown list outside preview', (assetType, query) => {
  renderAsset(assetType as string, true)

  expect(mockQuery).toHaveBeenCalledWith(expect.objectContaining({ query }))
})

it.each([
  ['VEHICLE', 'AB123'],
  ['REAL_ESTATE', '1234567'],
])('does not fetch %s details on blur in preview', (assetType, value) => {
  renderAsset(assetType, false, true)
  const input = screen.getByRole('textbox', { name: 'Asset' })

  fireEvent.change(input, { target: { value } })
  fireEvent.blur(input)

  expect(mockQuery).not.toHaveBeenCalled()
})

it.each([
  ['VEHICLE', 'AB123', GET_PUBLIC_VEHICLE_SEARCH],
  ['REAL_ESTATE', '1234567', GET_REAL_ESTATE_PROPERTY],
])(
  'still fetches %s details on blur outside preview',
  (assetType, value, query) => {
    renderAsset(assetType as string, false)
    const input = screen.getByRole('textbox', { name: 'Asset' })

    fireEvent.change(input, { target: { value } })
    fireEvent.blur(input)

    expect(mockQuery).toHaveBeenCalledWith(expect.objectContaining({ query }))
  },
)
