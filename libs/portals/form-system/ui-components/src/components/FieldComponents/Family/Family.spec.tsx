import { ApolloLink } from '@apollo/client'
import { MockedProvider, MockLink } from '@apollo/client/testing'
import { FormSystemField } from '@island.is/api/schema'
import { FamilyTypes, FieldTypesEnum } from '@island.is/form-system/enums'
import { GET_FAMILY_MEMBERS } from '@island.is/form-system/graphql'
import { render, screen } from '@testing-library/react'
import { ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { IntlProvider } from 'react-intl'
import { Family } from './Family'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ lang: 'is', formatMessage: () => 'Required' }),
}))

jest.mock('@island.is/island-ui/core', () => ({
  GridColumn: ({ children }: { children: ReactNode }) => <>{children}</>,
  GridRow: ({ children }: { children: ReactNode }) => <>{children}</>,
  Stack: ({ children }: { children: ReactNode }) => <>{children}</>,
  Box: ({ children }: { children: ReactNode }) => <>{children}</>,
  LoadingDots: () => null,
  SkeletonLoader: () => null,
  Select: ({ label }: { label: string }) => <select aria-label={label} />,
  Input: ({ label, value }: { label: string; value: string }) => (
    <input aria-label={label} value={value ?? ''} readOnly />
  ),
}))

const renderFamily = (familyType: string, isPreview?: boolean) => {
  const dispatch = jest.fn()
  const registryRequest = jest.fn()
  const link = new ApolloLink((operation, forward) => {
    registryRequest()
    return forward(operation)
  }).concat(
    new MockLink(
      [
        {
          request: { query: GET_FAMILY_MEMBERS },
          result: { data: { nationalRegistryPerson: null } },
          delay: Infinity,
        },
      ],
      false,
    ),
  )
  const item = {
    id: 'family',
    fieldType: FieldTypesEnum.FAMILY,
    name: { is: 'Family' },
    fieldSettings: { familyType },
    values: [
      {
        json: {
          nationalId: '0101302989',
          name: 'Preview spouse',
          maritalStatus: 'Married',
        },
      },
    ],
  } as FormSystemField
  const Form = () => {
    const methods = useForm()
    return (
      <FormProvider {...methods}>
        <Family item={item} dispatch={dispatch} isPreview={isPreview} />
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
  return { dispatch, registryRequest }
}

it.each([FamilyTypes.CHILD, FamilyTypes.SPOUSE])(
  'does not fetch registry data for %s in preview',
  (familyType) => {
    const { dispatch, registryRequest } = renderFamily(familyType, true)

    expect(registryRequest).not.toHaveBeenCalled()
    expect(dispatch).not.toHaveBeenCalled()
    if (familyType === FamilyTypes.SPOUSE) {
      expect(screen.getByDisplayValue('Preview spouse')).toBeTruthy()
      expect(screen.getByDisplayValue('0101302989')).toBeTruthy()
      expect(screen.getByDisplayValue('Married')).toBeTruthy()
    }
  },
)

it.each([FamilyTypes.CHILD, FamilyTypes.SPOUSE])(
  'still fetches registry data for %s outside preview',
  (familyType) => {
    const { registryRequest } = renderFamily(familyType)

    expect(registryRequest).toHaveBeenCalledTimes(1)
  },
)
