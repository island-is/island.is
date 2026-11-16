import { ApolloLink } from '@apollo/client'
import { MockedProvider, MockLink } from '@apollo/client/testing'
import { FormSystemField } from '@island.is/api/schema'
import {
  ApplicantTypesEnum,
  FamilyTypes,
  FieldTypesEnum,
} from '@island.is/form-system/enums'
import { GET_FAMILY_MEMBERS } from '@island.is/form-system/graphql'
import { render, screen, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { IntlProvider } from 'react-intl'
import { ApplicationState } from '../../../lib'
import { Family } from './Family'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ lang: 'is', formatMessage: () => 'Required' }),
}))

jest.mock('@island.is/island-ui/core', () => ({
  GridColumn: ({
    children,
    span,
  }: {
    children: ReactNode
    span?: string | string[]
  }) => <div data-grid-span={JSON.stringify(span)}>{children}</div>,
  GridRow: ({ children }: { children: ReactNode }) => <>{children}</>,
  Stack: ({ children }: { children: ReactNode }) => <>{children}</>,
  Box: ({ children }: { children: ReactNode }) => <>{children}</>,
  LoadingDots: () => null,
  SkeletonLoader: () => null,
  Select: ({ label }: { label: string }) => <select aria-label={label} />,
  Input: ({
    label,
    value,
    readOnly,
  }: {
    label: string
    value: string
    readOnly?: boolean
  }) => <input aria-label={label} value={value ?? ''} readOnly={readOnly} />,
}))

const renderFamily = (
  familyType: string,
  isPreview?: boolean,
  state?: ApplicationState,
  valueIndex = 0,
) => {
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
        <Family
          item={item}
          dispatch={dispatch}
          isPreview={isPreview}
          state={state}
          valueIndex={valueIndex}
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
  return { dispatch, registryRequest }
}

it.each([FamilyTypes.APPLICANT_INFO, FamilyTypes.CHILD, FamilyTypes.SPOUSE])(
  'does not fetch registry data for %s in preview',
  (familyType) => {
    const { dispatch, registryRequest } = renderFamily(familyType, true)

    expect(registryRequest).not.toHaveBeenCalled()
    expect(dispatch).not.toHaveBeenCalled()
    if (familyType === FamilyTypes.APPLICANT_INFO) {
      expect(screen.getByDisplayValue('Preview spouse')).toBeTruthy()
      expect(screen.getByDisplayValue('0101302989')).toBeTruthy()
      expect(screen.queryByDisplayValue('Married')).toBeNull()
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
      expect(inputs.map((input) => input.value)).toEqual([
        'Preview spouse',
        '0101302989',
      ])
      expect(
        inputs[0].closest('[data-grid-span]')?.getAttribute('data-grid-span'),
      ).toBe(JSON.stringify('10/10'))
      expect(
        inputs[1].closest('[data-grid-span]')?.getAttribute('data-grid-span'),
      ).toBe(JSON.stringify(['1/1', '1/1', '5/10']))
    }
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

it.each([0, 1])(
  'displays and persists the logged-in individual in read-only fields at value index %s without a registry request',
  async (valueIndex) => {
    const state = {
      sections: [
        {
          screens: [
            {
              fields: [
                {
                  fieldType: FieldTypesEnum.APPLICANT,
                  fieldSettings: {
                    applicantType: ApplicantTypesEnum.INDIVIDUAL,
                  },
                  values: [
                    {
                      json: {
                        nationalId: '0101902989',
                        name: 'Applicant',
                        isLoggedInUser: true,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    } as ApplicationState
    const { dispatch, registryRequest } = renderFamily(
      FamilyTypes.APPLICANT_INFO,
      false,
      state,
      valueIndex,
    )

    await waitFor(() => {
      expect(screen.getByDisplayValue('Applicant')).toBeTruthy()
      expect(screen.getByDisplayValue('0101902989')).toBeTruthy()
    })
    expect(screen.getAllByRole('textbox')).toHaveLength(2)
    screen.getAllByRole('textbox').forEach((input) => {
      expect((input as HTMLInputElement).readOnly).toBe(true)
    })
    expect(registryRequest).not.toHaveBeenCalled()
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_NAME',
      payload: { id: 'family', value: 'Applicant', valueIndex },
    })
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_NATIONAL_ID',
      payload: { id: 'family', value: '0101902989', valueIndex },
    })
  },
)

it.each([
  {
    actorType: ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_INDIVIDUAL,
    applicantType: ApplicantTypesEnum.INDIVIDUAL_GIVING_DELEGATION,
  },
  {
    actorType: ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY,
    applicantType: ApplicantTypesEnum.LEGAL_ENTITY,
  },
  {
    actorType: ApplicantTypesEnum.INDIVIDUAL_WITH_PROCURATION,
    applicantType: ApplicantTypesEnum.LEGAL_ENTITY_OF_PROCURATION_HOLDER,
  },
  {
    actorType: ApplicantTypesEnum.LEGAL_GUARDIAN,
    applicantType: ApplicantTypesEnum.WARD_OF_LEGAL_GUARDIAN,
  },
])(
  'displays and persists $applicantType instead of the logged-in $actorType',
  async ({ actorType, applicantType }) => {
    const state = {
      sections: [
        {
          screens: [
            {
              fields: [
                {
                  fieldType: FieldTypesEnum.APPLICANT,
                  fieldSettings: { applicantType: actorType },
                  values: [
                    {
                      json: {
                        nationalId: '0101802989',
                        name: 'Logged-in actor',
                        isLoggedInUser: true,
                      },
                    },
                  ],
                },
              ],
            },
            {
              fields: [
                {
                  fieldType: FieldTypesEnum.APPLICANT,
                  fieldSettings: { applicantType },
                  values: [
                    {
                      json: {
                        nationalId: '0101902989',
                        name: 'Represented applicant',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    } as ApplicationState
    const { dispatch, registryRequest } = renderFamily(
      FamilyTypes.APPLICANT_INFO,
      false,
      state,
    )

    await waitFor(() => {
      expect(screen.getByDisplayValue('Represented applicant')).toBeTruthy()
      expect(screen.getByDisplayValue('0101902989')).toBeTruthy()
    })
    expect(screen.queryByDisplayValue('Logged-in actor')).toBeNull()
    expect(screen.queryByDisplayValue('0101802989')).toBeNull()
    screen.getAllByRole('textbox').forEach((input) => {
      expect((input as HTMLInputElement).readOnly).toBe(true)
    })
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_NAME',
      payload: { id: 'family', value: 'Represented applicant', valueIndex: 0 },
    })
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_NATIONAL_ID',
      payload: { id: 'family', value: '0101902989', valueIndex: 0 },
    })
    expect(registryRequest).not.toHaveBeenCalled()
  },
)

it('keeps the saved applicant identity when application state is unavailable', () => {
  const { dispatch, registryRequest } = renderFamily(FamilyTypes.APPLICANT_INFO)

  expect(screen.getByDisplayValue('Preview spouse')).toBeTruthy()
  expect(screen.getByDisplayValue('0101302989')).toBeTruthy()
  expect(dispatch).not.toHaveBeenCalled()
  expect(registryRequest).not.toHaveBeenCalled()
})
