import { MockedProvider, type MockedResponse } from '@apollo/client/testing'
import { render, waitFor } from '@testing-library/react'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import {
  ApplicationStatus,
  ApplicationTypes,
  type Application,
  type FieldBaseProps,
} from '@island.is/application/types'
import { PostponeReceiptCloser } from './index'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    lang: 'is',
    formatMessage: (message: unknown) => message,
  }),
}))

const application: Application = {
  id: 'app-1',
  assignees: [],
  applicantActors: [],
  typeId: ApplicationTypes.SALARY_REPORT,
  externalData: {},
  answers: {},
  applicant: '0101302989',
  state: 'postponeReceived',
  modified: new Date(),
  created: new Date(),
  status: ApplicationStatus.IN_PROGRESS,
}

// MockedProvider only matches on deep-equal variables, so a passing test also
// pins the event that actually moves the state.
const closeVariables = {
  input: { id: 'app-1', event: 'SUBMIT' },
  locale: 'is',
}

const submitMock = (result: jest.Mock): MockedResponse => ({
  request: { query: SUBMIT_APPLICATION, variables: closeVariables },
  result,
})

const renderCloser = (mocks: readonly MockedResponse[]) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <PostponeReceiptCloser {...({ application } as FieldBaseProps)} />
    </MockedProvider>,
  )

const hide = () => {
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => 'hidden',
  })
  document.dispatchEvent(new Event('visibilitychange'))
}

describe('PostponeReceiptCloser', () => {
  it('dispatches nothing while the receipt is on display', async () => {
    const close = jest.fn(() => ({ data: { submitApplication: null } }))
    const { container } = renderCloser([submitMock(close)])

    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(close).not.toHaveBeenCalled()
    expect(container.innerHTML).toBe('')
  })

  it('moves the application on when the page goes away', async () => {
    const close = jest.fn(() => ({ data: { submitApplication: null } }))
    renderCloser([submitMock(close)])

    window.dispatchEvent(new Event('pagehide'))

    await waitFor(() => expect(close).toHaveBeenCalledTimes(1))
  })

  it('moves the application on when a mobile browser hides the page', async () => {
    const close = jest.fn(() => ({ data: { submitApplication: null } }))
    renderCloser([submitMock(close)])

    hide()

    await waitFor(() => expect(close).toHaveBeenCalledTimes(1))
  })

  it('dispatches once even when both exits fire', async () => {
    const close = jest.fn(() => ({ data: { submitApplication: null } }))
    renderCloser([submitMock(close)])

    hide()
    window.dispatchEvent(new Event('pagehide'))
    window.dispatchEvent(new Event('pagehide'))

    await waitFor(() => expect(close).toHaveBeenCalledTimes(1))
  })
})
