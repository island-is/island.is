import type { MockedResponse } from '@apollo/client/testing'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  CaseState,
  CaseTransition,
  CaseType,
  TrackedNotificationType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { SendNotificationDocument } from '@island.is/judicial-system-web/src/utils/hooks/useCase/sendNotification.generated'
import { TransitionCaseDocument } from '@island.is/judicial-system-web/src/utils/hooks/useCase/transitionCase.generated'
import {
  mockCase,
  mockCaseTableMembershipQuery,
} from '@island.is/judicial-system-web/src/utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import Overview from './Overview'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
      push: jest.fn(),
    }
  },
}))

jest.mock('@island.is/judicial-system-web/src/utils/toast', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}))

window.scrollTo = jest.fn()

const draftCase = {
  ...mockCase(CaseType.SEARCH_WARRANT),
  state: CaseState.DRAFT,
}

const transitionRequest = {
  query: TransitionCaseDocument,
  variables: {
    input: { id: draftCase.id, transition: CaseTransition.SUBMIT },
  },
}

const sendNotificationRequest = {
  query: SendNotificationDocument,
  variables: {
    input: {
      caseId: draftCase.id,
      type: TrackedNotificationType.READY_FOR_COURT,
    },
  },
}

const modalHeading = 'Krafa um rannsóknarheimild hefur verið send til dómstóls'

const renderOverview = (mocks: MockedResponse[]) =>
  render(
    <MockedProvider
      mocks={[...mockCaseTableMembershipQuery(draftCase.id), ...mocks]}
      addTypename={false}
    >
      <UserContextWrapper userRole={UserRole.PROSECUTOR}>
        <IntlProviderWrapper>
          <FormContextWrapper theCase={draftCase}>
            <Overview />
          </FormContextWrapper>
        </IntlProviderWrapper>
      </UserContextWrapper>
    </MockedProvider>,
  )

describe('Prosecutor InvestigationCase Overview', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('sending the case to court', () => {
    it('keeps the "sent to court" modal closed when the submit transition fails', async () => {
      const sendNotificationResult = jest.fn(() => ({
        data: { sendNotification: { notificationSent: true } },
      }))

      renderOverview([
        { request: transitionRequest, error: new Error('network down') },
        { request: sendNotificationRequest, result: sendNotificationResult },
      ])

      await userEvent.click(await screen.findByTestId('continueButton'))

      await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1))

      expect(screen.queryByText(modalHeading)).not.toBeInTheDocument()
      expect(sendNotificationResult).not.toHaveBeenCalled()
    })

    it('opens the "sent to court" modal once the case is submitted', async () => {
      renderOverview([
        {
          request: transitionRequest,
          result: {
            data: {
              transitionCase: {
                state: CaseState.SUBMITTED,
                rulingDate: null,
                appealCase: null,
              },
            },
          },
        },
        {
          request: sendNotificationRequest,
          result: { data: { sendNotification: { notificationSent: true } } },
        },
      ])

      await userEvent.click(await screen.findByTestId('continueButton'))

      expect(await screen.findByText(modalHeading)).toBeInTheDocument()
      expect(toast.error).not.toHaveBeenCalled()
    })
  })
})
