import { IntlProvider } from 'react-intl'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  Case,
  CaseAppealState,
  CaseFileCategory,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { mockCaseFile } from '../../utils/mocks'
import { FormContextWrapper, UserContextWrapper } from '../../utils/testHelpers'
import AppealCaseFilesOverview from './AppealCaseFilesOverview'

describe('<AppealCaseFilesOverview />', () => {
  test('should display a context menu for all files', async () => {
    const theCase = {
      id: 'asd',
      type: CaseType.CUSTODY,
      caseFiles: [
        mockCaseFile(CaseFileCategory.APPEAL_RULING),
        mockCaseFile(CaseFileCategory.APPEAL_RULING),
      ],
      state: CaseState.ACCEPTED,
      appealState: CaseAppealState.COMPLETED,
    } as Case

    render(
      <IntlProvider locale="is" onError={jest.fn}>
        <ApolloProvider
          client={new ApolloClient({ cache: new InMemoryCache() })}
        >
          <FormContextWrapper theCase={theCase}>
            <AppealCaseFilesOverview />
          </FormContextWrapper>
        </ApolloProvider>
      </IntlProvider>,
    )

    expect(await screen.findAllByRole('button')).toHaveLength(2)
  })

  test('should not have an option to delete file if the file is of category APPEAL_RULING', async () => {
    const theCase = {
      id: 'asd',
      type: CaseType.CUSTODY,
      caseFiles: [mockCaseFile(CaseFileCategory.APPEAL_RULING)],
      state: CaseState.ACCEPTED,
      appealState: CaseAppealState.COMPLETED,
    } as Case

    render(
      <IntlProvider locale="is" onError={jest.fn}>
        <ApolloProvider
          client={new ApolloClient({ cache: new InMemoryCache() })}
        >
          <FormContextWrapper theCase={theCase}>
            <AppealCaseFilesOverview />
          </FormContextWrapper>
        </ApolloProvider>
      </IntlProvider>,
    )
    const button = await screen.findByRole('button')
    await userEvent.click(button)
    expect(await screen.findAllByRole('menuitem')).toHaveLength(1)
  })

  test('should not have an option to delete file if the file of category PROSECUTOR_APPEAL_BRIEF even though the user is a prosecutor', async () => {
    const theCase = {
      id: 'asd',
      type: CaseType.CUSTODY,
      caseFiles: [mockCaseFile(CaseFileCategory.PROSECUTOR_APPEAL_BRIEF)],
      state: CaseState.ACCEPTED,
      appealState: CaseAppealState.COMPLETED,
      prosecutorPostponedAppealDate: '2021-09-01T00:00:00Z',
    } as Case

    render(
      <IntlProvider locale="is" onError={jest.fn}>
        <ApolloProvider
          client={new ApolloClient({ cache: new InMemoryCache() })}
        >
          <UserContextWrapper userRole={UserRole.PROSECUTOR}>
            <FormContextWrapper theCase={theCase}>
              <AppealCaseFilesOverview />
            </FormContextWrapper>
          </UserContextWrapper>
        </ApolloProvider>
      </IntlProvider>,
    )

    const button = await screen.findByRole('button')
    await userEvent.click(button)
    expect(await screen.findAllByRole('menuitem')).toHaveLength(1)
  })

  test('should not have an option to delete file if the file of category PROSECUTOR_APPEAL_CASE_FILE even though the user is a defender', async () => {
    const theCase = {
      id: 'asd',
      type: CaseType.CUSTODY,
      caseFiles: [mockCaseFile(CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE)],
      state: CaseState.ACCEPTED,
      appealState: CaseAppealState.COMPLETED,
    } as Case

    render(
      <IntlProvider locale="is" onError={jest.fn}>
        <ApolloProvider
          client={new ApolloClient({ cache: new InMemoryCache() })}
        >
          <UserContextWrapper userRole={UserRole.DEFENDER}>
            <FormContextWrapper theCase={theCase}>
              <AppealCaseFilesOverview />
            </FormContextWrapper>
          </UserContextWrapper>
        </ApolloProvider>
      </IntlProvider>,
    )

    const button = await screen.findByRole('button')
    await userEvent.click(button)
    expect(await screen.findAllByRole('menuitem')).toHaveLength(1)
  })

  test('should have an option to delete file if the file of category PROSECUTOR_APPEAL_CASE_FILE even though the user is a prosecutor', async () => {
    const theCase = {
      id: 'asd',
      type: CaseType.CUSTODY,
      caseFiles: [mockCaseFile(CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE)],
      state: CaseState.ACCEPTED,
      appealState: CaseAppealState.COMPLETED,
    } as Case

    render(
      <IntlProvider locale="is" onError={jest.fn}>
        <ApolloProvider
          client={new ApolloClient({ cache: new InMemoryCache() })}
        >
          <UserContextWrapper userRole={UserRole.PROSECUTOR}>
            <FormContextWrapper theCase={theCase}>
              <AppealCaseFilesOverview />
            </FormContextWrapper>
          </UserContextWrapper>
        </ApolloProvider>
      </IntlProvider>,
    )

    const button = await screen.findByRole('button')
    await userEvent.click(button)
    expect(await screen.findAllByRole('menuitem')).toHaveLength(2)
  })
})
