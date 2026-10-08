import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'

import type {
  CivilClaimant,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealCaseState,
  AppealCaseType,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import AppealAppointmentLetterButton from './AppealAppointmentLetterButton'

/**
 * Which parties have a letter is covered in AppealAppointmentLetter.logic -
 * what is left for the button is that it reaches the page addressed to the
 * right party, and stays away when there is nothing to open.
 */
describe('AppealAppointmentLetterButton', () => {
  const defendant = {
    id: 'defendant_id',
    name: 'Gervimaður Jónsson',
    isAppealDefenderConfirmed: true,
    appealDefenderName: 'Þórður Már Jónsson',
  } as Defendant

  const civilClaimant = {
    id: 'claimant_id',
    name: 'Jónína Jónsdóttir',
    isAppealSpokespersonConfirmed: true,
    appealSpokespersonName: 'Brynjar Sveinsson',
  } as CivilClaimant

  const appealedCase = {
    ...mockCase(CaseType.INDICTMENT),
    verdictAppealCase: {
      id: 'verdict_appeal_id',
      appealType: AppealCaseType.VERDICT,
      appealState: AppealCaseState.APPEALED,
    },
    defendants: [defendant],
    civilClaimants: [civilClaimant],
  }

  const renderButton = (
    party: { defendant?: Defendant; civilClaimant?: CivilClaimant },
    userRole: UserRole = UserRole.COURT_OF_APPEALS_JUDGE,
    theCase = appealedCase,
  ) =>
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <IntlProviderWrapper>
          <UserContextWrapper userRole={userRole}>
            <FormContextWrapper theCase={theCase}>
              <AppealAppointmentLetterButton {...party} />
            </FormContextWrapper>
          </UserContextWrapper>
        </IntlProviderWrapper>
      </MockedProvider>,
    )

  it("should open the defender's letter", async () => {
    renderButton({ defendant })

    expect(
      await screen.findByText('Skipunarbréf Þórður Már Jónsson.pdf'),
    ).toBeInTheDocument()
    expect(
      screen.getByTestId('appealAppointmentLetterPDFButton'),
    ).toBeInTheDocument()
  })

  it("should open the spokesperson's letter", async () => {
    renderButton({ civilClaimant })

    expect(
      await screen.findByText('Skipunarbréf Brynjar Sveinsson.pdf'),
    ).toBeInTheDocument()
  })

  it('should render nothing for an advocate the court has not confirmed', () => {
    renderButton({
      defendant: { ...defendant, isAppealDefenderConfirmed: false },
    })

    expect(
      screen.queryByTestId('appealAppointmentLetterPDFButton'),
    ).not.toBeInTheDocument()
  })

  // The court appoints a réttargæslumaður; a lögmaður is hired by the claimant.
  it('should render nothing for a lawyer the claimant engaged', () => {
    renderButton({
      civilClaimant: { ...civilClaimant, appealSpokespersonIsLawyer: true },
    })

    expect(
      screen.queryByTestId('appealAppointmentLetterPDFButton'),
    ).not.toBeInTheDocument()
  })

  it('should render nothing for anyone but the court of appeals', () => {
    renderButton({ defendant }, UserRole.PROSECUTOR)

    expect(
      screen.queryByTestId('appealAppointmentLetterPDFButton'),
    ).not.toBeInTheDocument()
  })
})
