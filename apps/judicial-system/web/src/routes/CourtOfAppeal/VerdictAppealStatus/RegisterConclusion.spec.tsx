import type { FC, PropsWithChildren } from 'react'
import { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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
import {
  mockCase,
  mockCaseFile,
} from '@island.is/judicial-system-web/src/utils/mocks'
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

const caseWith = (
  verdictAppealCase: Partial<AppealCase> = {},
  caseFiles: WorkingCase['caseFiles'] = [],
) =>
  ({
    ...mockCase(CaseType.INDICTMENT),
    id: 'case-id',
    state: CaseState.COMPLETED,
    caseFiles,
    verdictAppealCase: {
      id: 'verdict-appeal',
      appealState: AppealCaseState.APPEALED,
      appealType: AppealCaseType.VERDICT,
      ...verdictAppealCase,
    },
  } as unknown as WorkingCase)

const rulingFile = {
  ...mockCaseFile(CaseFileCategory.VERDICT_APPEAL_RULING),
  name: 'domur-landsrettar.pdf',
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
    </FormContext.Provider>
  )
}

const onValidityChange = jest.fn()

const renderForm = (theCase: WorkingCase = caseWith()) =>
  render(
    <IntlProviderWrapper>
      <ApolloProviderWrapper>
        <UserContextWrapper userRole={UserRole.COURT_OF_APPEALS_ASSISTANT}>
          <StatefulFormContext theCase={theCase}>
            <RegisterConclusion onValidityChange={onValidityChange} />
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
      { appealRulingDecision: AppealCaseRulingDecision.REPEAL },
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
      { appealRulingType: AppealRulingType.RULING },
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
      { appealRulingType: AppealRulingType.RULING },
    )

    resolveFirst({ id: 'verdict-appeal' })

    await waitFor(() => expect(mockUpdateAppealCase).toHaveBeenCalledTimes(2))
    expect(mockUpdateAppealCase).toHaveBeenLastCalledWith(
      'case-id',
      'verdict-appeal',
      { appealRulingType: AppealRulingType.VERDICT },
    )
    expect(screen.getByRole('radio', { name: 'Dómur' })).toBeChecked()
  })

  describe('a save that fails', () => {
    it('leaves the outcome unpicked', async () => {
      mockUpdateAppealCase.mockResolvedValueOnce(undefined)
      renderForm(
        caseWith({ appealConclusion: recordedOutcome.appealConclusion }, [
          rulingFile,
        ]),
      )

      await userEvent.click(screen.getByRole('radio', { name: 'Staðfesting' }))

      await waitFor(() =>
        expect(
          screen.getByRole('radio', { name: 'Staðfesting' }),
        ).not.toBeChecked(),
      )
      expect(onValidityChange).toHaveBeenLastCalledWith(false)
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
      renderForm(caseWith(recordedOutcome, [rulingFile]))

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
      expect(onValidityChange).toHaveBeenLastCalledWith(true)
    })

    it('keeps the concluding words in the field but not as recorded', async () => {
      mockUpdateAppealCase.mockResolvedValueOnce(undefined)
      renderForm(
        caseWith({ ...recordedOutcome, appealConclusion: null }, [rulingFile]),
      )
      const field = screen.getByPlaceholderText('Hvert er dómsorð Landsréttar?')

      await userEvent.type(field, 'Óraskað')
      await userEvent.tab()

      await waitFor(() => expect(mockUpdateAppealCase).toHaveBeenCalledTimes(1))
      await waitFor(() =>
        expect(onValidityChange).toHaveBeenLastCalledWith(false),
      )
      expect(field).toHaveValue('Óraskað')

      await userEvent.type(field, ' dómur')
      await userEvent.tab()

      await waitFor(() =>
        expect(onValidityChange).toHaveBeenLastCalledWith(true),
      )
      expect(mockUpdateAppealCase).toHaveBeenLastCalledWith(
        'case-id',
        'verdict-appeal',
        { appealConclusion: 'Óraskað dómur' },
      )
    })
  })

  // A ruling appeal on the same case keeps its ruling in a category of its
  // own, and it has no place among this appeal's documents.
  it('lists only the verdict appeal document', () => {
    renderForm(
      caseWith(recordedOutcome, [
        rulingFile,
        {
          ...mockCaseFile(CaseFileCategory.APPEAL_RULING),
          name: 'urskurdur-kaera.pdf',
        },
      ]),
    )

    expect(screen.getByText('domur-landsrettar.pdf')).toBeInTheDocument()
    expect(screen.queryByText('urskurdur-kaera.pdf')).not.toBeInTheDocument()
  })

  describe('validity', () => {
    it('is in place with an outcome, a type, the words and the document', async () => {
      renderForm(caseWith(recordedOutcome, [rulingFile]))

      await waitFor(() =>
        expect(onValidityChange).toHaveBeenLastCalledWith(true),
      )
    })

    it('is not in place without the document', async () => {
      renderForm(caseWith(recordedOutcome))

      await waitFor(() =>
        expect(onValidityChange).toHaveBeenLastCalledWith(false),
      )
    })

    it('is not in place without the concluding words', async () => {
      renderForm(
        caseWith({ ...recordedOutcome, appealConclusion: null }, [rulingFile]),
      )

      await waitFor(() =>
        expect(onValidityChange).toHaveBeenLastCalledWith(false),
      )
    })

    it('follows the form as the court fills it in', async () => {
      renderForm(
        caseWith({ appealConclusion: recordedOutcome.appealConclusion }, [
          rulingFile,
        ]),
      )

      await waitFor(() =>
        expect(onValidityChange).toHaveBeenLastCalledWith(false),
      )

      await userEvent.click(screen.getByRole('radio', { name: 'Staðfesting' }))

      await waitFor(() =>
        expect(onValidityChange).toHaveBeenLastCalledWith(true),
      )
    })
  })
})
