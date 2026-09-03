import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'

import type { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import {
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

  const theCase = (caseFiles: Case['caseFiles']): Case => ({
    ...mockCase(CaseType.INDICTMENT),
    defendants: [
      {
        id: 'own_client_id',
        name: 'Eigin sakborningur',
        isDefenderChoiceConfirmed: true,
        defenderNationalId,
        defenderName: 'Lára Lögmann',
      },
    ],
    caseFiles,
  })

  const renderSection = (theCase: Case) =>
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <IntlProviderWrapper>
          <UserContextWrapper
            userRole={UserRole.DEFENDER}
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
    expect(screen.getByText(/04\.06\.2026 kl\. \d\d:\d\d/)).toBeInTheDocument()
    expect(screen.getByText('Verjandi (LL) lagði fram')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Valmynd fyrir yfirlysing.pdf' }),
    ).toBeInTheDocument()
  })
})
