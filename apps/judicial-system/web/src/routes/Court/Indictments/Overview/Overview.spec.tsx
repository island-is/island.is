import { ReactNode } from 'react'
import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import {
  Case,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  mockCase,
  mockCaseTableMembershipQuery,
  mockUser,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { IntlProviderWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'

import Overview from './Overview'

const mockPush = jest.fn()

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
      push: mockPush,
    }
  },
}))

window.scrollTo = jest.fn()

const renderOverview = (
  theCase: Case,
  userRole: UserRole,
  getCase: jest.Mock,
  isCaseUpToDate = true,
) => {
  const wrapInProviders = (children: ReactNode) => (
    <MockedProvider
      mocks={[...mockCaseTableMembershipQuery(theCase.id)]}
      addTypename={false}
    >
      <IntlProviderWrapper>
        <UserContext.Provider value={{ user: mockUser(userRole) }}>
          <FormContext.Provider
            value={{
              workingCase: theCase,
              setWorkingCase: jest.fn(),
              isLoadingWorkingCase: false,
              caseNotFound: false,
              isCaseUpToDate,
              refreshCase: jest.fn(),
              getCase,
              isCreating: false,
            }}
          >
            {children}
          </FormContext.Provider>
        </UserContext.Provider>
      </IntlProviderWrapper>
    </MockedProvider>
  )

  return render(wrapInProviders(<Overview />))
}

describe('Court Indictment Overview', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('shows the cancellation modal when a district court user opens a cancelled indictment', async () => {
    const cancelledCase: Case = {
      ...mockCase(CaseType.INDICTMENT),
      state: CaseState.WAITING_FOR_CANCELLATION,
    }
    const getCase = jest.fn((_id, onCompleted) => {
      // getCase fetches over the network in production — resolve asynchronously
      // so the hook commits its initial state before the case is loaded.
      Promise.resolve().then(() => onCompleted(cancelledCase))
    })

    renderOverview(cancelledCase, UserRole.DISTRICT_COURT_JUDGE, getCase)

    expect(await screen.findByText('Mál afturkallað')).toBeInTheDocument()
    expect(getCase).toHaveBeenCalledWith(
      cancelledCase.id,
      expect.any(Function),
      expect.any(Function),
    )
  })

  it('does not show the cancellation modal for a received indictment', async () => {
    const receivedCase: Case = {
      ...mockCase(CaseType.INDICTMENT),
      state: CaseState.RECEIVED,
    }
    const getCase = jest.fn((_id, onCompleted) => onCompleted(receivedCase))

    renderOverview(receivedCase, UserRole.DISTRICT_COURT_JUDGE, getCase)

    await waitFor(() => expect(getCase).not.toHaveBeenCalled())
    expect(screen.queryByText('Mál afturkallað')).not.toBeInTheDocument()
  })

  it('does not show the modal for a stale cancelled case that is not up to date', async () => {
    // Mirrors the bug where the FormProvider still holds a previously opened
    // cancelled case while the next (non-cancelled) case is being fetched.
    const staleCancelledCase: Case = {
      ...mockCase(CaseType.INDICTMENT),
      state: CaseState.WAITING_FOR_CANCELLATION,
    }
    const getCase = jest.fn((_id, onCompleted) => {
      Promise.resolve().then(() => onCompleted(staleCancelledCase))
    })

    renderOverview(
      staleCancelledCase,
      UserRole.DISTRICT_COURT_JUDGE,
      getCase,
      false,
    )

    await waitFor(() => expect(getCase).not.toHaveBeenCalled())
    expect(screen.queryByText('Mál afturkallað')).not.toBeInTheDocument()
  })

  it('redirects to the dashboard when the user cancels the modal', async () => {
    const cancelledCase: Case = {
      ...mockCase(CaseType.INDICTMENT),
      state: CaseState.WAITING_FOR_CANCELLATION,
    }
    const getCase = jest.fn((_id, onCompleted) => {
      Promise.resolve().then(() => onCompleted(cancelledCase))
    })

    renderOverview(cancelledCase, UserRole.DISTRICT_COURT_JUDGE, getCase)

    expect(await screen.findByText('Mál afturkallað')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Hætta við' }))

    await waitFor(() => expect(mockPush).toHaveBeenCalledTimes(1))
  })

  it('does not re-open the modal after the user dismisses it', async () => {
    // The component stays mounted here (router.push is a no-op) and the case
    // remains WAITING_FOR_CANCELLATION, so this guards against the effect
    // re-triggering cancelCase once the modal has been dismissed.
    const cancelledCase: Case = {
      ...mockCase(CaseType.INDICTMENT),
      state: CaseState.WAITING_FOR_CANCELLATION,
    }
    const getCase = jest.fn((_id, onCompleted) => {
      Promise.resolve().then(() => onCompleted(cancelledCase))
    })

    renderOverview(cancelledCase, UserRole.DISTRICT_COURT_JUDGE, getCase)

    expect(await screen.findByText('Mál afturkallað')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Hætta við' }))

    await waitFor(() =>
      expect(screen.queryByText('Mál afturkallað')).not.toBeInTheDocument(),
    )
    // Settle any pending microtasks/effects, then assert no re-trigger.
    await waitFor(() => expect(mockPush).toHaveBeenCalledTimes(1))
    expect(getCase).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Mál afturkallað')).not.toBeInTheDocument()
  })
})
