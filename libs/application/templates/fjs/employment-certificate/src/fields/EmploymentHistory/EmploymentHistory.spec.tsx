import '@testing-library/jest-dom'
import { MockedProvider } from '@apollo/client/testing'
import type { MockedResponse } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FC, PropsWithChildren } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import type {
  Application,
  ExternalData,
  FieldBaseProps,
} from '@island.is/application/types'
import { EmploymentHistoryPreviewApi } from '../../dataProviders'
import { EmploymentHistoryPreview } from '../../lib/types'
import { PREVIEW_ID, SUBMIT_RESULT_ID } from '../../utils/constants'
import { EmploymentHistory } from './index'

jest.mock('@island.is/localization', () => {
  const { createIntl } = jest.requireActual('react-intl')
  const intl = createIntl({ locale: 'is', defaultLocale: 'is' })
  return {
    useLocale: () => ({
      lang: 'is',
      formatMessage: (
        message: string | { id: string; defaultMessage: string },
        values?: Record<string, unknown>,
      ) =>
        typeof message === 'string'
          ? message
          : intl.formatMessage(message, values),
    }),
  }
})

jest.mock('@island.is/shared/components', () => ({
  Markdown: ({ children }: { children: string }) => <div>{children}</div>,
}))

const preview: EmploymentHistoryPreview = {
  previewVersion: 'v2:version-1',
  institutions: [
    {
      id: 'inst-b',
      name: 'Prófunarstofnun B',
      from: '2025-01-01',
      to: '2025-06-20',
    },
    {
      id: 'inst-a',
      name: 'Prófunarstofnun A',
      from: '2024-01-01',
      to: '2024-12-31',
    },
    { id: 'inst-c', name: 'Prófunarstofnun C', from: '2023-01-01', to: null },
  ],
}

const previewResult = (data: EmploymentHistoryPreview): ExternalData => ({
  [PREVIEW_ID]: { status: 'success', date: new Date(), data },
})

const previewFailure: ExternalData = {
  [PREVIEW_ID]: {
    status: 'failure',
    date: new Date(),
    statusCode: 503,
    reason: { title: 'Villa', summary: 'Villa' },
    data: {},
  },
}

// MockedProvider matches on deep-equal variables, so this also pins the
// provider the field runs.
const refreshMock = (
  id: string,
  externalData: ExternalData,
): MockedResponse => ({
  request: {
    query: UPDATE_APPLICATION_EXTERNAL_DATA,
    variables: {
      input: {
        id,
        dataProviders: [
          { actionId: EmploymentHistoryPreviewApi.actionId, order: 0 },
        ],
      },
      locale: 'is',
    },
  },
  result: {
    data: { updateApplicationExternalData: { id, externalData } },
  },
})

const applicationWith = (id: string, externalData: ExternalData = {}) =>
  ({
    id,
    assignees: [],
    applicantActors: [],
    typeId: ApplicationTypes.EMPLOYMENT_CERTIFICATE,
    externalData,
    answers: {},
    applicant: '0101302399',
    state: 'draft',
    modified: new Date(),
    created: new Date(),
    status: ApplicationStatus.DRAFT,
  } as unknown as Application)

const renderField = (
  id: string,
  responses: ExternalData[],
  {
    externalData = {},
    storedIds,
    errors,
  }: {
    externalData?: ExternalData
    storedIds?: string[]
    errors?: Record<string, string>
  } = {},
) => {
  const setSubmitButtonDisabled = jest.fn()
  let form: UseFormReturn | undefined

  const Wrapper: FC<PropsWithChildren> = ({ children }) => {
    form = useForm({
      defaultValues: storedIds ? { institutionIds: storedIds } : {},
    })
    return <FormProvider {...form}>{children}</FormProvider>
  }

  render(
    <MockedProvider
      mocks={responses.map((response) => refreshMock(id, response))}
      addTypename={false}
    >
      <EmploymentHistory
        {...({
          application: applicationWith(id, externalData),
          errors,
          setSubmitButtonDisabled,
          setFieldLoadingState: jest.fn(),
        } as unknown as FieldBaseProps)}
      />
    </MockedProvider>,
    { wrapper: Wrapper },
  )

  return {
    setSubmitButtonDisabled,
    getValue: (name: string) => form?.getValues(name),
  }
}

// The table (desktop) and the cards (mobile) are both rendered; CSS hides one.
const tableCheckbox = (name: string) =>
  screen.getByRole('checkbox', { name: `Birta ${name} á vottorðinu` })

describe('EmploymentHistory', () => {
  it('ticks every institution and keeps what the applicant saw', async () => {
    const { setSubmitButtonDisabled, getValue } = renderField('normal', [
      previewResult(preview),
    ])

    expect(setSubmitButtonDisabled).toHaveBeenCalledWith(true)
    expect(
      await screen.findByText('3 af 3 stofnunum verða á vottorðinu.'),
    ).toBeInTheDocument()

    expect(tableCheckbox('Prófunarstofnun B')).toBeChecked()
    expect(tableCheckbox('Prófunarstofnun A')).toBeChecked()
    expect(screen.getAllByText('20.06.2025').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Í starfi').length).toBeGreaterThan(0)

    expect(getValue('previewVersion')).toBe('v2:version-1')
    expect(getValue('institutionIds')).toEqual(['inst-b', 'inst-a', 'inst-c'])
    await waitFor(() =>
      expect(setSubmitButtonDisabled).toHaveBeenLastCalledWith(false),
    )
  })

  it('unticks an institution and keeps the preview order', async () => {
    const { getValue } = renderField('untick', [previewResult(preview)])
    await screen.findByText('3 af 3 stofnunum verða á vottorðinu.')

    await userEvent.click(tableCheckbox('Prófunarstofnun A'))

    expect(
      screen.getByText('2 af 3 stofnunum verða á vottorðinu.'),
    ).toBeInTheDocument()
    expect(tableCheckbox('Prófunarstofnun A')).not.toBeChecked()
    expect(getValue('institutionIds')).toEqual(['inst-b', 'inst-c'])

    await userEvent.click(tableCheckbox('Prófunarstofnun B'))
    expect(
      screen.getByText('1 af 3 stofnunum verður á vottorðinu.'),
    ).toBeInTheDocument()

    await userEvent.click(tableCheckbox('Prófunarstofnun A'))
    expect(getValue('institutionIds')).toEqual(['inst-a', 'inst-c'])
  })

  it('blocks submit and says so when nothing is ticked', async () => {
    const { setSubmitButtonDisabled } = renderField('none', [
      previewResult(preview),
    ])
    await screen.findByText('3 af 3 stofnunum verða á vottorðinu.')

    for (const name of ['B', 'A', 'C']) {
      await userEvent.click(tableCheckbox(`Prófunarstofnun ${name}`))
    }

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Veldu að minnsta kosti eina stofnun.',
    )
    expect(setSubmitButtonDisabled).toHaveBeenLastCalledWith(true)

    await userEvent.click(tableCheckbox('Prófunarstofnun C'))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(setSubmitButtonDisabled).toHaveBeenLastCalledWith(false)
  })

  it('keeps the earlier choice that is still in the preview', async () => {
    const { getValue } = renderField('stored', [previewResult(preview)], {
      storedIds: ['inst-c', 'inst-gone'],
    })

    expect(
      await screen.findByText('1 af 3 stofnunum verður á vottorðinu.'),
    ).toBeInTheDocument()
    expect(getValue('institutionIds')).toEqual(['inst-c'])
  })

  it('ticks all again when none of the earlier choice is left', async () => {
    const { getValue } = renderField('gone', [previewResult(preview)], {
      storedIds: ['inst-gone'],
    })

    await screen.findByText('3 af 3 stofnunum verða á vottorðinu.')
    expect(getValue('institutionIds')).toEqual(['inst-b', 'inst-a', 'inst-c'])
  })

  it('shows the selection error', async () => {
    renderField('error', [previewResult(preview)], {
      errors: { institutionIds: 'Veldu að minnsta kosti eina stofnun.' },
    })

    expect(
      await screen.findByText('Veldu að minnsta kosti eina stofnun.'),
    ).toBeInTheDocument()
  })

  it('blocks submit when the preview has no institutions', async () => {
    const { setSubmitButtonDisabled } = renderField('empty', [
      previewResult({ ...preview, institutions: [] }),
    ])

    expect(
      await screen.findByText('Engar upplýsingar fundust'),
    ).toBeInTheDocument()
    expect(setSubmitButtonDisabled).not.toHaveBeenCalledWith(false)
  })

  it('tells the applicant when the history changed since the last attempt', async () => {
    renderField('changed', [previewResult(preview)], {
      externalData: {
        [SUBMIT_RESULT_ID]: {
          status: 'failure',
          date: new Date(),
          statusCode: 409,
          data: {},
        },
      },
    })

    expect(
      await screen.findByText('Starfsferillinn hefur breyst'),
    ).toBeInTheDocument()
  })

  it('blocks submit when the history cannot be fetched, and can retry', async () => {
    const { setSubmitButtonDisabled } = renderField('unavailable', [
      previewFailure,
      previewResult(preview),
    ])

    expect(
      await screen.findByText('Ekki er hægt að senda umsóknina'),
    ).toBeInTheDocument()
    expect(setSubmitButtonDisabled).not.toHaveBeenCalledWith(false)

    await userEvent.click(screen.getByRole('button', { name: 'Reyna aftur' }))

    expect(
      await screen.findByText('3 af 3 stofnunum verða á vottorðinu.'),
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(setSubmitButtonDisabled).toHaveBeenLastCalledWith(false),
    )
  })
})
