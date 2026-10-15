import { render, screen } from '@testing-library/react'

import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import type { CivilClaimant } from '@island.is/judicial-system-web/src/graphql/schema'
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

import SelectAppealCivilClaimantAdvocate from './SelectAppealCivilClaimantAdvocate'

// The barrel re-exports this hook, so mocking the module behind it is enough
// and avoids pulling the whole barrel through requireActual.
jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useCivilClaimants',
  () => ({
    __esModule: true,
    default: () => ({
      updateCivilClaimantState: jest.fn(),
      updateCivilClaimant: jest.fn(),
      setAndSendCivilClaimantToServer: jest.fn(),
    }),
  }),
)

// What the text says is covered in the logic spec; what is left here is that
// it follows the court's choice of advocate and nothing else.
describe('SelectAppealCivilClaimantAdvocate', () => {
  const request = /Ósk einkaréttarkröfuhafa um réttargæslumann/

  const claimant = (fields: Partial<CivilClaimant>): CivilClaimant =>
    ({
      id: 'claimant-id',
      name: 'Brynjar Sveinsson',
      hasAppealSpokesperson: true,
      appealSpokespersonName: 'Sólveig Hreinsdóttir',
      appealSpokespersonNationalId: '0909713459',
      ...fields,
    } as CivilClaimant)

  const renderCard = (civilClaimant: CivilClaimant) =>
    render(
      <IntlProviderWrapper>
        <ApolloProviderWrapper>
          <UserContextWrapper userRole={UserRole.COURT_OF_APPEALS_JUDGE}>
            <FormContextWrapper
              theCase={
                {
                  ...mockCase(CaseType.INDICTMENT),
                  state: CaseState.COMPLETED,
                  civilClaimants: [civilClaimant],
                } as unknown as WorkingCase
              }
            >
              <SelectAppealCivilClaimantAdvocate
                civilClaimant={civilClaimant}
              />
            </FormContextWrapper>
          </UserContextWrapper>
        </ApolloProviderWrapper>
      </IntlProviderWrapper>,
    )

  it('names who the court settled on once it picks a réttargæslumaður', () => {
    renderCard(claimant({ appealSpokespersonIsLawyer: false }))

    expect(screen.getByText(request)).toBeInTheDocument()
    expect(
      screen.getByText(/Sólveig Hreinsdóttir kt. 090971-3459/),
    ).toBeInTheDocument()
  })

  // A lögmaður is hired by the claimant; what they once asked the court for
  // is beside the point.
  it('shows nothing of the kind for a lögmaður', () => {
    renderCard(claimant({ appealSpokespersonIsLawyer: true }))

    expect(screen.queryByText(request)).not.toBeInTheDocument()
  })

  it('shows nothing of the kind before the court has chosen', () => {
    renderCard(
      claimant({
        appealSpokespersonIsLawyer: undefined,
        spokespersonIsLawyer: undefined,
      }),
    )

    expect(screen.queryByText(request)).not.toBeInTheDocument()
  })

  // A part the court has not recorded is left out; the line itself stays.
  it('keeps the line, shorter, when the court recorded no name', () => {
    renderCard(
      claimant({
        appealSpokespersonIsLawyer: false,
        appealSpokespersonName: undefined,
        appealSpokespersonNationalId: undefined,
      }),
    )

    expect(
      screen.getByText('Ósk einkaréttarkröfuhafa um réttargæslumann:'),
    ).toBeInTheDocument()
  })
})
