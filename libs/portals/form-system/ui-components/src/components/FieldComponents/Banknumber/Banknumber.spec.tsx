import { ApolloLink } from '@apollo/client'
import {
  MockedProvider,
  MockedResponse,
  MockLink,
} from '@apollo/client/testing'
import { FormSystemField } from '@island.is/api/schema'
import { ApplicantTypesEnum } from '@island.is/form-system/enums'
import { USER_PROFILE } from '@island.is/portals/my-pages/graphql'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { InputHTMLAttributes, ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { IntlProvider } from 'react-intl'
import { ApplicationState } from '../../../lib'
import { Banknumber } from './Banknumber'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ lang: 'is' }),
}))

jest.mock('@island.is/island-ui/core', () => {
  const { forwardRef } = jest.requireActual<typeof import('react')>('react')
  return {
    GridColumn: ({ children }: { children: ReactNode }) => <>{children}</>,
    GridRow: ({ children }: { children: ReactNode }) => <>{children}</>,
    Text: ({ children }: { children: ReactNode }) => <>{children}</>,
    Input: forwardRef<
      HTMLInputElement,
      InputHTMLAttributes<HTMLInputElement> & {
        label: string
        backgroundColor?: string
        errorMessage?: string
      }
    >(({ label, backgroundColor, errorMessage, value, ...props }, ref) => (
      <label>
        {label}
        <input {...props} ref={ref} value={value ?? ''} />
      </label>
    )),
  }
})

const item = {
  id: 'bank-account',
  name: { is: 'Bank account' },
  values: [],
} as unknown as FormSystemField

const profileData = (bankInfo: string | null) => ({
  getUserProfile: {
    nationalId: '0101302989',
    mobilePhoneNumber: null,
    locale: 'is',
    email: null,
    bankInfo,
    bankInfoError: false,
    emailStatus: null,
    emailVerified: false,
    mobileStatus: null,
    mobilePhoneNumberVerified: false,
    emailNotifications: false,
    needsNudge: false,
    emails: [],
  },
})

const profileMock = (bankInfo: string | null): MockedResponse => ({
  request: { query: USER_PROFILE },
  result: { data: profileData(bankInfo) },
})

const renderField = (
  mocks: MockedResponse[],
  bankAccount?: string,
  applicantType?: string,
) => {
  const dispatch = jest.fn()
  const profileRequest = jest.fn()
  const link = new ApolloLink((operation, forward) => {
    profileRequest()
    return forward(operation)
  }).concat(new MockLink(mocks, false))
  const Form = () => {
    const methods = useForm()
    return (
      <FormProvider {...methods}>
        <Banknumber
          item={
            bankAccount
              ? { ...item, values: [{ json: { bankAccount } }] }
              : item
          }
          dispatch={dispatch}
          state={
            applicantType
              ? ({
                  screens: [{ fields: [{ fieldSettings: { applicantType } }] }],
                } as unknown as ApplicationState)
              : undefined
          }
        />
      </FormProvider>
    )
  }
  render(
    <MockedProvider link={link} addTypename={false}>
      <IntlProvider locale="is" defaultLocale="is" messages={{}}>
        <Form />
      </IntlProvider>
    </MockedProvider>,
  )
  return { dispatch, profileRequest }
}

it.each(
  Object.values(ApplicantTypesEnum).filter(
    (type) => type !== ApplicantTypesEnum.INDIVIDUAL,
  ),
)(
  'does not fetch bank info for applicant type %s and permits manual entry',
  (applicantType) => {
    const { profileRequest, dispatch } = renderField(
      [],
      undefined,
      applicantType,
    )

    expect(profileRequest).not.toHaveBeenCalled()
    expect(
      screen
        .getAllByRole('textbox')
        .map((input) => input.getAttribute('value')),
    ).toEqual(['', '', ''])

    fireEvent.change(screen.getAllByRole('textbox')[0], {
      target: { value: '4321' },
    })
    expect(screen.getByDisplayValue('4321')).toBeTruthy()
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_BANK_ACCOUNT',
      payload: { id: item.id, valueIndex: 0, value: '4321--' },
    })
    expect(profileRequest).not.toHaveBeenCalled()
  },
)

it('leaves inputs empty while the profile request is pending', () => {
  renderField([{ ...profileMock('1234-12-123456'), delay: Infinity }])

  expect(
    screen.getAllByRole('textbox').map((input) => input.getAttribute('value')),
  ).toEqual(['', '', ''])
})

it('prefills all three inputs and dispatches the profile bank account', async () => {
  const { dispatch } = renderField(
    [profileMock('1234-12-123456')],
    undefined,
    ApplicantTypesEnum.INDIVIDUAL,
  )

  await screen.findByDisplayValue('123456')
  expect(screen.getByDisplayValue('1234')).toBeTruthy()
  expect(screen.getByDisplayValue('12')).toBeTruthy()
  await waitFor(() =>
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_BANK_ACCOUNT',
      payload: { id: item.id, valueIndex: 0, value: '1234-12-123456' },
    }),
  )
})

it('preserves a saved bank account without fetching the profile', () => {
  renderField([], '4321-21-654321')

  expect(screen.getByDisplayValue('4321')).toBeTruthy()
  expect(screen.getByDisplayValue('21')).toBeTruthy()
  expect(screen.getByDisplayValue('654321')).toBeTruthy()
})

it('prefills profile data when the saved bank account is the empty sentinel', async () => {
  renderField([profileMock('1234-12-123456')], '--')

  await screen.findByDisplayValue('123456')
  expect(screen.getByDisplayValue('1234')).toBeTruthy()
  expect(screen.getByDisplayValue('12')).toBeTruthy()
})

it('preserves user edits made before the profile arrives', async () => {
  let resolveProfile: () => void = () => undefined
  const profileArrived = new Promise<void>((resolve) => {
    resolveProfile = resolve
  })
  renderField([
    {
      ...profileMock('1234-12-123456'),
      delay: 20,
      result: () => {
        resolveProfile()
        return { data: profileData('1234-12-123456') }
      },
    },
  ])
  fireEvent.change(screen.getAllByRole('textbox')[0], {
    target: { value: '9' },
  })

  await act(async () => {
    await profileArrived
  })
  expect(screen.getByDisplayValue('9')).toBeTruthy()
  expect(
    screen.getAllByRole('textbox').map((input) => input.getAttribute('value')),
  ).toEqual(['9', '', ''])
})

it('does not refill the inputs after the user clears the prefilled account', async () => {
  renderField([profileMock('1234-12-123456')])
  await screen.findByDisplayValue('123456')

  for (const input of screen.getAllByRole('textbox')) {
    fireEvent.change(input, { target: { value: '' } })
  }

  expect(
    screen.getAllByRole('textbox').map((input) => input.getAttribute('value')),
  ).toEqual(['', '', ''])
})

it.each([null, '123456-12-1234'])(
  'leaves inputs empty for bankInfo %s',
  async (bankInfo) => {
    let resolveProfile: () => void = () => undefined
    const profileArrived = new Promise<void>((resolve) => {
      resolveProfile = resolve
    })
    renderField([
      {
        ...profileMock(bankInfo),
        result: () => {
          resolveProfile()
          return { data: profileData(bankInfo) }
        },
      },
    ])

    await act(async () => {
      await profileArrived
    })
    expect(
      screen
        .getAllByRole('textbox')
        .map((input) => input.getAttribute('value')),
    ).toEqual(['', '', ''])
  },
)
