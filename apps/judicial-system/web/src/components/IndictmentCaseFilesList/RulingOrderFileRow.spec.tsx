import type { ReactNode } from 'react'
import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import type {
  Case,
  CaseFile,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealCaseState,
  AppealCaseTransition,
  AppealDecisionPartyRole,
  CaseAppealDecision,
  CaseFileCategory,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  mockCase,
  mockJudge,
  mockProsecutor,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { IntlProviderWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'

import RulingOrderFileRow from './RulingOrderFileRow'

const mockTransitionAppealCase = jest.fn().mockResolvedValue(true)

jest.mock('next/router', () => ({
  __esModule: true,
  default: { push: jest.fn() },
}))

// Mock the leaf hook (re-exported by the utils/hooks barrel) rather than the
// barrel itself - requireActual on the barrel pulls in a circular dependency.
jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useAppealCase',
  () => ({
    __esModule: true,
    default: () => ({ transitionAppealCase: mockTransitionAppealCase }),
  }),
)

// District court sending an in-court ruling-order appeal straight to
// Landsréttur. An in-court appeal creates the appeal case in APPEALED state
// with no named appellant (appealedByRole/appealedByDefendantId are null), so
// the row must light up from appeal-case existence alone.
describe('RulingOrderFileRow - send in-court appeal to Court of appeals', () => {
  const rulingFileId = 'ruling-file-1'
  const appealCaseId = 'appeal-1'
  const appealedDate = '2026-06-05T14:30:00.000Z'
  const fileName = 'urskurdur.pdf'

  const inCourtAppealCase = {
    id: appealCaseId,
    rulingFileId,
    appealState: AppealCaseState.APPEALED,
    appealedInCourt: true,
    appealedDate,
  }

  const rulingOrderFile = {
    id: rulingFileId,
    name: fileName,
    category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
    hasBeenAppealed: true,
    isKeyAccessible: true,
    // The judge has confirmed the ruling order, so the district court may act
    // on the appeal.
    submissionDate: '2026-06-05T10:00:00.000Z',
  } as CaseFile

  const renderRow = (user: User, file: CaseFile = rulingOrderFile) => {
    const workingCase = {
      ...mockCase(CaseType.INDICTMENT),
      state: CaseState.RECEIVED,
      rulingOrderAppealCases: [inCourtAppealCase],
    } as Case

    const wrapInProviders = (children: ReactNode) => (
      <MockedProvider addTypename={false}>
        <IntlProviderWrapper>
          <UserContext.Provider value={{ user }}>
            <FormContext.Provider
              value={
                {
                  workingCase,
                  setWorkingCase: jest.fn(),
                  isLoadingWorkingCase: false,
                  caseNotFound: false,
                  isCaseUpToDate: true,
                  refreshCase: jest.fn(),
                  getCase: jest.fn(),
                  isCreating: false,
                } as unknown as React.ContextType<typeof FormContext>
              }
            >
              {children}
            </FormContext.Provider>
          </UserContext.Provider>
        </IntlProviderWrapper>
      </MockedProvider>
    )

    return render(
      wrapInProviders(
        <RulingOrderFileRow file={file} onOpenFile={jest.fn()} />,
      ),
    )
  }

  const openMenu = () =>
    fireEvent.click(screen.getByLabelText(`Valmynd fyrir ${fileName}`))

  afterEach(() => jest.clearAllMocks())

  it('shows the "Kært í þinghaldi" status for the in-court appeal', async () => {
    renderRow(mockJudge)

    expect(await screen.findByText(/Kært í þinghaldi/)).toBeInTheDocument()
  })

  it('offers "Senda til Landsréttar" to a district court user', async () => {
    renderRow(mockJudge)
    openMenu()

    expect(await screen.findByText('Senda til Landsréttar')).toBeInTheDocument()
  })

  it('receives the appeal (RECEIVE_APPEAL) when sending to Landsréttur', async () => {
    renderRow(mockJudge)
    openMenu()

    fireEvent.click(await screen.findByText('Senda til Landsréttar'))

    await waitFor(() =>
      expect(mockTransitionAppealCase).toHaveBeenCalledWith(
        expect.any(String),
        appealCaseId,
        AppealCaseTransition.RECEIVE_APPEAL,
      ),
    )
  })

  it('does not offer "Senda til Landsréttar" to the prosecution, only statements', async () => {
    renderRow(mockProsecutor)
    openMenu()

    expect(await screen.findByText('Senda inn greinargerð')).toBeInTheDocument()
    expect(screen.queryByText('Senda til Landsréttar')).not.toBeInTheDocument()
  })

  // The ruling order still awaits the judge's confirmation ("Staðfesta"), so
  // the district court gets no action menu at all - the appeal is not theirs to
  // forward yet.
  describe('before the ruling order has been confirmed', () => {
    const unconfirmedRulingOrderFile = {
      ...rulingOrderFile,
      submissionDate: null,
    } as CaseFile

    it('hides the action menu from a district court user', () => {
      renderRow(mockJudge, unconfirmedRulingOrderFile)

      expect(
        screen.queryByLabelText(`Valmynd fyrir ${fileName}`),
      ).not.toBeInTheDocument()
    })

    it('still shows the in-court appeal status to the district court', async () => {
      renderRow(mockJudge, unconfirmedRulingOrderFile)

      expect(await screen.findByText(/Kært í þinghaldi/)).toBeInTheDocument()
    })

    it('keeps the prosecution actions available', async () => {
      renderRow(mockProsecutor, unconfirmedRulingOrderFile)
      openMenu()

      expect(
        await screen.findByText('Senda inn greinargerð'),
      ).toBeInTheDocument()
    })
  })
})

// A party that accepted the ruling in court ("unir úrskurðinum") has waived its
// appeal right, so the appeal action must be hidden for it.
describe('RulingOrderFileRow - hide appeal action for an accepted party', () => {
  const rulingFileId = 'ruling-file-appeal'
  const defendantId = 'defendant-appeal'
  const fileName = 'urskurdur-til-kaeru.pdf'

  const defenceUser = {
    id: 'defender-user',
    role: UserRole.DEFENDER,
    nationalId: '1234567890',
  } as User

  const renderForDecision = (decision: CaseAppealDecision) => {
    const file = {
      id: rulingFileId,
      name: fileName,
      category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
      canBeAppealed: true,
      isKeyAccessible: true,
    } as CaseFile

    const workingCase = {
      ...mockCase(CaseType.INDICTMENT),
      state: CaseState.RECEIVED,
      defendants: [
        {
          id: defendantId,
          isDefenderChoiceConfirmed: true,
          defenderNationalId: defenceUser.nationalId,
        },
      ],
      appealDecisions: [
        {
          rulingFileId,
          partyRole: AppealDecisionPartyRole.DEFENDANT,
          defendantId,
          decision,
        },
      ],
      rulingOrderAppealCases: [],
    } as unknown as Case

    return render(
      <MockedProvider addTypename={false}>
        <IntlProviderWrapper>
          <UserContext.Provider value={{ user: defenceUser }}>
            <FormContext.Provider
              value={
                {
                  workingCase,
                  setWorkingCase: jest.fn(),
                  isLoadingWorkingCase: false,
                  caseNotFound: false,
                  isCaseUpToDate: true,
                  refreshCase: jest.fn(),
                  getCase: jest.fn(),
                  isCreating: false,
                } as unknown as React.ContextType<typeof FormContext>
              }
            >
              <RulingOrderFileRow file={file} onOpenFile={jest.fn()} />
            </FormContext.Provider>
          </UserContext.Provider>
        </IntlProviderWrapper>
      </MockedProvider>,
    )
  }

  afterEach(() => jest.clearAllMocks())

  it('hides the appeal action and the "Kærufrestur" deadline when the defendant accepted', () => {
    renderForDecision(CaseAppealDecision.ACCEPT)

    // The appeal action is the only menu item in this state, so with it gone the
    // action menu trigger is not rendered at all.
    expect(
      screen.queryByLabelText(`Valmynd fyrir ${fileName}`),
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/Kærufrestur/)).not.toBeInTheDocument()
  })

  it('shows the appeal action and the "Kærufrestur" deadline on POSTPONE', async () => {
    renderForDecision(CaseAppealDecision.POSTPONE)

    expect(screen.getByText(/Kærufrestur/)).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText(`Valmynd fyrir ${fileName}`))
    expect(await screen.findByText('Senda inn kæru')).toBeInTheDocument()
  })
})

// Any party that appealed in court may withdraw its own appeal, but only while
// it has not already withdrawn (mirrors the backend userHasActiveInCourtAppeal).
describe('RulingOrderFileRow - withdraw an in-court appeal', () => {
  const rulingFileId = 'ruling-file-withdraw'
  const defendantId = 'defendant-withdraw'
  const appealCaseId = 'appeal-withdraw'
  const fileName = 'urskurdur-kaera.pdf'
  const defenderNationalId = '1234567890'

  const defenceUser = {
    id: 'defender-user',
    role: UserRole.DEFENDER,
    nationalId: defenderNationalId,
  } as User

  const renderForWithdrawnState = (withdrawn: boolean) => {
    const file = {
      id: rulingFileId,
      name: fileName,
      category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
      hasBeenAppealed: true,
      isKeyAccessible: true,
    } as CaseFile

    const workingCase = {
      ...mockCase(CaseType.INDICTMENT),
      state: CaseState.RECEIVED,
      defendants: [
        {
          id: defendantId,
          isDefenderChoiceConfirmed: true,
          defenderNationalId,
        },
      ],
      appealDecisions: [
        {
          rulingFileId,
          partyRole: AppealDecisionPartyRole.DEFENDANT,
          defendantId,
          decision: CaseAppealDecision.APPEAL,
          ...(withdrawn ? { withdrawnDate: '2026-06-05T12:00:00.000Z' } : {}),
        },
      ],
      rulingOrderAppealCases: [
        {
          id: appealCaseId,
          rulingFileId,
          appealState: AppealCaseState.APPEALED,
          appealedInCourt: true,
        },
      ],
    } as unknown as Case

    return render(
      <MockedProvider addTypename={false}>
        <IntlProviderWrapper>
          <UserContext.Provider value={{ user: defenceUser }}>
            <FormContext.Provider
              value={
                {
                  workingCase,
                  setWorkingCase: jest.fn(),
                  isLoadingWorkingCase: false,
                  caseNotFound: false,
                  isCaseUpToDate: true,
                  refreshCase: jest.fn(),
                  getCase: jest.fn(),
                  isCreating: false,
                } as unknown as React.ContextType<typeof FormContext>
              }
            >
              <RulingOrderFileRow file={file} onOpenFile={jest.fn()} />
            </FormContext.Provider>
          </UserContext.Provider>
        </IntlProviderWrapper>
      </MockedProvider>,
    )
  }

  afterEach(() => jest.clearAllMocks())

  it('offers "Afturkalla kæru" to an active in-court appellant', async () => {
    renderForWithdrawnState(false)

    fireEvent.click(screen.getByLabelText(`Valmynd fyrir ${fileName}`))
    expect(await screen.findByText('Afturkalla kæru')).toBeInTheDocument()
  })

  it('hides "Afturkalla kæru" once the party has withdrawn', async () => {
    renderForWithdrawnState(true)

    fireEvent.click(screen.getByLabelText(`Valmynd fyrir ${fileName}`))
    // Still a defence party, so the menu exists (statement / add files) - just
    // not the withdraw action.
    expect(await screen.findByText('Bæta við gögnum')).toBeInTheDocument()
    expect(screen.queryByText('Afturkalla kæru')).not.toBeInTheDocument()
  })
})

// A ruling order pronounced orally has no document until the district court
// writes it up, which it only does if the ruling is appealed. Until then the row
// says so with a bubble, opens nothing, and offers the court only the upload.
describe('RulingOrderFileRow - ruling order pronounced orally', () => {
  const rulingFileId = 'ruling-file-oral'
  const fileName = 'S-123/2026 Úrskurður 12.11.2026'

  const pronouncedOrally = {
    id: rulingFileId,
    name: fileName,
    userGeneratedFilename: fileName,
    category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
    isPronouncedOrally: true,
    key: '',
    isKeyAccessible: true,
    canBeAppealed: true,
    appealDeadline: '2026-11-15T11:37:00.000Z',
  } as CaseFile

  const onOpenFile = jest.fn()

  const renderRow = (user: User, file: CaseFile = pronouncedOrally) => {
    const workingCase = {
      ...mockCase(CaseType.INDICTMENT),
      state: CaseState.RECEIVED,
      judge: mockJudge,
      rulingOrderAppealCases: [],
    } as Case

    return render(
      <MockedProvider addTypename={false}>
        <IntlProviderWrapper>
          <UserContext.Provider value={{ user }}>
            <FormContext.Provider
              value={
                {
                  workingCase,
                  setWorkingCase: jest.fn(),
                  isLoadingWorkingCase: false,
                  caseNotFound: false,
                  isCaseUpToDate: true,
                  refreshCase: jest.fn(),
                  getCase: jest.fn(),
                  isCreating: false,
                } as unknown as React.ContextType<typeof FormContext>
              }
            >
              <RulingOrderFileRow file={file} onOpenFile={onOpenFile} />
            </FormContext.Provider>
          </UserContext.Provider>
        </IntlProviderWrapper>
      </MockedProvider>,
    )
  }

  afterEach(() => jest.clearAllMocks())

  it('says the ruling was pronounced orally', () => {
    renderRow(mockJudge)

    expect(
      screen.getByText('Úrskurður kveðinn upp munnlega'),
    ).toBeInTheDocument()
  })

  it('opens nothing, since there is no document behind it', () => {
    renderRow(mockJudge)

    fireEvent.click(screen.getByText(fileName))

    expect(onOpenFile).not.toHaveBeenCalled()
  })

  it('offers the district court only the upload', async () => {
    renderRow(mockJudge)

    fireEvent.click(screen.getByLabelText(`Valmynd fyrir ${fileName}`))

    expect(await screen.findByText('Hlaða upp úrskurði')).toBeInTheDocument()
    expect(screen.queryByText('Senda til Landsréttar')).not.toBeInTheDocument()
  })

  it('does not ask the judge to confirm a ruling with no document', () => {
    renderRow(mockJudge)

    expect(screen.queryByText('Staðfesta')).not.toBeInTheDocument()
    expect(screen.queryByText('Bíður staðfestingar')).not.toBeInTheDocument()
  })

  it('asks the judge to confirm once the ruling has been written up', () => {
    renderRow(mockJudge, {
      ...pronouncedOrally,
      key: 'case-id/file-id/urskurdur.pdf',
    } as CaseFile)

    expect(screen.getByText('Staðfesta')).toBeInTheDocument()
  })

  it('lets the prosecution appeal the ruling that was pronounced', async () => {
    renderRow(mockProsecutor)

    fireEvent.click(screen.getByLabelText(`Valmynd fyrir ${fileName}`))

    expect(await screen.findByText('Senda inn kæru')).toBeInTheDocument()
  })
})
