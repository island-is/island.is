import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { FormSystemField } from '@island.is/api/schema'
import { GET_COMPANY, IDENTITY_QUERY } from '@island.is/form-system/graphql'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { IntlProvider } from 'react-intl'
import { m } from '../../../lib/messages'
import { NationalId } from './NationalId'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ lang: 'is' }),
}))

jest.mock('@island.is/island-ui/core', () => ({
  Box: ({
    children,
    paddingTop,
    ...props
  }: {
    children: React.ReactNode
    paddingTop?: number
  }) => <div {...props}>{children}</div>,
  LoadingDots: () => <span data-testid="loading-dots" />,
  GridColumn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  GridRow: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Stack: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Input: ({
    label,
    name,
    value,
    onChange,
    onBlur,
    readOnly,
    hasError,
    errorMessage,
  }: {
    label: string
    name: string
    value: string
    onChange: React.ChangeEventHandler<HTMLInputElement>
    onBlur: React.FocusEventHandler<HTMLInputElement>
    readOnly: boolean
    hasError: boolean
    errorMessage: string
  }) => (
    <label>
      {label}
      <input
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        readOnly={readOnly}
      />
      {hasError && errorMessage && <span role="alert">{errorMessage}</span>}
    </label>
  ),
}))

const item = {
  id: 'nationalId',
  name: { is: 'National ID' },
  isRequired: true,
  values: [],
} as unknown as FormSystemField

const renderField = (
  mock?: MockedResponse | MockedResponse[],
  showAddress = false,
  mode: 'onBlur' | 'onSubmit' = 'onBlur',
) => {
  const dispatch = jest.fn()
  const onSubmit = jest.fn()
  const Form = () => {
    const methods = useForm({ mode })
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <NationalId
            item={{ ...item, fieldSettings: { showAddress } }}
            dispatch={dispatch}
          />
          <button type="submit">Submit</button>
        </form>
      </FormProvider>
    )
  }
  render(
    <MockedProvider
      mocks={mock ? (Array.isArray(mock) ? mock : [mock]) : []}
      addTypename={false}
    >
      <IntlProvider locale="is" messages={{}}>
        <Form />
      </IntlProvider>
    </MockedProvider>,
  )
  return { dispatch, onSubmit }
}

it.each(
  (['onBlur', 'onSubmit'] as const).flatMap((mode) =>
    ['0', '010130', '010130-298', '777777-777'].map((value) => ({
      mode,
      value,
    })),
  ),
)(
  'shows an invalid national ID error only after blurring incomplete national ID $value in $mode mode',
  async ({ mode, value }) => {
    renderField(undefined, false, mode)
    const input = screen.getByRole('textbox', { name: 'National ID' })
    fireEvent.change(input, { target: { value } })
    expect(screen.queryByRole('alert')).toBeNull()
    fireEvent.blur(input)
    await screen.findByText(m.InvalidNationalId.defaultMessage)
    expect(screen.queryByText(m.required.defaultMessage)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() =>
      expect(screen.getByText(m.required.defaultMessage)).toBeTruthy(),
    )
    expect(screen.getByText(m.InvalidNationalId.defaultMessage)).toBeTruthy()
    expect(
      screen.queryByText(m.nationalIdLookupFailed.defaultMessage),
    ).toBeNull()
  },
)

it('clears the name field error when the national ID is cleared', async () => {
  renderField()
  const input = screen.getByRole('textbox', { name: 'National ID' })
  fireEvent.change(input, { target: { value: '777777-7777' } })
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  await screen.findByText(m.required.defaultMessage)

  fireEvent.change(input, { target: { value: '' } })
  await waitFor(() =>
    expect(screen.queryByText(m.required.defaultMessage)).toBeNull(),
  )
  expect(
    screen
      .getByRole('textbox', { name: m.namePerson.defaultMessage })
      .getAttribute('value'),
  ).toBe('')
})

it('clears name and address validation errors whenever the national ID changes', async () => {
  renderField(undefined, true)
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  await waitFor(() => expect(screen.getAllByRole('alert')).toHaveLength(3))

  fireEvent.change(screen.getByRole('textbox', { name: /^National ID/ }), {
    target: { value: '0' },
  })
  await waitFor(() => expect(screen.queryByRole('alert')).toBeNull())
})

it('clears national ID errors on change and validates again on blur after submission', async () => {
  renderField()
  const input = screen.getByRole('textbox', { name: 'National ID' })
  fireEvent.change(input, { target: { value: '0' } })
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  await screen.findByText(m.InvalidNationalId.defaultMessage)

  fireEvent.change(input, { target: { value: '01' } })
  await waitFor(() => expect(screen.queryByRole('alert')).toBeNull())
  expect(input.getAttribute('value')).toBe('01')

  fireEvent.blur(input)
  await screen.findByText(m.InvalidNationalId.defaultMessage)

  fireEvent.change(input, { target: { value: '' } })
  await waitFor(() => expect(screen.queryByRole('alert')).toBeNull())
})

it('clears lookup values when changing directly to another complete national ID', async () => {
  const { dispatch } = renderField(
    [
      {
        request: {
          query: IDENTITY_QUERY,
          variables: { input: { nationalId: '0101302989' } },
        },
        result: {
          data: {
            identity: {
              name: 'Test Person',
              address: {
                streetAddress: 'Test Street',
                postalCode: '101',
                city: 'Test City',
              },
            },
          },
        },
      },
      {
        request: {
          query: IDENTITY_QUERY,
          variables: { input: { nationalId: '0201302989' } },
        },
        delay: Infinity,
        result: { data: { identity: null } },
      },
    ],
    true,
  )
  const input = screen.getByRole('textbox', { name: 'National ID' })
  fireEvent.change(input, { target: { value: '010130-2989' } })
  await screen.findByDisplayValue('Test Person')
  expect(screen.getByDisplayValue('Test Street')).toBeTruthy()

  fireEvent.change(input, { target: { value: '020130-2989' } })
  for (const label of [m.namePerson, m.address, m.postalCode, m.city]) {
    expect(
      screen
        .getByRole('textbox', { name: label.defaultMessage })
        .getAttribute('value'),
    ).toBe('')
  }
  expect(screen.queryByRole('alert')).toBeNull()
  expect(dispatch).toHaveBeenCalledWith({
    type: 'SET_NAME',
    payload: { id: item.id, value: '', valueIndex: 0 },
  })
  expect(dispatch).toHaveBeenCalledWith({
    type: 'SET_ADDRESS',
    payload: {
      id: item.id,
      valueIndex: 0,
      address: '',
      postalCode: '',
      municipality: '',
    },
  })
})

it('rejects a completed national ID outside both lookup categories', async () => {
  const { onSubmit } = renderField()
  const input = screen.getByRole('textbox', { name: 'National ID' })
  fireEvent.change(input, { target: { value: '777777-7777' } })

  await screen.findByText(m.nationalIdLookupFailed.defaultMessage)
  fireEvent.blur(input)
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  await waitFor(() => expect(screen.getAllByRole('alert').length).toBe(2))
  expect(screen.getByText(m.nationalIdLookupFailed.defaultMessage)).toBeTruthy()
  expect(onSubmit).not.toHaveBeenCalled()

  fireEvent.change(input, { target: { value: '777777-777' } })
  fireEvent.blur(input)
  await waitFor(() =>
    expect(
      screen.queryByText(m.nationalIdLookupFailed.defaultMessage),
    ).toBeNull(),
  )
})

describe.each([
  {
    kind: 'individual',
    query: IDENTITY_QUERY,
    nationalId: '010130-2989',
    result: { identity: null },
    success: { identity: { name: 'Test Person', address: null } },
    name: 'Test Person',
  },
  {
    kind: 'company',
    query: GET_COMPANY,
    nationalId: '410130-2989',
    result: { companyRegistryCompany: null },
    success: { companyRegistryCompany: { name: 'Test Company' } },
    name: 'Test Company',
  },
])('$kind lookup', ({ query, nationalId, result, success, name }) => {
  const request = {
    query,
    variables: { input: { nationalId: nationalId.replace('-', '') } },
  }

  it.each([
    { outcome: 'success', response: { result: { data: success } } },
    {
      outcome: 'API error',
      response: { error: new Error('Registry unavailable') },
    },
  ])(
    'shows loading dots until the lookup finishes with $outcome',
    async ({ response }) => {
      renderField({ request, delay: 50, ...response })
      const input = screen.getByRole('textbox', { name: 'National ID' })
      expect(screen.queryByRole('status')).toBeNull()
      fireEvent.change(input, { target: { value: nationalId.slice(0, -1) } })
      expect(screen.queryByRole('status')).toBeNull()

      fireEvent.change(input, { target: { value: nationalId } })
      expect(screen.getByRole('status')).toBeTruthy()
      expect(screen.getByTestId('loading-dots')).toBeTruthy()
      await waitFor(() => expect(screen.queryByRole('status')).toBeNull())
    },
  )

  it('hides loading dots when an in-flight lookup is skipped after editing the ID', async () => {
    renderField({ request, delay: Infinity, result: { data: success } })
    const input = screen.getByRole('textbox', { name: 'National ID' })
    fireEvent.change(input, { target: { value: nationalId } })
    expect(screen.getByRole('status')).toBeTruthy()

    fireEvent.change(input, { target: { value: nationalId.slice(0, -1) } })
    await waitFor(() => expect(screen.queryByRole('status')).toBeNull())
  })

  it.each([
    {
      outcome: 'no name',
      response: { result: { data: result } },
      message: m.nationalIdLookupFailed.defaultMessage,
    },
    {
      outcome: 'API error',
      response: { error: new Error('Registry unavailable') },
      message: m.nationalIdLookupFailed.defaultMessage,
    },
  ])(
    'handles $outcome and preserves the error during validation',
    async ({ response, message }) => {
      const { dispatch, onSubmit } = renderField({ request, ...response }, true)
      const input = screen.getByRole('textbox', { name: 'National ID' })
      fireEvent.change(input, { target: { value: nationalId } })

      await screen.findByText(message)
      expect(screen.getAllByRole('alert')).toHaveLength(1)
      expect(screen.queryByText(m.required.defaultMessage)).toBeNull()
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SET_NAME',
        payload: { id: item.id, value: '', valueIndex: 0 },
      })

      fireEvent.blur(input)
      await waitFor(() => expect(screen.getByText(message)).toBeTruthy())
      expect(screen.queryByText(m.required.defaultMessage)).toBeNull()
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
      await waitFor(() => expect(screen.getAllByRole('alert')).toHaveLength(3))
      expect(screen.getByText(message)).toBeTruthy()
      expect(onSubmit).not.toHaveBeenCalled()

      fireEvent.change(input, { target: { value: nationalId.slice(0, -1) } })
      await waitFor(() => expect(screen.queryByText(message)).toBeNull())
    },
  )

  it('stores a successful name without a lookup error', async () => {
    const lookupResult = jest.fn(() => ({ data: success }))
    const { dispatch } = renderField({ request, result: lookupResult }, true)
    const input = screen.getByRole('textbox', { name: 'National ID' })
    fireEvent.change(input, {
      target: { value: nationalId.slice(0, -1) },
    })
    fireEvent.blur(input)
    await screen.findByText(m.InvalidNationalId.defaultMessage)
    expect(lookupResult).not.toHaveBeenCalled()

    fireEvent.change(input, {
      target: { value: nationalId },
    })

    await screen.findByDisplayValue(name)
    expect(lookupResult).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('alert')).toBeNull()
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_NAME',
      payload: { id: item.id, value: name, valueIndex: 0 },
    })
  })
})
