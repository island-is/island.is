import faker from 'faker'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  CaseOrigin,
  CaseState,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  mockCaseTableMembershipQuery,
  mockTransitionAppealCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import Summary from './Summary'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
    }
  },
}))

window.scrollTo = jest.fn()

describe('Summary', () => {
  it('should show a modal window when the appeal is completed', async () => {
    const caseId = faker.datatype.uuid()
    const appealCaseId = faker.datatype.uuid()

    render(
      <MockedProvider
        mocks={[
          ...mockTransitionAppealCaseMutation(caseId, appealCaseId),
          ...mockCaseTableMembershipQuery(caseId),
        ]}
        addTypename={false}
      >
        <IntlProviderWrapper>
          <FormContextWrapper
            theCase={{
              id: caseId,
              origin: CaseOrigin.RVG,
              type: CaseType.OTHER,
              created: '',
              modified: '',
              state: CaseState.ACCEPTED,
              policeCaseNumbers: [],
              appealCase: { id: appealCaseId },
            }}
          >
            <Summary />
          </FormContextWrapper>
        </IntlProviderWrapper>
      </MockedProvider>,
    )

    const continueButton = screen.getByRole('button', { name: 'Ljúka máli' })

    await userEvent.click(continueButton)

    const { getByRole } = within(screen.getByRole('dialog'))

    expect(
      getByRole('heading', { name: 'Máli hefur verið lokið' }),
    ).toBeInTheDocument()
  })

  it('should show a modal window when the appeal ruling is modified', async () => {
    const caseId = faker.datatype.uuid()
    const appealCaseId = faker.datatype.uuid()

    render(
      <MockedProvider
        mocks={[
          ...mockTransitionAppealCaseMutation(caseId, appealCaseId),
          ...mockCaseTableMembershipQuery(caseId),
        ]}
        addTypename={false}
      >
        <IntlProviderWrapper>
          <FormContextWrapper
            theCase={{
              id: caseId,
              origin: CaseOrigin.RVG,
              type: CaseType.OTHER,
              created: '',
              modified: '',
              state: CaseState.ACCEPTED,
              policeCaseNumbers: [],
              appealCase: {
                id: appealCaseId,
                appealRulingDate: '2021-09-09T12:00:00.000Z',
              },
            }}
          >
            <Summary />
          </FormContextWrapper>
        </IntlProviderWrapper>
      </MockedProvider>,
    )

    const continueButton = screen.getByRole('button', { name: 'Ljúka máli' })

    await userEvent.click(continueButton)

    const { getByRole } = within(screen.getByRole('dialog'))

    expect(
      getByRole('heading', { name: 'Hverju var breytt?' }),
    ).toBeInTheDocument()
  })
})
