import { FC } from 'react'
import { IntlFormatters, useIntl } from 'react-intl'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'

import {
  CaseDecision,
  CaseState,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import { LocaleProvider } from '@island.is/localization'

import { formatCaseResult } from './'

interface Props {
  getMessage: (formatMessage: IntlFormatters['formatMessage']) => string
}
const Message: FC<Props> = ({ getMessage }) => {
  const { formatMessage } = useIntl()
  const message = getMessage(formatMessage)
  return <span data-testid="message">{message}</span>
}

const renderMessage = (getMessage: Props['getMessage']) => {
  return render(
    <MockedProvider>
      <LocaleProvider locale="en" messages={{}}>
        <Message getMessage={getMessage} />
      </LocaleProvider>
    </MockedProvider>,
  )
}

describe('Page layout utils', () => {
  describe('caseResult function', () => {
    describe('isRejected', () => {
      it('should return the correct string if the case is an investigation case and the state is REJECTED', async () => {
        // Arrange
        const workingCase = {
          ...mockCase(CaseType.CUSTODY),
          type: CaseType.AUTOPSY,
        }

        // Act
        renderMessage((formatMessage) =>
          formatCaseResult(formatMessage, workingCase, CaseState.REJECTED),
        )

        // Assert
        expect(await screen.findByTestId('message')).toHaveTextContent(
          'Kröfu um rannsóknarheimild hafnað',
        )
      })

      it('should return the correct string if the case is an restriction case and the state is REJECTED', async () => {
        // Arrange
        const workingCase = {
          ...mockCase(CaseType.CUSTODY),
          type: CaseType.TRAVEL_BAN,
        }

        // Act
        renderMessage((formatMessage) =>
          formatCaseResult(formatMessage, workingCase, CaseState.REJECTED),
        )

        // Assert
        expect(await screen.findByTestId('message')).toHaveTextContent(
          'Kröfu hafnað',
        )
      })
    })
  })

  describe('isAccepted', () => {
    // Temporarily commented out because of issues with the pipeline
    // it('should return the correct string if the case is an investigation case and the state is ACCEPTED', async () => {
    //   // Arrange
    //   const workingCase = {
    //     ...mockCase(CaseType.CUSTODY),
    //     type: CaseType.AUTOPSY,
    //   }

    //   // Act
    //   renderMessage((formatMessage) =>
    //     formatCaseResult(formatMessage, workingCase, CaseState.ACCEPTED),
    //   )

    //   // Assert
    //   expect(await screen.findByTestId('message')).toHaveTextContent(
    //     'Krafa um rannsóknarheimild samþykkt',
    //   )
    // })

    it('should return the correct string if the case is an restriction case and the state is ACCEPTED', async () => {
      // Arrange
      const workingCase = {
        ...mockCase(CaseType.CUSTODY),
        type: CaseType.TRAVEL_BAN,
      }

      // Act
      renderMessage((formatMessage) =>
        formatCaseResult(formatMessage, workingCase, CaseState.ACCEPTED),
      )

      // Assert
      expect(await screen.findByTestId('message')).toHaveTextContent(
        'Farbann virkt',
      )
    })

    it('should return the correct string if the case is an restriction case and the state is ACCEPTED and the valid to date is in the past', async () => {
      // Arrange
      const workingCase = {
        ...mockCase(CaseType.CUSTODY),
        type: CaseType.TRAVEL_BAN,
        state: CaseState.ACCEPTED,
        isValidToDateInThePast: true,
      }

      // Act
      renderMessage((formatMessage) =>
        formatCaseResult(formatMessage, workingCase, CaseState.ACCEPTED),
      )

      // Assert
      expect(await screen.findByTestId('message')).toHaveTextContent(
        'Farbanni lokið',
      )
    })
  })

  describe('isDismissed', () => {
    it('should return the correct string if the case state is DISMISSED', async () => {
      // Arrange
      const workingCase = {
        ...mockCase(CaseType.CUSTODY),
        type: CaseType.AUTOPSY,
        state: CaseState.DISMISSED,
      }

      // Act
      renderMessage((formatMessage) =>
        formatCaseResult(formatMessage, workingCase, CaseState.DISMISSED),
      )

      // Assert
      expect(await screen.findByTestId('message')).toHaveTextContent(
        'Kröfu vísað frá',
      )
    })
  })

  describe('isAlternativeTravelBan', () => {
    it('should return the correct string if the case state is ACCEPTED and the case decision is ACCEPTING_ALTERNATIVE_TRAVEL_BAN', async () => {
      // Arrange
      const workingCase = {
        ...mockCase(CaseType.CUSTODY),
        type: CaseType.CUSTODY,
        state: CaseState.ACCEPTED,
        decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
      }

      // Act
      renderMessage((formatMessage) =>
        formatCaseResult(formatMessage, workingCase, CaseState.ACCEPTED),
      )

      // Assert
      expect(await screen.findByTestId('message')).toHaveTextContent(
        'Farbann virkt',
      )
    })

    it('should return the correct string if the case state is ACCEPTED, the case decision is ACCEPTING_ALTERNATIVE_TRAVEL_BAN and the valid to date is in the past', async () => {
      // Arrange
      const workingCase = {
        ...mockCase(CaseType.CUSTODY),
        state: CaseState.ACCEPTED,
        decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
        isValidToDateInThePast: true,
      }

      // Act
      renderMessage((formatMessage) =>
        formatCaseResult(formatMessage, workingCase, CaseState.ACCEPTED),
      )

      // Assert
      expect(await screen.findByTestId('message')).toHaveTextContent(
        'Farbanni lokið',
      )
    })
  })
})
