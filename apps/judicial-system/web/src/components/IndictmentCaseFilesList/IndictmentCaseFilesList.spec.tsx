import { render, screen } from '@testing-library/react'

import {
  CaseFileCategory,
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
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import { UserContext } from '../UserProvider/UserProvider'
import IndictmentCaseFilesList from './IndictmentCaseFilesList'

describe('IndictmentCaseFilesList', () => {
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
