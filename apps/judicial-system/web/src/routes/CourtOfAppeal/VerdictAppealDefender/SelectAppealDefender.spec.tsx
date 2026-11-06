import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  ApolloProviderWrapper,
  FormContextWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import SelectAppealDefender from './SelectAppealDefender'

const mockUpdateDefendant = jest.fn()
const mockUpdateDefendantState = jest.fn()

// The barrel re-exports this hook, so mocking the module behind it is enough
// and avoids pulling the whole barrel through requireActual.
jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useDefendants',
  () => ({
    __esModule: true,
    default: () => ({
      updateDefendant: mockUpdateDefendant,
      updateDefendantState: mockUpdateDefendantState,
      setAndSendDefendantToServer: jest.fn(),
      isUpdatingDefendant: false,
    }),
  }),
)

// A defendant whose appeal record is still empty, so the screen is showing
// the district court's defender as a starting point.
const defendant = {
  id: 'defendant-id',
  name: 'Jón Sigurður Jónsson',
  defenderName: 'Lára Lögmann',
  defenderNationalId: '0000000000',
  defenderEmail: 'lara@lawyers.is',
  defenderPhoneNumber: '5555555',
} as Defendant

const theCase = {
  ...mockCase(CaseType.INDICTMENT),
  state: CaseState.COMPLETED,
  defendants: [defendant],
} as unknown as WorkingCase

const renderCard = () =>
  render(
    <IntlProviderWrapper>
      <ApolloProviderWrapper>
        <UserContextWrapper userRole={UserRole.COURT_OF_APPEALS_JUDGE}>
          <FormContextWrapper theCase={theCase}>
            <SelectAppealDefender defendant={defendant} />
          </FormContextWrapper>
        </UserContextWrapper>
      </ApolloProviderWrapper>
    </IntlProviderWrapper>,
  )

describe('SelectAppealDefender', () => {
  beforeEach(() => {
    mockUpdateDefendant.mockClear()
    mockUpdateDefendantState.mockClear()
  })

  // Writing the email on its own would make the appeal record name somebody
  // with no name: the card would lose the defender it is showing, and the
  // confirm button would go dead with nothing to explain why.
  it('carries the defender name when only the email is edited', async () => {
    renderCard()

    await userEvent.type(screen.getByTestId('defenderEmail'), 'ny@lawyers.is')

    expect(mockUpdateDefendantState).toHaveBeenCalled()
    expect(mockUpdateDefendantState.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        defendantId: 'defendant-id',
        appealDefenderName: 'Lára Lögmann',
        appealDefenderNationalId: '0000000000',
      }),
    )
  })

  it('carries it on the saved update too', async () => {
    renderCard()

    const email = screen.getByTestId('defenderEmail')
    await userEvent.type(email, 'ny@lawyers.is')
    await userEvent.tab()

    expect(mockUpdateDefendant).toHaveBeenCalled()
    expect(mockUpdateDefendant.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        appealDefenderName: 'Lára Lögmann',
        appealDefenderNationalId: '0000000000',
      }),
    )
  })
})
