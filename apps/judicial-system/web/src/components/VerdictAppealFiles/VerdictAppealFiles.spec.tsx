import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'

import type { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealCaseState,
  AppealCaseType,
  CaseFileCategory,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import VerdictAppealFiles from './VerdictAppealFiles'

/**
 * Which files reach the section, and for whom, is covered in
 * VerdictAppealFiles.logic.spec.ts. What is left for the rendered section is
 * that the rows carry the file, its date and who filed it, and that the
 * section stays away when there is nothing to show.
 */
describe('VerdictAppealFiles', () => {
  const defenderNationalId = '1111111111'

  const theCase = (
    caseFiles: Case['caseFiles'],
    appealDefenderName?: string,
  ): Case => ({
    ...mockCase(CaseType.INDICTMENT),
    defendants: [
      {
        id: 'own_client_id',
        name: 'Eigin sakborningur',
        isDefenderChoiceConfirmed: true,
        defenderNationalId,
        defenderName: 'Lára Lögmann',
        appealDefenderName,
      },
    ],
    caseFiles,
  })

  const declaration = {
    id: 'declaration_id',
    name: 'yfirlysing.pdf',
    category: CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
    defendantId: 'own_client_id',
    created: '2026-06-04T13:34:00.000Z',
    isKeyAccessible: true,
  }

  const renderSection = (
    theCase: Case,
    userRole: UserRole = UserRole.DEFENDER,
  ) =>
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <IntlProviderWrapper>
          <UserContextWrapper
            userRole={userRole}
            nationalId={defenderNationalId}
          >
            <FormContextWrapper theCase={theCase}>
              <VerdictAppealFiles />
            </FormContextWrapper>
          </UserContextWrapper>
        </IntlProviderWrapper>
      </MockedProvider>,
    )

  it('should render nothing when no declaration has been filed', () => {
    renderSection(theCase([]))

    expect(screen.queryByText('Áfrýjunarferli')).not.toBeInTheDocument()
  })

  it('should render the declaration with its date and who filed it', async () => {
    renderSection(
      theCase([
        {
          id: 'declaration_id',
          name: 'yfirlysing.pdf',
          category: CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
          defendantId: 'own_client_id',
          created: '2026-06-04T13:34:00.000Z',
          isKeyAccessible: true,
        },
      ]),
    )

    expect(await screen.findByText('Áfrýjunarferli')).toBeInTheDocument()
    expect(screen.getByText('yfirlysing.pdf')).toBeInTheDocument()
    // Date only: an appeal registered on a letter has no time of day, so
    // showing one here would make the two paths look inconsistent.
    expect(screen.getByText('04.06.2026')).toBeInTheDocument()
    expect(screen.queryByText(/kl\./)).not.toBeInTheDocument()
    expect(screen.getByText('Verjandi (LL) sendi inn')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Valmynd fyrir yfirlysing.pdf' }),
    ).toBeInTheDocument()
  })

  // When the public prosecution office registered the appeal on a letter, the
  // defender who wrote that letter sent the declaration in, not the defender of
  // record.
  it('should name the defender who appealed when one was recorded', async () => {
    renderSection(theCase([declaration], 'Vaka Dagsdóttir'))

    expect(
      await screen.findByText('Verjandi (VD) sendi inn'),
    ).toBeInTheDocument()
  })

  describe('the appeal summons', () => {
    const appealed = (caseFiles: Case['caseFiles']): Case => ({
      ...theCase(caseFiles),
      verdictAppealCase: {
        id: 'verdict_appeal_id',
        appealType: AppealCaseType.VERDICT,
        appealState: AppealCaseState.APPEALED,
      },
    })

    // The prosecution can appeal without filing a declaration, and the office
    // still has a summons to issue.
    it('should tell the public prosecution office none has been issued, even before any declaration', async () => {
      renderSection(appealed([]), UserRole.PUBLIC_PROSECUTOR_STAFF)

      expect(await screen.findByText('Áfrýjunarferli')).toBeInTheDocument()
      expect(
        screen.getByText('Áfrýjunarstefna hefur ekki verið gefin út'),
      ).toBeInTheDocument()
    })

    it('should list it above the declarations', async () => {
      renderSection(appealed([declaration]), UserRole.PUBLIC_PROSECUTOR_STAFF)

      const summons = await screen.findByText(
        'Áfrýjunarstefna hefur ekki verið gefin út',
      )

      expect(
        summons.compareDocumentPosition(screen.getByText('yfirlysing.pdf')) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy()
    })

    it('should not show it to a defender', async () => {
      renderSection(appealed([declaration]))

      expect(await screen.findByText('yfirlysing.pdf')).toBeInTheDocument()
      expect(
        screen.queryByText('Áfrýjunarstefna hefur ekki verið gefin út'),
      ).not.toBeInTheDocument()
    })

    it('should not show it to the court of appeals', async () => {
      renderSection(appealed([declaration]), UserRole.COURT_OF_APPEALS_JUDGE)

      expect(await screen.findByText('yfirlysing.pdf')).toBeInTheDocument()
      expect(
        screen.queryByText('Áfrýjunarstefna hefur ekki verið gefin út'),
      ).not.toBeInTheDocument()
    })
  })

  // Which parties get a letter is covered in the logic spec; what is left here
  // is that the row reaches the page and opens the pdf route rather than a
  // stored file.
  describe('the letter of appointment', () => {
    const confirmed = (caseFiles: Case['caseFiles']): Case => {
      const base = theCase(caseFiles, 'Vaka Dagsdóttir')

      return {
        ...base,
        defendants: (base.defendants ?? []).map((defendant) => ({
          ...defendant,
          isAppealDefenderConfirmed: true,
        })),
        verdictAppealCase: {
          id: 'verdict_appeal_id',
          appealType: AppealCaseType.VERDICT,
          appealState: AppealCaseState.APPEALED,
        },
      }
    }

    it('should offer the court of appeals a row per confirmed advocate', async () => {
      renderSection(confirmed([]), UserRole.COURT_OF_APPEALS_JUDGE)

      expect(await screen.findByText('Áfrýjunarferli')).toBeInTheDocument()
      expect(
        screen.getByText('Skipunarbréf Vaka Dagsdóttir.pdf'),
      ).toBeInTheDocument()
      expect(
        screen.getByTestId('appealAppointmentLetterPDFButton'),
      ).toBeInTheDocument()
    })

    it('should not offer it to a defender', () => {
      renderSection(confirmed([]))

      expect(screen.queryByText('Áfrýjunarferli')).not.toBeInTheDocument()
    })
  })
})
