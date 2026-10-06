import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'

import { Feature } from '@island.is/judicial-system/types'
import { FeatureContext } from '@island.is/judicial-system-web/src/components/FeatureProvider/FeatureProvider'
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

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      pathname: '',
      query: {},
    }
  },
}))

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
    features: Feature[] = [Feature.INDICTMENT_APPEAL],
  ) =>
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <IntlProviderWrapper>
          <FeatureContext.Provider value={{ features, isLoading: false }}>
            <UserContextWrapper
              userRole={userRole}
              nationalId={defenderNationalId}
            >
              <FormContextWrapper theCase={theCase}>
                <VerdictAppealFiles />
              </FormContextWrapper>
            </UserContextWrapper>
          </FeatureContext.Provider>
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
    const appealed = (
      caseFiles: Case['caseFiles'],
      appealSummonses: Case['appealSummonses'] = [],
    ): Case => ({
      ...theCase(caseFiles),
      verdictAppealCase: {
        id: 'verdict_appeal_id',
        appealType: AppealCaseType.VERDICT,
        appealState: AppealCaseState.APPEALED,
      },
      appealSummonses,
    })

    // The prosecution can appeal without filing a declaration, and the office
    // still has a summons to issue.
    it('should tell the public prosecution office none has been issued, even before any declaration', async () => {
      renderSection(appealed([]), UserRole.PUBLIC_PROSECUTOR_STAFF)

      expect(await screen.findByText('Áfrýjunarferli')).toBeInTheDocument()
      expect(
        screen.getByText('Áfrýjunarstefna hefur ekki verið gefin út'),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Gefa út áfrýjunarstefnu' }),
      ).toBeInTheDocument()
    })

    it('should hide the summons subsection while the feature is off', async () => {
      renderSection(appealed([declaration]), UserRole.PUBLIC_PROSECUTOR_STAFF, [])

      expect(await screen.findByText('yfirlysing.pdf')).toBeInTheDocument()
      expect(
        screen.queryByText('Áfrýjunarstefna hefur ekki verið gefin út'),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: 'Gefa út áfrýjunarstefnu' }),
      ).not.toBeInTheDocument()
    })

    it('should list a draft summons above the declarations', async () => {
      renderSection(
        appealed([declaration], [
          {
            id: 'summons_id',
            defendants: [],
          },
        ]),
        UserRole.PUBLIC_PROSECUTOR_STAFF,
      )

      const summons = await screen.findByText('Áfrýjunarstefna.pdf')

      expect(
        screen.queryByText('Áfrýjunarstefna hefur ekki verið gefin út'),
      ).not.toBeInTheDocument()
      expect(
        summons.compareDocumentPosition(screen.getByText('yfirlysing.pdf')) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy()
      expect(
        screen.getByRole('button', {
          name: 'Valmynd fyrir Áfrýjunarstefna.pdf',
        }),
      ).toBeInTheDocument()
    })

    it('should list the empty summons line above the declarations', async () => {
      renderSection(appealed([declaration]), UserRole.PUBLIC_PROSECUTOR_STAFF)

      const empty = await screen.findByText(
        'Áfrýjunarstefna hefur ekki verið gefin út',
      )

      expect(
        empty.compareDocumentPosition(screen.getByText('yfirlysing.pdf')) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy()
    })

    it('should not show it to a defender', async () => {
      renderSection(appealed([declaration]))

      expect(await screen.findByText('yfirlysing.pdf')).toBeInTheDocument()
      expect(
        screen.queryByText('Áfrýjunarstefna hefur ekki verið gefin út'),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: 'Gefa út áfrýjunarstefnu' }),
      ).not.toBeInTheDocument()
    })

    it('should not show it to the court of appeals', async () => {
      renderSection(appealed([declaration]), UserRole.COURT_OF_APPEALS_JUDGE)

      expect(await screen.findByText('yfirlysing.pdf')).toBeInTheDocument()
      expect(
        screen.queryByText('Áfrýjunarstefna hefur ekki verið gefin út'),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: 'Gefa út áfrýjunarstefnu' }),
      ).not.toBeInTheDocument()
    })
  })
})
