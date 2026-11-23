import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import { ApolloError } from '@apollo/client'
import { FormSystemForm } from '@island.is/api/schema'
import { FormStatus } from '@island.is/form-system/enums'
import { toast } from '@island.is/island-ui/core'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ReactNode, useContext, useEffect } from 'react'
import { FormsContext, IFormsContext } from '../../../../context/FormsContext'
import { FormsProvider } from '../../../../context/FormsProvider'
import { TableRow } from './TableRow'

const mockUpdateFormStatus = jest.fn<(options: unknown) => Promise<unknown>>()
const mockGetForm = jest.fn<(options: unknown) => Promise<unknown>>()
const mockGetForms = jest.fn<(options: unknown) => Promise<unknown>>()
const mockGetAdmin = jest.fn<(options: unknown) => Promise<unknown>>()

const deferred = () => {
  let resolve!: (value: unknown) => void
  const promise = new Promise((res) => {
    resolve = res
  })
  return { promise, resolve }
}

jest.mock('@apollo/client', () => ({
  ...jest.requireActual<typeof import('@apollo/client')>('@apollo/client'),
  useLazyQuery: (query: unknown) => [
    query === 'GET_FORMS'
      ? mockGetForms
      : query === 'GET_ORGANIZATION_ADMIN'
      ? mockGetAdmin
      : mockGetForm,
  ],
  useMutation: () => [mockUpdateFormStatus],
}))
jest.mock('@island.is/form-system/graphql', () => ({
  GET_FORMS: 'GET_FORMS',
  GET_ORGANIZATION_ADMIN: 'GET_ORGANIZATION_ADMIN',
}))
jest.mock('@island.is/form-system/ui', () => ({
  m: {
    edit: { defaultMessage: 'Edit' },
    publish: { defaultMessage: 'Publish' },
    delete: { defaultMessage: 'Delete' },
    unpublish: { defaultMessage: 'Unpublish' },
    deleteFormWarning: { defaultMessage: 'Delete this form?' },
    unpublishFormWarning: { defaultMessage: 'Unpublish this form?' },
    unpublishFormWithRevisionWarning: {
      defaultMessage: 'Unpublish this form? The revision will also be deleted.',
    },
    publishedFormRevisionCreatedWarning: {
      defaultMessage:
        'Revision created. Unpublishing the original form will delete this revision.',
    },
    translationNeededError: { defaultMessage: 'Translation needed' },
  },
}))
jest.mock('@island.is/shared/utils', () => ({
  getStaticEnv: () => '',
}))
jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: (message?: { defaultMessage?: string }) =>
      message?.defaultMessage ?? '',
    formatDate: () => '',
  }),
}))
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({ search: '' }),
}))
jest.mock('../../../StatusTag/StatusTag', () => ({
  StatusTag: () => null,
}))
jest.mock('react-animate-height', () => ({
  __esModule: true,
  default: ({
    children,
    height,
  }: {
    children: ReactNode
    height: number | string
  }) => (height === 0 ? null : <div>{children}</div>),
}))
jest.mock('./TableRow.css', () => ({}))
jest.mock('@island.is/island-ui/core', () => {
  const Container = ({
    children,
    onClick,
  }: {
    children?: ReactNode
    onClick?: () => void
  }) => <div onClick={onClick}>{children}</div>
  return {
    Box: Container,
    Button: () => null,
    GridColumn: Container,
    DialogPrompt: ({
      description,
      buttonTextConfirm,
      onConfirm,
    }: {
      description: string
      buttonTextConfirm: string
      onConfirm: () => Promise<void>
    }) => (
      <>
        <span>{description}</span>
        <button onClick={onConfirm}>{buttonTextConfirm}</button>
      </>
    ),
    Divider: () => null,
    DropdownMenu: ({
      items,
    }: {
      items: {
        title: string
        onClick?: () => Promise<unknown>
        render?: () => ReactNode
      }[]
    }) => (
      <>
        {items
          .filter(
            (item) =>
              item.title === 'Publish' || item.title === 'Edit' || item.render,
          )
          .map((item) =>
            item.render ? (
              <div key={item.title}>{item.render()}</div>
            ) : (
              <button key={item.title} onClick={item.onClick}>
                {item.title}
              </button>
            ),
          )}
      </>
    ),
    Icon: ({ icon, color }: { icon: string; color?: string }) => (
      <span data-testid={`icon-${icon}`} data-color={color} />
    ),
    Inline: Container,
    GridRow: Container,
    Stack: Container,
    Text: ({ children, color }: { children?: ReactNode; color?: string }) => (
      <span data-color={color}>{children}</span>
    ),
    toast: { error: jest.fn(), warning: jest.fn() },
  }
})

describe('inaccessible forms', () => {
  it.each([true, false, undefined])(
    'shows a neutral lock and accordion notice only when isInaccessible is true (%s)',
    (isInaccessible) => {
      render(
        <TableRow
          name="Test form"
          isHeader={false}
          isInaccessible={isInaccessible}
          setFormsState={jest.fn()}
        />,
      )

      const name = screen.getByText('Test form')
      expect(name.getAttribute('data-color')).toBeNull()
      const lock = screen.queryByTestId('icon-lockClosed')
      if (isInaccessible) {
        expect(lock).not.toBeNull()
        expect(lock?.getAttribute('data-color')).toBeNull()
      } else {
        expect(lock).toBeNull()
      }
      expect(screen.queryByText('Eyðublaðið er ekki aðgengilegt.')).toBeNull()

      fireEvent.click(name)

      const notice = screen.queryByText('Eyðublaðið er ekki aðgengilegt.')
      if (isInaccessible) {
        expect(notice).not.toBeNull()
        expect(notice?.getAttribute('data-color')).toBeNull()
      } else {
        expect(notice).toBeNull()
      }
    },
  )
})

describe('publishing a form', () => {
  beforeEach(() => {
    mockGetForm.mockReset()
    mockUpdateFormStatus.mockReset()
    mockGetForms.mockReset()
    mockGetAdmin.mockReset().mockResolvedValue({
      data: { formSystemOrganizationAdmin: {} },
    })
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  const createForm = (
    overrides: Partial<FormSystemForm> = {},
  ): FormSystemForm => ({
    id: 'changed-form',
    name: { is: 'Changed form', en: 'Changed form' },
    status: FormStatus.PUBLISHED_BEING_CHANGED,
    slug: 'form-i-breytingu',
    created: '2026-01-01T00:00:00Z',
    modified: '2026-01-01T00:00:00Z',
    allowProceedOnValidationFail: false,
    draftDaysToLive: 0,
    enableApplicationPdfDownload: false,
    hasSummaryScreen: false,
    isInaccessible: true,
    isTranslated: true,
    submissionDaysToLive: 0,
    validateEligibility: false,
    ...overrides,
  })

  const renderChangedForm = (
    form = createForm(),
    otherForms: FormSystemForm[] = [],
  ) => {
    const forms = [form, ...otherForms]
    const formsUpdated = jest.fn<(forms: FormSystemForm[]) => void>()
    let latestContext: IFormsContext
    const Rows = () => {
      const context = useContext(FormsContext)
      latestContext = context
      useEffect(() => {
        if (context.forms !== forms) formsUpdated(context.forms)
      }, [context.forms])
      return (
        <>
          {context.forms.map((form) => (
            <TableRow
              key={form.id}
              id={form.id}
              name={form.name?.is ?? ''}
              slug={form.slug ?? ''}
              status={form.status}
              isInaccessible={form.isInaccessible}
              isHeader={false}
              setFormsState={context.setForms}
            />
          ))}
        </>
      )
    }
    render(
      <FormsProvider
        formsLoader={{
          forms,
          organizations: [],
          organizationId: 'organization',
          organizationNationalId: '1234567890',
          isAdmin: false,
          applications: [],
          selectedCertificationTypes: [],
          selectedListTypes: [],
          selectedFieldTypes: [],
          certificationTypes: [],
          listTypes: [],
          fieldTypes: [],
          submissionUrls: [],
          organizationDelegations: [],
        }}
      >
        <Rows />
      </FormsProvider>,
    )
    return { formsUpdated, getContext: () => latestContext }
  }

  it('warns after creating a revision and removes it from state when the original is unpublished', async () => {
    const original = createForm({
      id: 'original-form',
      status: FormStatus.PUBLISHED,
      slug: 'form',
    })
    const revision = createForm({ derivedFrom: original.id })
    const creation = deferred()
    mockGetForms.mockResolvedValue({
      data: { formSystemForms: { forms: [original] } },
    })
    mockUpdateFormStatus.mockReturnValueOnce(creation.promise)
    const { getContext } = renderChangedForm(original)

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    await waitFor(() =>
      expect(mockUpdateFormStatus).toHaveBeenCalledWith({
        variables: {
          input: {
            id: original.id,
            updateFormStatusDto: {
              newStatus: FormStatus.PUBLISHED_BEING_CHANGED,
            },
          },
        },
      }),
    )
    expect(toast.warning).not.toHaveBeenCalled()

    await act(async () => {
      creation.resolve({
        data: { updateFormSystemFormStatus: { form: revision } },
      })
    })

    expect(getContext().forms).toEqual([revision, original])
    expect(toast.warning).toHaveBeenCalledTimes(1)
    expect(toast.warning).toHaveBeenCalledWith(
      'Revision created. Unpublishing the original form will delete this revision.',
    )

    const unpublishedCopy = createForm({
      id: 'unpublished-copy',
      status: FormStatus.IN_DEVELOPMENT,
    })
    mockUpdateFormStatus.mockResolvedValueOnce({
      data: { updateFormSystemFormStatus: { form: unpublishedCopy } },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Unpublish' }))

    await waitFor(() => expect(getContext().forms).toEqual([unpublishedCopy]))
  })

  it.each(['request failure', 'missing revision'])(
    'does not show the revision-created warning on %s',
    async (failure) => {
      const original = createForm({ status: FormStatus.PUBLISHED })
      mockGetForms.mockResolvedValue({
        data: { formSystemForms: { forms: [original] } },
      })
      if (failure === 'request failure') {
        mockUpdateFormStatus.mockRejectedValue(new Error('Creation failed'))
      } else {
        mockUpdateFormStatus.mockResolvedValue({
          data: { updateFormSystemFormStatus: { form: null } },
        })
      }
      const { getContext } = renderChangedForm(original)

      fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith(
          'Ekki tókst að breyta útgefnu eyðublaði.',
        ),
      )
      expect(toast.warning).not.toHaveBeenCalled()
      expect(getContext().forms).toEqual([original])
    },
  )

  it('warns about deleting the revision and removes it when unpublishing succeeds', async () => {
    const original = createForm({
      id: 'original-form',
      status: FormStatus.PUBLISHED,
    })
    const revision = createForm({
      name: { is: 'Revision' },
      derivedFrom: original.id,
    })
    const unpublishedCopy = createForm({
      id: 'unpublished-copy',
      status: FormStatus.IN_DEVELOPMENT,
    })
    mockUpdateFormStatus.mockResolvedValue({
      data: { updateFormSystemFormStatus: { form: unpublishedCopy } },
    })
    const { getContext } = renderChangedForm(original, [revision])
    expect(
      screen.queryByText(
        'Unpublish this form? The revision will also be deleted.',
      ),
    ).not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Unpublish' }))

    await waitFor(() =>
      expect(mockUpdateFormStatus).toHaveBeenCalledWith({
        variables: {
          input: {
            id: original.id,
            updateFormStatusDto: { newStatus: FormStatus.ARCHIVED },
          },
        },
      }),
    )
    await waitFor(() => expect(getContext().forms).toEqual([unpublishedCopy]))
    expect(mockUpdateFormStatus).toHaveBeenCalledTimes(1)
    expect(toast.warning).not.toHaveBeenCalled()
  })

  it('retains the original and its revision when unpublishing fails', async () => {
    const original = createForm({
      id: 'original-form',
      status: FormStatus.PUBLISHED,
    })
    const revision = createForm({ derivedFrom: original.id })
    mockUpdateFormStatus.mockRejectedValue(new Error('Unpublish failed'))
    const { getContext } = renderChangedForm(original, [revision])

    fireEvent.click(screen.getByRole('button', { name: 'Unpublish' }))

    await waitFor(() =>
      expect(console.error).toHaveBeenCalledWith(
        'Error deleting form:',
        expect.any(Error),
      ),
    )
    expect(getContext().forms).toEqual([original, revision])
  })

  it.each([
    { derivedFrom: 'other-form', status: FormStatus.PUBLISHED_BEING_CHANGED },
    { derivedFrom: 'original-form', status: FormStatus.IN_DEVELOPMENT },
  ])(
    'allows unpublishing without an active derived revision (%o)',
    async (related) => {
      mockUpdateFormStatus.mockResolvedValue({
        data: { updateFormSystemFormStatus: { form: null } },
      })
      const relatedForm = createForm(related)
      const { getContext } = renderChangedForm(
        createForm({ id: 'original-form', status: FormStatus.PUBLISHED }),
        [relatedForm],
      )
      expect(
        screen.queryByText(
          'Unpublish this form? The revision will also be deleted.',
        ),
      ).not.toBeNull()
      fireEvent.click(screen.getByRole('button', { name: 'Unpublish' }))

      await waitFor(() => expect(mockUpdateFormStatus).toHaveBeenCalledTimes(1))
      await waitFor(() => expect(getContext().forms).toEqual([relatedForm]))
      expect(toast.warning).not.toHaveBeenCalled()
    },
  )

  it('warns about revision deletion even when no revision is loaded', () => {
    renderChangedForm(createForm({ status: FormStatus.PUBLISHED }))

    expect(
      screen.queryByText(
        'Unpublish this form? The revision will also be deleted.',
      ),
    ).not.toBeNull()
  })

  it.each([FormStatus.IN_DEVELOPMENT, FormStatus.PUBLISHED_BEING_CHANGED])(
    'keeps the ordinary delete confirmation for %s',
    (status) => {
      renderChangedForm(createForm({ status }))

      expect(screen.queryByText('Delete this form?')).not.toBeNull()
      expect(
        screen.queryByText(
          'Unpublish this form? The revision will also be deleted.',
        ),
      ).toBeNull()
    },
  )

  it.each([FormStatus.IN_DEVELOPMENT, FormStatus.PUBLISHED_BEING_CHANGED])(
    'clears the inaccessible lock and notice after publishing from %s',
    async (status) => {
      const form = createForm({
        id: 'form',
        name: { is: 'Test form', en: 'Test form' },
        status,
        slug:
          status === FormStatus.PUBLISHED_BEING_CHANGED
            ? 'form-i-breytingu'
            : 'form',
      })
      mockGetForm.mockResolvedValue({
        data: { formSystemForm: { form } },
      })
      mockUpdateFormStatus.mockResolvedValue({
        data: {
          updateFormSystemFormStatus: {
            form: { id: 'original-form', slug: 'form-archived-123' },
          },
        },
      })
      renderChangedForm(form)
      fireEvent.click(screen.getByText('Test form'))
      expect(screen.queryByTestId('icon-lockClosed')).not.toBeNull()
      expect(
        screen.queryByText('Eyðublaðið er ekki aðgengilegt.'),
      ).not.toBeNull()

      fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

      await waitFor(() =>
        expect(screen.queryByTestId('icon-lockClosed')).toBeNull(),
      )
      expect(screen.queryByText('Eyðublaðið er ekki aðgengilegt.')).toBeNull()
      expect(screen.queryByRole('button', { name: 'Publish' })).toBeNull()
    },
  )

  it.each([
    {
      failure: 'an unexpected publish error',
      error: new Error('Unexpected error publishing form'),
      failsWhileLoading: false,
    },
    {
      failure: 'a publish request that fails before reaching the server',
      error: new ApolloError({ networkError: new Error('Failed to fetch') }),
      failsWhileLoading: false,
    },
    {
      failure: 'a failed form query',
      error: new ApolloError({ networkError: new Error('Failed to fetch') }),
      failsWhileLoading: true,
    },
  ])(
    'reports $failure after reconciling any attempted publish',
    async ({ error, failsWhileLoading }) => {
      mockUpdateFormStatus.mockRejectedValue(error)
      mockGetForm.mockResolvedValue({
        data: { formSystemForm: { form: { id: 'changed-form' } } },
      })
      const refreshedForms = [
        createForm({
          status: FormStatus.IN_DEVELOPMENT,
          isInaccessible: true,
          name: { is: 'Refreshed form' },
        }),
      ]
      mockGetForms.mockResolvedValue({
        data: { formSystemForms: { forms: refreshedForms } },
      })
      if (failsWhileLoading) {
        mockGetForm.mockResolvedValueOnce({ error })
      }
      const { formsUpdated } = renderChangedForm()
      fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith(
          failsWhileLoading
            ? 'Ekki tókst að sækja eyðublaðið. Vinsamlegast reyndu aftur.'
            : 'Ekki er hægt að gefa út breytt eyðublað ef upphaflega útgefna formið hefur verið tekið úr útgáfu. Ef þetta á ekki við, vinsamlegast reyndu aftur.',
        ),
      )
      if (failsWhileLoading) {
        expect(mockUpdateFormStatus).not.toHaveBeenCalled()
        expect(mockGetForms).not.toHaveBeenCalled()
        expect(formsUpdated).not.toHaveBeenCalled()
      } else {
        expect(mockUpdateFormStatus).toHaveBeenCalledWith({
          variables: {
            input: {
              id: 'changed-form',
              updateFormStatusDto: { newStatus: FormStatus.PUBLISHED },
            },
          },
        })
        expect(mockGetForms).toHaveBeenCalledWith({
          variables: { input: { nationalId: '1234567890' } },
        })
        expect(formsUpdated).toHaveBeenCalledWith(refreshedForms)
        expect(screen.queryByText('Refreshed form')).not.toBeNull()
      }
      expect(toast.warning).not.toHaveBeenCalled()
      expect(screen.queryByTestId('icon-lockClosed')).not.toBeNull()
      expect(console.error).toHaveBeenCalledWith(
        'Error publishing form:',
        error,
      )
    },
  )

  it('waits for the refresh and adopts an already-published revision without reporting failure', async () => {
    mockGetForm.mockResolvedValue({
      data: { formSystemForm: { form: { id: 'changed-form' } } },
    })
    mockUpdateFormStatus.mockRejectedValue(new Error('File cleanup failed'))
    let finishRefresh: (result: unknown) => void = () => {
      throw new Error('Refresh has not started')
    }
    mockGetForms.mockReturnValue(
      new Promise((resolve) => {
        finishRefresh = resolve
      }),
    )
    const refreshedForms = [
      createForm({
        id: 'changed-form',
        status: FormStatus.PUBLISHED,
        slug: 'form',
        isInaccessible: false,
      }),
    ]
    const { formsUpdated } = renderChangedForm()
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => expect(mockGetForms).toHaveBeenCalledTimes(1))
    expect(formsUpdated).not.toHaveBeenCalled()
    expect(toast.error).not.toHaveBeenCalled()
    expect(toast.warning).not.toHaveBeenCalled()

    await act(async () => {
      finishRefresh({ data: { formSystemForms: { forms: refreshedForms } } })
    })

    expect(formsUpdated).toHaveBeenCalledWith(refreshedForms)
    expect(screen.queryByTestId('icon-lockClosed')).toBeNull()
    expect(toast.error).not.toHaveBeenCalled()
    expect(toast.warning).not.toHaveBeenCalled()
  })

  it('warns about an unknown outcome when the refreshed revision is still being changed', async () => {
    mockGetForm.mockResolvedValue({
      data: { formSystemForm: { form: createForm() } },
    })
    mockUpdateFormStatus.mockRejectedValue(new Error('Publish request failed'))
    mockGetForms.mockResolvedValue({
      data: { formSystemForms: { forms: [createForm()] } },
    })
    const { formsUpdated } = renderChangedForm()
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => expect(formsUpdated).toHaveBeenCalledTimes(1))
    expect(toast.warning).toHaveBeenCalledWith(
      'Ekki tókst að staðfesta hvort eyðublaðið var gefið út. Endurhladdu síðuna áður en þú reynir aftur.',
    )
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('keeps the translation warning for a successfully loaded form missing English text', async () => {
    mockGetForm.mockResolvedValue({
      data: { formSystemForm: { form: createForm({ name: { is: 'Form' } }) } },
    })
    renderChangedForm()
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() =>
      expect(toast.warning).toHaveBeenCalledWith('Translation needed'),
    )
    expect(toast.error).not.toHaveBeenCalled()
    expect(mockUpdateFormStatus).not.toHaveBeenCalled()
    expect(mockGetForms).not.toHaveBeenCalled()
  })

  it('discards a stale recovery response and retries without losing a copied form', async () => {
    mockGetForm.mockResolvedValue({
      data: { formSystemForm: { form: createForm() } },
    })
    mockUpdateFormStatus.mockRejectedValue(new Error('File cleanup failed'))
    const first = deferred()
    const retry = deferred()
    mockGetForms
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(retry.promise)
    const { formsUpdated, getContext } = renderChangedForm()
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))
    await waitFor(() => expect(mockGetForms).toHaveBeenCalledTimes(1))

    const copy = createForm({
      id: 'copy',
      name: { is: 'Copied form' },
      status: FormStatus.IN_DEVELOPMENT,
      isInaccessible: false,
    })
    act(() => getContext().setForms((forms) => [copy, ...forms]))
    expect(screen.queryByText('Copied form')).not.toBeNull()
    const published = createForm({
      status: FormStatus.PUBLISHED,
      isInaccessible: false,
    })
    await act(async () => {
      first.resolve({ data: { formSystemForms: { forms: [published] } } })
    })
    expect(mockGetForms).toHaveBeenCalledTimes(2)
    expect(screen.queryByText('Copied form')).not.toBeNull()
    expect(formsUpdated).not.toHaveBeenCalledWith([published])

    await act(async () => {
      retry.resolve({ data: { formSystemForms: { forms: [copy, published] } } })
    })
    expect(getContext().forms).toEqual([copy, published])
    expect(screen.queryByTestId('icon-lockClosed')).toBeNull()
    expect(toast.error).not.toHaveBeenCalled()
    expect(toast.warning).not.toHaveBeenCalled()
  })

  it("does not replace another organization's list with a pending recovery response", async () => {
    mockGetForm.mockResolvedValue({
      data: { formSystemForm: { form: createForm() } },
    })
    mockUpdateFormStatus.mockRejectedValue(new Error('File cleanup failed'))
    const refresh = deferred()
    const otherForm = createForm({
      id: 'other-form',
      name: { is: 'Organization B form' },
      status: FormStatus.IN_DEVELOPMENT,
      isInaccessible: false,
    })
    mockGetForms.mockReturnValueOnce(refresh.promise).mockResolvedValueOnce({
      data: { formSystemForms: { forms: [otherForm] } },
    })
    const { getContext } = renderChangedForm()
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))
    await waitFor(() => expect(mockGetForms).toHaveBeenCalledTimes(1))

    await act(async () => {
      await getContext().handleOrganizationChange?.({ value: 'organization-b' })
    })
    await act(async () => {
      refresh.resolve({ data: { formSystemForms: { forms: [] } } })
    })
    expect(getContext().organizationNationalId).toBe('organization-b')
    expect(getContext().forms).toEqual([otherForm])
    expect(screen.queryByText('Organization B form')).not.toBeNull()
    expect(mockGetForms).toHaveBeenCalledTimes(2)
    expect(toast.error).not.toHaveBeenCalled()
    expect(toast.warning).not.toHaveBeenCalled()
  })

  it('captures the selection generation before publishing, including switching away and back', async () => {
    mockGetForm.mockResolvedValue({
      data: { formSystemForm: { form: createForm() } },
    })
    let rejectPublish!: (error: Error) => void
    mockUpdateFormStatus.mockReturnValueOnce(
      new Promise((_resolve, reject) => {
        rejectPublish = reject
      }),
    )
    mockGetForms.mockResolvedValue({ data: { formSystemForms: { forms: [] } } })
    const { getContext } = renderChangedForm()
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))
    await waitFor(() => expect(mockUpdateFormStatus).toHaveBeenCalledTimes(1))

    await act(async () => {
      await getContext().handleOrganizationChange?.({ value: 'organization-b' })
    })
    await act(async () => {
      await getContext().handleOrganizationChange?.({ value: '1234567890' })
    })
    await act(async () => rejectPublish(new Error('File cleanup failed')))
    expect(getContext().organizationNationalId).toBe('1234567890')
    expect(mockGetForms).toHaveBeenCalledTimes(2)
    expect(toast.error).not.toHaveBeenCalled()
    expect(toast.warning).not.toHaveBeenCalled()
  })

  it.each([
    {
      failure: 'a rejected refresh',
      refresh: () => Promise.reject(new Error('Refresh failed')),
    },
    {
      failure: 'a refresh error alongside partial data',
      refresh: () =>
        Promise.resolve({
          error: new ApolloError({ networkError: new Error('Refresh failed') }),
          data: { formSystemForms: { forms: [] } },
        }),
    },
    {
      failure: 'a missing forms list',
      refresh: () => Promise.resolve({ data: {} }),
    },
  ])('reports an unconfirmed outcome for $failure', async ({ refresh }) => {
    mockGetForm.mockResolvedValue({
      data: { formSystemForm: { form: { id: 'changed-form' } } },
    })
    mockUpdateFormStatus.mockRejectedValue(new Error('Publish request failed'))
    mockGetForms.mockImplementation(refresh)
    const { formsUpdated } = renderChangedForm()
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() =>
      expect(toast.warning).toHaveBeenCalledWith(
        'Ekki tókst að staðfesta hvort eyðublaðið var gefið út. Endurhladdu síðuna áður en þú reynir aftur.',
      ),
    )
    expect(formsUpdated).not.toHaveBeenCalled()
    expect(toast.error).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith(
      'Error refreshing forms after publishing:',
      expect.any(Error),
    )
  })
})
