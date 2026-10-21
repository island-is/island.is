import '@testing-library/jest-dom'
import { MockedProvider, type MockedResponse } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react'
import { FC, PropsWithChildren } from 'react'
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import {
  ApplicationStatus,
  ApplicationTypes,
  type Application,
  type ExternalData,
  type FieldBaseProps,
} from '@island.is/application/types'
import { GetDebtsApi } from '../../dataProviders'
import { DebtsLoader } from './index'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    lang: 'is',
    formatMessage: (message: unknown) =>
      typeof message === 'string'
        ? message
        : (message as { defaultMessage: string }).defaultMessage,
  }),
}))

const debt = {
  chargeTypeId: 'AB',
  chargeTypeName: 'Gjaldflokkur 1',
  dueDate: '2025-08-01',
  finalDueDate: '2025-08-31',
  debts: 565990,
  chargeItemSubject: '453-78857-53',
  timePeriod: '202508',
}

const fetched = (debts: unknown[]) =>
  ({
    customerDebts: {
      data: { debts },
      date: new Date().toISOString(),
      status: 'success',
    },
  } as unknown as ExternalData)

const applicationWith = (id: string, externalData: ExternalData): Application =>
  ({
    id,
    assignees: [],
    applicantActors: [],
    typeId: ApplicationTypes.PAY_DEBTS,
    externalData,
    answers: {},
    applicant: '1111112219',
    state: 'draft',
    modified: new Date(),
    created: new Date(),
    status: ApplicationStatus.IN_PROGRESS,
  } as unknown as Application)

// MockedProvider matches on deep-equal variables, so this also pins the
// providers the loader refreshes.
const refreshMock = (
  id: string,
  externalData: ExternalData,
): MockedResponse => ({
  request: {
    query: UPDATE_APPLICATION_EXTERNAL_DATA,
    variables: {
      input: {
        id,
        dataProviders: [{ actionId: GetDebtsApi.actionId, order: 0 }],
      },
      locale: 'is',
    },
  },
  result: {
    data: { updateApplicationExternalData: { id, externalData } },
  },
})

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  const methods = useForm()

  return <FormProvider {...methods}>{children}</FormProvider>
}

const renderLoader = (id: string, debts: unknown[]) => {
  const externalData = fetched(debts)
  const addExternalData = jest.fn()
  const setSubmitButtonDisabled = jest.fn()

  render(
    <MockedProvider mocks={[refreshMock(id, externalData)]} addTypename={false}>
      <DebtsLoader
        {...({
          application: applicationWith(id, externalData),
          addExternalData,
          setSubmitButtonDisabled,
          setFieldLoadingState: jest.fn(),
          setBeforeSubmitCallback: jest.fn(),
        } as unknown as FieldBaseProps)}
      />
    </MockedProvider>,
    { wrapper: Wrapper },
  )

  return { addExternalData, setSubmitButtonDisabled }
}

describe('DebtsLoader', () => {
  it('explains that nothing was found when the fetch came back empty', async () => {
    const { addExternalData } = renderLoader('no-debts', [])

    expect(screen.getByText('Engar skuldir fundust')).toBeInTheDocument()
    expect(
      screen.getByText('Þú ert ekki með ógreiddar skuldir frá ríkinu.'),
    ).toBeInTheDocument()

    await waitFor(() => expect(addExternalData).toHaveBeenCalled())
  })

  it('blocks submit while there is nothing to pay', async () => {
    const { addExternalData, setSubmitButtonDisabled } = renderLoader(
      'no-debts-submit',
      [],
    )

    expect(setSubmitButtonDisabled).toHaveBeenCalledWith(true)

    await waitFor(() => expect(addExternalData).toHaveBeenCalled())
  })

  it('leaves the screen to the table when there are debts', async () => {
    const { addExternalData, setSubmitButtonDisabled } = renderLoader(
      'has-debts',
      [debt],
    )

    expect(screen.queryByText('Engar skuldir fundust')).not.toBeInTheDocument()
    expect(setSubmitButtonDisabled).not.toHaveBeenCalledWith(true)

    await waitFor(() => expect(addExternalData).toHaveBeenCalled())
  })
})

const debtA = { ...debt, payID: 'PAY-1' }
const debtB = { ...debt, payID: 'PAY-2', chargeItemSubject: '999-00000-00' }

type BeforeSubmit = () => Promise<[boolean, string | null]>

const renderWithSelection = (
  id: string,
  current: unknown[],
  refreshed: unknown[],
) => {
  const addExternalData = jest.fn()
  const setBeforeSubmitCallback = jest.fn()
  let form: UseFormReturn

  const SelectionWrapper: FC<PropsWithChildren> = ({ children }) => {
    form = useForm({
      defaultValues: { selectedDebts: [true, false], debtsToPay: ['100', ''] },
    })

    return <FormProvider {...form}>{children}</FormProvider>
  }

  render(
    <MockedProvider
      mocks={[refreshMock(id, fetched(refreshed))]}
      addTypename={false}
    >
      <DebtsLoader
        {...({
          application: applicationWith(id, fetched(current)),
          addExternalData,
          setSubmitButtonDisabled: jest.fn(),
          setFieldLoadingState: jest.fn(),
          setBeforeSubmitCallback,
        } as unknown as FieldBaseProps)}
      />
    </MockedProvider>,
    { wrapper: SelectionWrapper },
  )

  return {
    addExternalData,
    getSelection: () => ({
      selectedDebts: form.getValues('selectedDebts'),
      debtsToPay: form.getValues('debtsToPay'),
    }),
    beforeSubmit: (): ReturnType<BeforeSubmit> =>
      (setBeforeSubmitCallback.mock.calls.at(-1)?.[0] as BeforeSubmit)(),
  }
}

describe('DebtsLoader when the refreshed list differs', () => {
  it('clears the selection and tells the applicant', async () => {
    const { addExternalData, getSelection } = renderWithSelection(
      'list-changed',
      [debtA, debtB],
      [debtA],
    )

    await waitFor(() => expect(addExternalData).toHaveBeenCalled())

    expect(getSelection()).toEqual({ selectedDebts: [], debtsToPay: [] })
    expect(screen.getByText('Skuldastaðan var uppfærð')).toBeInTheDocument()
  })

  it('keeps the selection when the list is unchanged', async () => {
    const { addExternalData, getSelection } = renderWithSelection(
      'list-unchanged',
      [debtA, debtB],
      [debtA, debtB],
    )

    await waitFor(() => expect(addExternalData).toHaveBeenCalled())

    expect(getSelection()).toEqual({
      selectedDebts: [true, false],
      debtsToPay: ['100', ''],
    })
    expect(
      screen.queryByText('Skuldastaðan var uppfærð'),
    ).not.toBeInTheDocument()
  })

  it('refuses to submit a selection the refresh has just cleared', async () => {
    const { beforeSubmit } = renderWithSelection(
      'submit-after-change',
      [debtA, debtB],
      [debtA],
    )

    await expect(beforeSubmit()).resolves.toEqual([false, ''])
  })

  it('lets a selection that survived the refresh through', async () => {
    const { beforeSubmit } = renderWithSelection(
      'submit-after-no-change',
      [debtA, debtB],
      [debtA, debtB],
    )

    await expect(beforeSubmit()).resolves.toEqual([true, null])
  })
})
