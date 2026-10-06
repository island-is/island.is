import { render, screen } from '@testing-library/react'

import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import {
  CaseFileCategory,
  CaseState,
  CaseType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  mockCase,
  mockCaseFile,
} from '@island.is/judicial-system-web/src/utils/mocks'
import {
  ApolloProviderWrapper,
  IntlProviderWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import IndictmentCaseFilesList from './IndictmentCaseFilesList'

describe('IndictmentCaseFilesList', () => {
  // The verdict service certificate. A completed case whose defendant has a
  // served verdict is the only state in which the row can appear at all.
  const caseWithServedVerdict = {
    ...mockCase(CaseType.INDICTMENT),
    state: CaseState.COMPLETED,
    defendants: [
      {
        id: 'defendant-id',
        name: 'Jón Sigurður Jónsson',
        verdict: {
          serviceDate: '2026-06-01T00:00:00.000Z',
          externalPoliceDocumentId: 'police-document-id',
        },
      },
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any

  const renderForRole = (role: UserRole) =>
    render(
      <IntlProviderWrapper>
        <ApolloProviderWrapper>
          <UserContext.Provider
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value={
              {
                user: { role, institution: { type: institutionFor(role) } },
              } as any
            }
          >
            {/* The ruling-and-court-record section sits inside the block
                that only renders when the case has files of its own, and a
                certificate is not one of them. */}
            <IndictmentCaseFilesList
              workingCase={caseWithServedVerdict}
              forceDisplayAdditionalFiles
            />
          </UserContext.Provider>
        </ApolloProviderWrapper>
      </IntlProviderWrapper>,
    )

  const institutionFor = (role: UserRole) =>
    role === UserRole.COURT_OF_APPEALS_JUDGE
      ? InstitutionType.COURT_OF_APPEALS
      : InstitutionType.PUBLIC_PROSECUTORS_OFFICE

  it('offers the verdict service certificate to the public prosecution office', async () => {
    renderForRole(UserRole.PUBLIC_PROSECUTOR_STAFF)

    expect(
      await screen.findByText('Birtingarvottorð Jón Sigurður Jónsson.pdf'),
    ).toBeInTheDocument()
  })

  // This certifies service of the verdict. The only list of theirs that
  // reaches this component is the ruling appeal, a different proceeding, and
  // the backend route admits neither of their roles - so the row was a link
  // that answered 403.
  it('does not offer it to the court of appeals', () => {
    renderForRole(UserRole.COURT_OF_APPEALS_JUDGE)

    expect(
      screen.queryByText('Birtingarvottorð Jón Sigurður Jónsson.pdf'),
    ).not.toBeInTheDocument()
  })

  it('should render court records if there are courtRecord case files', async () => {
    render(
      <IntlProviderWrapper>
        <ApolloProviderWrapper>
          <IndictmentCaseFilesList
            workingCase={{
              ...mockCase(CaseType.INDICTMENT),
              caseFiles: [mockCaseFile(CaseFileCategory.COURT_RECORD)],
            }}
          />
        </ApolloProviderWrapper>
      </IntlProviderWrapper>,
    )

    expect(await screen.findByTestId('PDFButton')).toBeInTheDocument()
  })

  it('should only show defender-visible case file records', async () => {
    render(
      <IntlProviderWrapper>
        <ApolloProviderWrapper>
          <UserContext.Provider
            value={{
              user: {
                id: 'defender-user-id',
                role: UserRole.DEFENDER,
                nationalId: '1234567890',
                name: 'Defender',
              },
            }}
          >
            <IndictmentCaseFilesList
              workingCase={{
                ...mockCase(CaseType.INDICTMENT),
                policeCaseNumbers: ['007-2026-1', '007-2026-2', '007-2026-3'],
                defendants: [
                  {
                    id: 'defendant-1',
                    isDefenderChoiceConfirmed: true,
                    defenderNationalId: '1234567890',
                    policeCaseNumbers: ['007-2026-1'],
                  },
                  {
                    id: 'defendant-2',
                    isDefenderChoiceConfirmed: true,
                    defenderNationalId: '0987654321',
                    policeCaseNumbers: ['007-2026-2'],
                  },
                ],
              }}
            />
          </UserContext.Provider>
        </ApolloProviderWrapper>
      </IntlProviderWrapper>,
    )

    expect(
      await screen.findByText(/Skjalaskrá 007-2026-1\.pdf/),
    ).toBeInTheDocument()
    expect(screen.queryByText(/Skjalaskrá 007-2026-3\.pdf/)).toBeInTheDocument()
    expect(
      screen.queryByText(/Skjalaskrá 007-2026-2\.pdf/),
    ).not.toBeInTheDocument()
  })

  it('should only show spokesperson-visible case file records', async () => {
    render(
      <IntlProviderWrapper>
        <ApolloProviderWrapper>
          <UserContext.Provider
            value={{
              user: {
                id: 'spokesperson-user-id',
                role: UserRole.DEFENDER,
                nationalId: '1234567890',
                name: 'Spokesperson',
              },
            }}
          >
            <IndictmentCaseFilesList
              workingCase={{
                ...mockCase(CaseType.INDICTMENT),
                policeCaseNumbers: ['007-2026-1', '007-2026-2', '007-2026-3'],
                defendants: [
                  {
                    id: 'defendant-1',
                    isDefenderChoiceConfirmed: true,
                    defenderNationalId: '0987654321',
                    policeCaseNumbers: ['007-2026-2'],
                  },
                ],
                civilClaimants: [
                  {
                    id: 'civil-claimant-1',
                    hasSpokesperson: true,
                    isSpokespersonConfirmed: true,
                    caseFilesSharedWithSpokesperson: true,
                    spokespersonNationalId: '1234567890',
                    policeCaseNumbers: ['007-2026-1'],
                  },
                ],
              }}
            />
          </UserContext.Provider>
        </ApolloProviderWrapper>
      </IntlProviderWrapper>,
    )

    expect(
      await screen.findByText(/Skjalaskrá 007-2026-1\.pdf/),
    ).toBeInTheDocument()
    expect(screen.queryByText(/Skjalaskrá 007-2026-3\.pdf/)).toBeInTheDocument()
    expect(
      screen.queryByText(/Skjalaskrá 007-2026-2\.pdf/),
    ).not.toBeInTheDocument()
  })

  it('should show all case file records for spokesperson when civil claimant has no police case numbers', async () => {
    render(
      <IntlProviderWrapper>
        <ApolloProviderWrapper>
          <UserContext.Provider
            value={{
              user: {
                id: 'spokesperson-user-id',
                role: UserRole.DEFENDER,
                nationalId: '1234567890',
                name: 'Spokesperson',
              },
            }}
          >
            <IndictmentCaseFilesList
              workingCase={{
                ...mockCase(CaseType.INDICTMENT),
                policeCaseNumbers: ['007-2026-1', '007-2026-2'],
                civilClaimants: [
                  {
                    id: 'civil-claimant-1',
                    hasSpokesperson: true,
                    isSpokespersonConfirmed: true,
                    caseFilesSharedWithSpokesperson: true,
                    spokespersonNationalId: '1234567890',
                    policeCaseNumbers: [],
                  },
                ],
              }}
            />
          </UserContext.Provider>
        </ApolloProviderWrapper>
      </IntlProviderWrapper>,
    )

    expect(
      await screen.findByText(/Skjalaskrá 007-2026-1\.pdf/),
    ).toBeInTheDocument()
    expect(screen.queryByText(/Skjalaskrá 007-2026-2\.pdf/)).toBeInTheDocument()
  })

  it('should only show defender-visible subpoenas', async () => {
    render(
      <IntlProviderWrapper>
        <ApolloProviderWrapper>
          <UserContext.Provider
            value={{
              user: {
                id: 'defender-user-id',
                role: UserRole.DEFENDER,
                nationalId: '1234567890',
                name: 'Defender',
              },
            }}
          >
            <IndictmentCaseFilesList
              workingCase={{
                ...mockCase(CaseType.INDICTMENT),
                defendants: [
                  {
                    id: 'defendant-1',
                    name: 'Defendant One',
                    isDefenderChoiceConfirmed: true,
                    defenderNationalId: '1234567890',
                    subpoenas: [
                      {
                        id: 'subpoena-1',
                        created: '2026-01-15T12:00:00.000Z',
                      },
                    ],
                  },
                  {
                    id: 'defendant-2',
                    name: 'Defendant Two',
                    isDefenderChoiceConfirmed: true,
                    defenderNationalId: '0987654321',
                    subpoenas: [
                      {
                        id: 'subpoena-2',
                        created: '2026-01-16T12:00:00.000Z',
                      },
                    ],
                  },
                ],
              }}
            />
          </UserContext.Provider>
        </ApolloProviderWrapper>
      </IntlProviderWrapper>,
    )

    expect(
      await screen.findByText(/Fyrirkall Defendant One/),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/Fyrirkall Defendant Two/),
    ).not.toBeInTheDocument()
  })
})
