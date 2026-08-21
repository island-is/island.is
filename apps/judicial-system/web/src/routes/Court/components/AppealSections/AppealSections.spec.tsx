import { render, screen } from '@testing-library/react'

import {
  AppealCaseState,
  Case,
  CaseType,
  SessionArrangements,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { mockCase } from '../../../../utils/mocks'
import { IntlProviderWrapper } from '../../../../utils/testHelpers'
import AppealSections from './AppealSections'

jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useCaseAppealDecision',
  () => ({
    __esModule: true,
    default: () => ({ updateCaseAppealDecision: jest.fn() }),
  }),
)

jest.mock('./useDebouncedAppealAnnouncement', () => ({
  __esModule: true,
  default: () => ({ value: '', onChange: jest.fn() }),
}))

describe('AppealSections', () => {
  const baseCase = {
    ...mockCase(CaseType.CUSTODY),
    sessionArrangements: SessionArrangements.ALL_PRESENT,
    defendants: [{ id: 'defendant_id' }],
  } as Case

  const renderComponent = (workingCase: Case) =>
    render(
      <IntlProviderWrapper>
        <AppealSections workingCase={workingCase} setWorkingCase={jest.fn()} />
      </IntlProviderWrapper>,
    )

  // Every radio and both announcement inputs share one derived `disabled`, so
  // asserting on the whole set is what actually pins the behaviour.
  const expectAllControlsDisabled = (disabled: boolean) => {
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(8)
    radios.forEach((radio) => {
      if (disabled) {
        expect(radio).toBeDisabled()
      } else {
        expect(radio).not.toBeDisabled()
      }
    })

    const announcements = [
      screen.getByTestId('accusedAppealAnnouncement'),
      screen.getByTestId('prosecutorAppealAnnouncement'),
    ]
    announcements.forEach((input) => {
      if (disabled) {
        expect(input).toBeDisabled()
      } else {
        expect(input).not.toBeDisabled()
      }
    })
  }

  const outOfCourtMessage =
    'Úrskurðurinn hefur verið kærður utan þinghalds og því er ekki hægt að breyta ákvörðun um kæru.'
  const progressedMessage =
    'Kæra úrskurðarins er komin til Landsréttar og því er ekki hægt að breyta ákvörðun um kæru.'

  it('is editable when the case has not been appealed', () => {
    renderComponent(baseCase)

    expectAllControlsDisabled(false)
    expect(screen.queryByText(outOfCourtMessage)).not.toBeInTheDocument()
    expect(screen.queryByText(progressedMessage)).not.toBeInTheDocument()
  })

  it('is editable while an in-court appeal is still at the district court', () => {
    renderComponent({
      ...baseCase,
      appealCase: {
        id: 'appeal_id',
        appealState: AppealCaseState.APPEALED,
        appealedOutOfCourt: false,
      },
    } as Case)

    expectAllControlsDisabled(false)
    expect(screen.queryByText(outOfCourtMessage)).not.toBeInTheDocument()
    expect(screen.queryByText(progressedMessage)).not.toBeInTheDocument()
  })

  // The court record did not create this appeal, so correcting it cannot take the
  // appeal away - editing the decisions would only put the two out of step.
  it('is disabled when a party appealed out of court', () => {
    renderComponent({
      ...baseCase,
      appealCase: {
        id: 'appeal_id',
        appealState: AppealCaseState.APPEALED,
        appealedOutOfCourt: true,
      },
    } as Case)

    expectAllControlsDisabled(true)
    expect(screen.getByText(outOfCourtMessage)).toBeInTheDocument()
  })

  // The decisions are already part of the record the Court of Appeals received.
  it('is disabled once the appeal has been received', () => {
    renderComponent({
      ...baseCase,
      appealCase: {
        id: 'appeal_id',
        appealState: AppealCaseState.RECEIVED,
        appealedOutOfCourt: false,
      },
    } as Case)

    expectAllControlsDisabled(true)
    expect(screen.getByText(progressedMessage)).toBeInTheDocument()
  })

  it('is disabled once the appeal has been completed', () => {
    renderComponent({
      ...baseCase,
      appealCase: {
        id: 'appeal_id',
        appealState: AppealCaseState.COMPLETED,
        appealedOutOfCourt: false,
      },
    } as Case)

    expectAllControlsDisabled(true)
    expect(screen.getByText(progressedMessage)).toBeInTheDocument()
  })
})
