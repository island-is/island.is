import { render, screen } from '@testing-library/react'

import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseState,
  CaseType,
  DefenderChoice,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  ApolloProviderWrapper,
  FormContextWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import SelectDefender from './SelectDefender'

// The barrel re-exports this hook, so mocking the module behind it is enough
// and avoids pulling the whole barrel through requireActual.
jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useDefendants',
  () => ({
    __esModule: true,
    default: () => ({
      updateDefendant: jest.fn(),
      updateDefendantState: jest.fn(),
      setAndSendDefendantToServer: jest.fn(),
      isUpdatingDefendant: false,
    }),
  }),
)

const renderCard = (defender: Partial<Defendant>) => {
  const defendant = {
    id: 'defendant-id',
    name: 'Prufa Ákærðadóttir',
    defenderChoice: DefenderChoice.CHOOSE,
    defenderName: 'Test Verjandi',
    isDefenderChoiceConfirmed: false,
    ...defender,
  } as Defendant

  const theCase = {
    ...mockCase(CaseType.INDICTMENT),
    state: CaseState.RECEIVED,
    defendants: [defendant],
  } as unknown as WorkingCase

  return render(
    <IntlProviderWrapper>
      <ApolloProviderWrapper>
        <UserContextWrapper userRole={UserRole.DISTRICT_COURT_JUDGE}>
          <FormContextWrapper theCase={theCase}>
            <SelectDefender defendant={defendant} />
          </FormContextWrapper>
        </UserContextWrapper>
      </ApolloProviderWrapper>
    </IntlProviderWrapper>,
  )
}

const confirmButton = () =>
  screen.getByRole('button', { name: 'Staðfesta val' })

describe('SelectDefender', () => {
  it('lets the choice be confirmed with well formed contact details', () => {
    renderCard({
      defenderEmail: 'testverjandi@dummy.dd',
      defenderPhoneNumber: '0000000',
    })

    expect(confirmButton()).not.toHaveAttribute('aria-disabled', 'true')
  })

  it('lets the choice be confirmed without contact details', () => {
    renderCard({})

    expect(confirmButton()).not.toHaveAttribute('aria-disabled', 'true')
  })

  it('does not let the choice be confirmed with an invalid email', () => {
    renderCard({ defenderEmail: 'testverjandi' })

    expect(confirmButton()).toHaveAttribute('aria-disabled', 'true')
  })

  it('does not let the choice be confirmed with an invalid phone number', () => {
    renderCard({ defenderPhoneNumber: '123' })

    expect(confirmButton()).toHaveAttribute('aria-disabled', 'true')
  })
})
