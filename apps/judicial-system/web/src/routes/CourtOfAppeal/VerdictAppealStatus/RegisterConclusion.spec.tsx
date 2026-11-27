import type { FC, PropsWithChildren } from 'react'
import { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { FileUploadStatus } from '@island.is/island-ui/core'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import type { AppealCase } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealCaseType,
  AppealRulingType,
  CaseFileCategory,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import type { TUploadFile } from '@island.is/judicial-system-web/src/utils/hooks'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  ApolloProviderWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import RegisterConclusion from './RegisterConclusion'

const mockUpdateAppealCase = jest.fn()

jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useAppealCase',
  () => ({
    __esModule: true,
    default: () => ({ updateAppealCase: mockUpdateAppealCase }),
  }),
)

jest.mock('next/router', () => ({
  useRouter() {
    return { pathname: '', query: { appealCaseId: 'verdict-appeal' } }
  },
}))

const caseWith = (verdictAppealCase: Partial<AppealCase> = {}) =>
  ({
    ...mockCase(CaseType.INDICTMENT),
    id: 'case-id',
    state: CaseState.COMPLETED,
    verdictAppealCase: {
      id: 'verdict-appeal',
      appealState: AppealCaseState.APPEALED,
      appealType: AppealCaseType.VERDICT,
      ...verdictAppealCase,
    },
  } as unknown as WorkingCase)

const rulingFile: TUploadFile = {
  id: 'ruling-file',
  name: 'domur-landsrettar.pdf',
  status: FileUploadStatus.done,
  percent: 100,
  category: CaseFileCategory.VERDICT_APPEAL_RULING,
}

const recordedOutcome = {
  appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
  appealRulingType: AppealRulingType.VERDICT,
  appealConclusion: 'Hinn áfrýjaði dómur skal vera óraskaður.',
}

// Holds the case in state, unlike the shared wrapper, so what the form writes
// back shows in it.
const StatefulFormContext: FC<PropsWithChildren<{ theCase: WorkingCase }>> = ({
  theCase,
  children,
}) => {
  const [workingCase, setWorkingCase] = useState(theCase)

  return (
    <FormContext.Provider
      value={{
        workingCase,
        setWorkingCase,
        isLoadingWorkingCase: false,
        caseNotFound: false,
        isCaseUpToDate: true,
        refreshCase: jest.fn(),
        getCase: jest.fn(),
        isCreating: false,
      }}
    >
      {children}
      {/* What the form has written back to the appeal's state. */}
      <output data-testid="verdictAppealState">
        {workingCase.verdictAppealCase?.appealState}
      </output>
    </FormContext.Provider>
  )
}

const renderForm = (
  theCase: WorkingCase = caseWith(),
  rulingFiles: TUploadFile[] = [],
) =>
  render(
    <IntlProviderWrapper>
      <ApolloProviderWrapper>
        <UserContextWrapper userRole={UserRole.COURT_OF_APPEALS_ASSISTANT}>
          <StatefulFormContext theCase={theCase}>
            <RegisterConclusion
              rulingFiles={rulingFiles}
              onUpload={jest.fn()}
              onRemove={jest.fn()}
              onRetry={jest.fn()}
              onOpenFile={jest.fn()}
            />
          </StatefulFormContext>
        </UserContextWrapper>
      </ApolloProviderWrapper>
    </IntlProviderWrapper>,
  )

describe('RegisterConclusion', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUpdateAppealCase.mockResolvedValue({ id: 'verdict-appeal' })
  })

  it('offers no outcome and no type until the court picks one', () => {
    renderForm()

    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).not.toBeChecked()
    }
  })

  it('saves the first outcome as a verdict', async () => {
    renderForm()

    await userEvent.click(screen.getByRole('radio', { name: 'Staðfesting' }))

    expect(mockUpdateAppealCase).toHaveBeenCalledWith(
      'case-id',
      'verdict-appeal',
      {
        appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
        appealRulingType: AppealRulingType.VERDICT,
      },
    )
    expect(screen.getByRole('radio', { name: 'Staðfesting' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Dómur' })).toBeChecked()
  })

  it('leaves the type the court chose when the outcome changes', async () => {
    renderForm(
      caseWith({
        ...recordedOutcome,
        appealRulingType: AppealRulingType.RULING,
      }),
    )

    await userEvent.click(screen.getByRole('radio', { name: 'Fellt úr gildi' }))

    expect(mockUpdateAppealCase).toHaveBeenCalledWith(
      'case-id',
      'verdict-appeal',
      {
        appealRulingDecision: AppealCaseRulingDecision.REPEAL,
        appealRulingType: AppealRulingType.RULING,
      },
    )
    expect(screen.getByRole('radio', { name: 'Úrskurður' })).toBeChecked()
  })

  it('words the form as a verdict until the court says it is a ruling', async () => {
    renderForm(caseWith(recordedOutcome))

    expect(screen.getByRole('heading', { name: /Dómsorð/ })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Dómur Landsréttar/ }),
    ).toBeInTheDocument()

    await userEvent.click(screen.getByRole('radio', { name: 'Úrskurður' }))

    expect(mockUpdateAppealCase).toHaveBeenCalledWith(
      'case-id',
      'verdict-appeal',
      {
        appealRulingDecision: recordedOutcome.appealRulingDecision,
        appealRulingType: AppealRulingType.RULING,
      },
    )
    expect(
      screen.getByRole('heading', { name: /Úrskurðarorð/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Úrskurður Landsréttar/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Hvert er úrskurðarorð Landsréttar?'),
    ).toBeInTheDocument()
  })

  it('saves the concluding words when the court leaves the field', async () => {
    renderForm(
      caseWith({
        appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
        appealRulingType: AppealRulingType.VERDICT,
      }),
    )

    await userEvent.type(
      screen.getByPlaceholderText('Hvert er dómsorð Landsréttar?'),
      'Óraskað',
    )
    await userEvent.tab()

    expect(mockUpdateAppealCase).toHaveBeenCalledWith(
      'case-id',
      'verdict-appeal',
      { appealConclusion: 'Óraskað' },
    )
  })

  it('asks for the concluding words when the court leaves them empty', async () => {
    renderForm(caseWith(recordedOutcome))

    await userEvent.clear(
      screen.getByPlaceholderText('Hvert er dómsorð Landsréttar?'),
    )
    await userEvent.tab()

    expect(await screen.findByText('Reitur má ekki vera tómur')).toBeVisible()
    expect(mockUpdateAppealCase).not.toHaveBeenCalled()
  })

  it('stores two quick type changes in the order they were made', async () => {
    let resolveFirst: (value: unknown) => void = () => undefined
    mockUpdateAppealCase.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFirst = resolve
        }),
    )

    renderForm(caseWith(recordedOutcome))

    await userEvent.click(screen.getByRole('radio', { name: 'Úrskurður' }))
    await userEvent.click(screen.getByRole('radio', { name: 'Dómur' }))

    expect(mockUpdateAppealCase).toHaveBeenCalledTimes(1)
    expect(mockUpdateAppealCase).toHaveBeenLastCalledWith(
      'case-id',
      'verdict-appeal',
      {
        appealRulingDecision: recordedOutcome.appealRulingDecision,
        appealRulingType: AppealRulingType.RULING,
      },
    )

    resolveFirst({ id: 'verdict-appeal' })

    await waitFor(() => expect(mockUpdateAppealCase).toHaveBeenCalledTimes(2))
    expect(mockUpdateAppealCase).toHaveBeenLastCalledWith(
      'case-id',
      'verdict-appeal',
      {
        appealRulingDecision: recordedOutcome.appealRulingDecision,
        appealRulingType: AppealRulingType.VERDICT,
      },
    )
    expect(screen.getByRole('radio', { name: 'Dómur' })).toBeChecked()
  })

  // The first save writes the outcome with its type. Were the second to send
  // only the type, the outcome on the form would never reach the appeal.
  it('stores the outcome with a type chosen while its own save fails', async () => {
    let resolveFirst: (value: unknown) => void = () => undefined
    mockUpdateAppealCase.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFirst = resolve
        }),
    )

    renderForm()

    await userEvent.click(screen.getByRole('radio', { name: 'Staðfesting' }))
    await userEvent.click(screen.getByRole('radio', { name: 'Úrskurður' }))

    resolveFirst(undefined)

    await waitFor(() => expect(mockUpdateAppealCase).toHaveBeenCalledTimes(2))
    expect(mockUpdateAppealCase).toHaveBeenLastCalledWith(
      'case-id',
      'verdict-appeal',
      {
        appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
        appealRulingType: AppealRulingType.RULING,
      },
    )
    expect(screen.getByRole('radio', { name: 'Staðfesting' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Úrskurður' })).toBeChecked()
  })

  describe('a save that fails', () => {
    it('leaves the outcome unpicked', async () => {
      mockUpdateAppealCase.mockResolvedValueOnce(undefined)
      renderForm(
        caseWith({ appealConclusion: recordedOutcome.appealConclusion }),
      )

      await userEvent.click(screen.getByRole('radio', { name: 'Staðfesting' }))

      await waitFor(() =>
        expect(
          screen.getByRole('radio', { name: 'Staðfesting' }),
        ).not.toBeChecked(),
      )
    })

    it('leaves the type unpicked when it came with the first outcome', async () => {
      mockUpdateAppealCase.mockResolvedValueOnce(undefined)
      renderForm()

      await userEvent.click(screen.getByRole('radio', { name: 'Staðfesting' }))

      await waitFor(() =>
        expect(screen.getByRole('radio', { name: 'Dómur' })).not.toBeChecked(),
      )
      expect(
        screen.getByRole('radio', { name: 'Staðfesting' }),
      ).not.toBeChecked()
    })

    it('returns to the outcome the appeal holds', async () => {
      mockUpdateAppealCase.mockResolvedValueOnce(undefined)
      renderForm(caseWith(recordedOutcome))

      await userEvent.click(
        screen.getByRole('radio', { name: 'Fellt úr gildi' }),
      )

      await waitFor(() =>
        expect(
          screen.getByRole('radio', { name: 'Staðfesting' }),
        ).toBeChecked(),
      )
      expect(
        screen.getByRole('radio', { name: 'Fellt úr gildi' }),
      ).not.toBeChecked()
      expect(screen.getByRole('radio', { name: 'Dómur' })).toBeChecked()
    })
  })

  // A change to how a confirmed appeal ended takes it back on the backend, and
  // the response says so.
  describe('a confirmed appeal', () => {
    const confirmedCase = () =>
      caseWith({
        ...recordedOutcome,
        appealState: AppealCaseState.READY_TO_COMPLETE,
      })
    const appealState = () =>
      screen.getByTestId('verdictAppealState').textContent

    beforeEach(() => {
      mockUpdateAppealCase.mockResolvedValue({
        id: 'verdict-appeal',
        appealState: AppealCaseState.APPEALED,
      })
    })

    it('takes the state an outcome save returns and keeps the outcome picked', async () => {
      renderForm(confirmedCase())

      await userEvent.click(
        screen.getByRole('radio', { name: 'Fellt úr gildi' }),
      )

      await waitFor(() => expect(appealState()).toBe(AppealCaseState.APPEALED))
      expect(
        screen.getByRole('radio', { name: 'Fellt úr gildi' }),
      ).toBeChecked()
      expect(screen.getByRole('radio', { name: 'Dómur' })).toBeChecked()
    })

    it('takes the state a type save returns', async () => {
      renderForm(confirmedCase())

      await userEvent.click(screen.getByRole('radio', { name: 'Úrskurður' }))

      await waitFor(() => expect(appealState()).toBe(AppealCaseState.APPEALED))
      expect(screen.getByRole('radio', { name: 'Úrskurður' })).toBeChecked()
    })

    it('takes the state a save of the concluding words returns and keeps the words', async () => {
      renderForm(confirmedCase())

      const field = screen.getByPlaceholderText('Hvert er dómsorð Landsréttar?')

      await userEvent.clear(field)
      await userEvent.type(field, 'Óraskað')
      await userEvent.tab()

      await waitFor(() => expect(appealState()).toBe(AppealCaseState.APPEALED))
      expect(field).toHaveValue('Óraskað')
    })

    it('keeps its state when the response carries none', async () => {
      mockUpdateAppealCase.mockResolvedValue({ id: 'verdict-appeal' })
      renderForm(confirmedCase())

      await userEvent.click(screen.getByRole('radio', { name: 'Úrskurður' }))

      await waitFor(() => expect(mockUpdateAppealCase).toHaveBeenCalled())
      expect(appealState()).toBe(AppealCaseState.READY_TO_COMPLETE)
    })

    it('keeps its state when the save fails', async () => {
      mockUpdateAppealCase.mockResolvedValue(undefined)
      renderForm(confirmedCase())

      await userEvent.click(screen.getByRole('radio', { name: 'Úrskurður' }))

      await waitFor(() =>
        expect(screen.getByRole('radio', { name: 'Dómur' })).toBeChecked(),
      )
      expect(appealState()).toBe(AppealCaseState.READY_TO_COMPLETE)
    })
  })

  // Which of the case's files belong here is the page's to decide; the form
  // lists the ones it is given.
  it('lists the document it is given', () => {
    renderForm(caseWith(recordedOutcome), [rulingFile])

    expect(screen.getByText('domur-landsrettar.pdf')).toBeInTheDocument()
  })

  it('takes one document', () => {
    const { unmount } = renderForm()

    expect(
      screen.getByRole('button', { name: 'Velja gögn til að hlaða upp' }),
    ).toBeInTheDocument()

    unmount()
    renderForm(caseWith(recordedOutcome), [rulingFile])

    expect(
      screen.queryByRole('button', { name: 'Velja gögn til að hlaða upp' }),
    ).not.toBeInTheDocument()
  })
})
