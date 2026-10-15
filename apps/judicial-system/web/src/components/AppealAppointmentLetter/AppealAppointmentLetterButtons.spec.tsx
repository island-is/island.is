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

import AppealAppointmentLetterButtons from './AppealAppointmentLetterButtons'

/**
 * Which parties have a letter is covered in AppealAppointmentLetter.logic -
 * what is left for the buttons is that they reach the page, label themselves
 * the way the design does, and stay away when there is nothing to open.
 */
describe('AppealAppointmentLetterButtons', () => {
  const defendant = {
    id: 'defendant_id',
    name: 'Gervimaður Jónsson',
    isAppealDefenderConfirmed: true,
    appealDefenderName: 'Lára Lögmann',
  } as Defendant

  const civilClaimant = {
    id: 'claimant_id',
    name: 'Jónína Jónsdóttir',
    isAppealSpokespersonConfirmed: true,
    appealSpokespersonName: 'Sólveig Hreinsdóttir',
  } as CivilClaimant

  const appealedCase = (
    defendants: Defendant[] = [defendant],
    civilClaimants: CivilClaimant[] = [civilClaimant],
  ) => ({
    ...mockCase(CaseType.INDICTMENT),
    verdictAppealCase: {
      id: 'verdict_appeal_id',
      appealType: AppealCaseType.VERDICT,
      appealState: AppealCaseState.APPEALED,
    },
    defendants,
    civilClaimants,
  })

  const renderButtons = (
    theCase = appealedCase(),
    userRole: UserRole = UserRole.COURT_OF_APPEALS_JUDGE,
  ) =>
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <IntlProviderWrapper>
          <UserContextWrapper userRole={userRole}>
            <FormContextWrapper theCase={theCase}>
              <AppealAppointmentLetterButtons />
            </FormContextWrapper>
          </UserContextWrapper>
        </IntlProviderWrapper>
      </MockedProvider>,
    )

  // The design labels these "Skipunarbréf <nafn> - PDF", not with the file
  // name the appeal overview's file list uses.
  it('should offer one button per confirmed advocate, labelled as the design has it', async () => {
    renderButtons()

    expect(
      await screen.findByRole('button', {
        name: 'Skipunarbréf Lára Lögmann - PDF',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'Skipunarbréf Sólveig Hreinsdóttir - PDF',
      }),
    ).toBeInTheDocument()
  })

  it('should list the defendants before the civil claimants', async () => {
    renderButtons()

    const labels = (
      await screen.findAllByTestId('appealAppointmentLetterPDFButton')
    ).map((button) => button.textContent)

    expect(labels).toEqual([
      'Skipunarbréf Lára Lögmann - PDF',
      'Skipunarbréf Sólveig Hreinsdóttir - PDF',
    ])
  })

  it('should render nothing when no advocate is confirmed', () => {
    renderButtons(
      appealedCase(
        [{ ...defendant, isAppealDefenderConfirmed: false }],
        [{ ...civilClaimant, isAppealSpokespersonConfirmed: false }],
      ),
    )

    expect(
      screen.queryByTestId('appealAppointmentLetters'),
    ).not.toBeInTheDocument()
  })

  it('should render nothing for anyone but the court of appeals', () => {
    renderButtons(appealedCase(), UserRole.PROSECUTOR)

    expect(
      screen.queryByTestId('appealAppointmentLetters'),
    ).not.toBeInTheDocument()
  })
})
