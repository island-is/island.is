import type { FC } from 'react'
import { useState } from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import type { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealCaseState,
  AppealDecisionPartyRole,
  CaseAppealDecision,
  CaseType,
  SessionArrangements,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import { IntlProviderWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'
import { caseLevelAppealDecision } from '@island.is/judicial-system-web/src/utils/utils'

import AppealSections from './AppealSections'

const mockUpdateCaseAppealDecision = jest.fn()

jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useCaseAppealDecision',
  () => ({
    __esModule: true,
    default: () => ({ updateCaseAppealDecision: mockUpdateCaseAppealDecision }),
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

  // The court record step is validated against the working case, so a decision
  // that never reached the server must not stay in it - otherwise the judge can
  // continue and complete the case with an incomplete court record.
  describe('when the save fails', () => {
    // Holds the working case the way FormProvider does, so the component's
    // optimistic update and its rollback can be observed.
    const Harness: FC<{
      initialCase: Case
      onWorkingCase: (workingCase: Case) => void
      onChange?: jest.Mock
    }> = ({ initialCase, onWorkingCase, onChange }) => {
      const [workingCase, setWorkingCase] = useState(initialCase)
      onWorkingCase(workingCase)

      return (
        <IntlProviderWrapper>
          <AppealSections
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            onChange={onChange}
          />
        </IntlProviderWrapper>
      )
    }

    const renderHarness = (initialCase: Case) => {
      let latest = initialCase
      const onChange = jest.fn()
      render(
        <Harness
          initialCase={initialCase}
          onWorkingCase={(workingCase) => {
            latest = workingCase
          }}
          onChange={onChange}
        />,
      )

      return { workingCase: () => latest, onChange }
    }

    const prosecutorDecision = () =>
      document.getElementById('prosecutor-appeal') as HTMLInputElement
    const prosecutorAcceptRadio = () =>
      document.getElementById('prosecutor-accept') as HTMLInputElement

    beforeEach(() => {
      mockUpdateCaseAppealDecision.mockReset()
    })

    it('keeps the decision and tells the parent when the save succeeds', async () => {
      mockUpdateCaseAppealDecision.mockResolvedValue({
        decision: CaseAppealDecision.APPEAL,
      })
      const { workingCase, onChange } = renderHarness(baseCase)

      fireEvent.click(prosecutorDecision())

      // The parent derives and persists the end-of-session text from the
      // decision, so it is only told once the decision is on the server
      await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1))
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          prosecutorAppealDecision: CaseAppealDecision.APPEAL,
        }),
      )
      expect(mockUpdateCaseAppealDecision).toHaveBeenCalledTimes(1)
      expect(
        caseLevelAppealDecision(
          workingCase().appealDecisions,
          AppealDecisionPartyRole.PROSECUTOR,
        ),
      ).toBe(CaseAppealDecision.APPEAL)
      expect(prosecutorDecision()).toBeChecked()
    })

    it('drops a decision the party did not have before and does not tell the parent', async () => {
      mockUpdateCaseAppealDecision.mockResolvedValue(undefined)
      const { workingCase, onChange } = renderHarness(baseCase)

      fireEvent.click(prosecutorDecision())

      await waitFor(() =>
        expect(mockUpdateCaseAppealDecision).toHaveBeenCalledTimes(1),
      )
      await waitFor(() =>
        expect(
          caseLevelAppealDecision(
            workingCase().appealDecisions,
            AppealDecisionPartyRole.PROSECUTOR,
          ),
        ).toBeUndefined(),
      )
      expect(prosecutorDecision()).not.toBeChecked()
      expect(onChange).not.toHaveBeenCalled()
    })

    // A slow save that fails after a newer one succeeded describes a row the
    // newer save now owns - rolling it back would discard the newer decision.
    it('ignores a superseded save that fails after a newer save succeeded', async () => {
      let failFirstSave: (value: undefined) => void = () => undefined
      mockUpdateCaseAppealDecision
        .mockImplementationOnce(
          () =>
            new Promise<undefined>((resolve) => {
              failFirstSave = resolve
            }),
        )
        .mockResolvedValueOnce({ decision: CaseAppealDecision.ACCEPT })
      const { workingCase, onChange } = renderHarness(baseCase)

      fireEvent.click(prosecutorDecision())
      fireEvent.click(prosecutorAcceptRadio())

      await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1))
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
        }),
      )

      // Let the superseded save fail and its continuation run
      await act(async () => {
        failFirstSave(undefined)
      })

      expect(mockUpdateCaseAppealDecision).toHaveBeenCalledTimes(2)
      expect(
        caseLevelAppealDecision(
          workingCase().appealDecisions,
          AppealDecisionPartyRole.PROSECUTOR,
        ),
      ).toBe(CaseAppealDecision.ACCEPT)
      expect(prosecutorAcceptRadio()).toBeChecked()
      expect(onChange).toHaveBeenCalledTimes(1)
    })

    it('puts the previously saved decision back', async () => {
      mockUpdateCaseAppealDecision.mockResolvedValue(undefined)
      const { workingCase } = renderHarness({
        ...baseCase,
        appealDecisions: [
          {
            partyRole: AppealDecisionPartyRole.PROSECUTOR,
            rulingFileId: null,
            decision: CaseAppealDecision.ACCEPT,
          },
        ],
      } as Case)

      fireEvent.click(prosecutorDecision())

      await waitFor(() =>
        expect(
          caseLevelAppealDecision(
            workingCase().appealDecisions,
            AppealDecisionPartyRole.PROSECUTOR,
          ),
        ).toBe(CaseAppealDecision.ACCEPT),
      )
      expect(prosecutorAcceptRadio()).toBeChecked()
      expect(prosecutorDecision()).not.toBeChecked()
    })

    it('leaves the other party alone', async () => {
      mockUpdateCaseAppealDecision.mockResolvedValue(undefined)
      const { workingCase } = renderHarness({
        ...baseCase,
        appealDecisions: [
          {
            partyRole: AppealDecisionPartyRole.DEFENDANT,
            rulingFileId: null,
            decision: CaseAppealDecision.POSTPONE,
          },
        ],
      } as Case)

      fireEvent.click(prosecutorDecision())

      await waitFor(() =>
        expect(
          caseLevelAppealDecision(
            workingCase().appealDecisions,
            AppealDecisionPartyRole.PROSECUTOR,
          ),
        ).toBeUndefined(),
      )
      expect(
        caseLevelAppealDecision(
          workingCase().appealDecisions,
          AppealDecisionPartyRole.DEFENDANT,
        ),
      ).toBe(CaseAppealDecision.POSTPONE)
    })
  })
})
