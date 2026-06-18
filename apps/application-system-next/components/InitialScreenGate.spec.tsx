/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react'
import { GraphqlHttpError, fetchScreen } from '../lib/graphql'
import { InitialScreenGate } from './InitialScreenGate'

jest.mock('../lib/graphql', () => {
  const actual = jest.requireActual('../lib/graphql')

  return {
    ...actual,
    fetchScreen: jest.fn(),
  }
})

jest.mock('./ApplicationShell', () => ({
  ApplicationShell: ({
    applicationId,
    initialScreen,
  }: {
    applicationId: string
    initialScreen: { header: { title: string } }
  }) => <div>{`shell:${applicationId}:${initialScreen.header.title}`}</div>,
}))

jest.mock('./BffLoginRedirect', () => ({
  BffLoginRedirect: ({ targetLinkUri }: { targetLinkUri: string }) => (
    <div>{`redirect:${targetLinkUri}`}</div>
  ),
}))

const mockedFetchScreen = fetchScreen as jest.MockedFunction<typeof fetchScreen>

describe('InitialScreenGate', () => {
  const originalLocation = window.location

  afterEach(() => {
    jest.clearAllMocks()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
  })

  it('loads the screen in the browser and renders the application shell', async () => {
    mockedFetchScreen.mockResolvedValue({
      applicationId: 'app-1',
      locale: 'is',
      header: { title: 'Test title' },
      stepper: {
        sections: [],
        activeSectionIndex: 0,
        activeSubSectionIndex: 0,
      },
      page: {
        id: 'page-1',
        index: 0,
        sectionIndex: 0,
        subSectionIndex: 0,
        components: [],
        errors: [],
      },
      footer: {
        buttons: [],
        canGoBack: false,
      },
    })

    render(<InitialScreenGate applicationId="app-1" step={2} />)

    await waitFor(() => {
      expect(mockedFetchScreen).toHaveBeenCalledWith('app-1', 2, 'is')
    })

    expect(screen.getByText('shell:app-1:Test title')).toBeTruthy()
  })

  it('falls back to bff login redirect when the browser fetch gets a 401', async () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...originalLocation,
        href: 'http://localhost:4250/umsoknir/example-inputs/app-1?step=2',
      },
    })

    mockedFetchScreen.mockRejectedValue(
      new GraphqlHttpError(401, 'Unauthorized', 'Missing sid cookie'),
    )

    render(<InitialScreenGate applicationId="app-1" step={2} />)

    expect(
      await screen.findByText(
        'redirect:http://localhost:4250/umsoknir/example-inputs/app-1?step=2',
      ),
    ).toBeTruthy()
  })
})
