/**
 * @jest-environment jsdom
 */

import type { ReactNode } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { GraphqlHttpError, fetchScreen } from '../lib/graphql'
import { InitialScreenGate } from './InitialScreenGate'

// InitialScreenGate reads the active locale via useLocale(), which needs
// react-intl's IntlProvider in the tree; LocaleContext's default reports
// `lang: 'is'`, so the seeded fetch locale stays 'is'.
const wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="is" messages={{}}>
    {children}
  </IntlProvider>
)

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

    render(<InitialScreenGate applicationId="app-1" screen="page-2" />, {
      wrapper,
    })

    await waitFor(() => {
      expect(mockedFetchScreen).toHaveBeenCalledWith('app-1', 'page-2', 'is')
    })

    expect(screen.getByText('shell:app-1:Test title')).toBeTruthy()
  })

  it('falls back to bff login redirect when the browser fetch gets a 401', async () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...originalLocation,
        href: 'http://localhost:4250/umsoknir/example-inputs/app-1?screen=page-2',
      },
    })

    mockedFetchScreen.mockRejectedValue(
      new GraphqlHttpError(401, 'Unauthorized', 'Missing sid cookie'),
    )

    render(<InitialScreenGate applicationId="app-1" screen="page-2" />, {
      wrapper,
    })

    expect(
      await screen.findByText(
        'redirect:http://localhost:4250/umsoknir/example-inputs/app-1?screen=page-2',
      ),
    ).toBeTruthy()
  })
})

describe('InitialScreenGate address bar', () => {
  const buildScreen = (pageId: string) => ({
    applicationId: 'app-1',
    locale: 'is',
    header: { title: 'Test title' },
    stepper: { sections: [], activeSectionIndex: 0, activeSubSectionIndex: 0 },
    page: {
      id: pageId,
      index: 0,
      sectionIndex: 0,
      subSectionIndex: 0,
      components: [],
      errors: [],
    },
    footer: { buttons: [], canGoBack: false },
  })

  let replaceState: jest.SpyInstance

  beforeEach(() => {
    replaceState = jest.spyOn(window.history, 'replaceState')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('adds the screen id when the link had none', async () => {
    mockedFetchScreen.mockResolvedValue(buildScreen('page-1'))

    render(<InitialScreenGate applicationId="app-1" />, { wrapper })

    await screen.findByText('shell:app-1:Test title')
    expect(mockedFetchScreen).toHaveBeenCalledWith('app-1', undefined, 'is')
    expect(replaceState).toHaveBeenCalledWith(
      null,
      '',
      expect.stringContaining('screen=page-1'),
    )
  })

  it('corrects the address bar when the server showed another screen', async () => {
    mockedFetchScreen.mockResolvedValue(buildScreen('page-1'))

    render(<InitialScreenGate applicationId="app-1" screen="gone" />, {
      wrapper,
    })

    await screen.findByText('shell:app-1:Test title')
    expect(replaceState).toHaveBeenCalledWith(
      null,
      '',
      expect.stringContaining('screen=page-1'),
    )
  })

  it('leaves the address bar alone when the requested screen is shown', async () => {
    mockedFetchScreen.mockResolvedValue(buildScreen('page-1'))

    render(<InitialScreenGate applicationId="app-1" screen="page-1" />, {
      wrapper,
    })

    await screen.findByText('shell:app-1:Test title')
    expect(replaceState).not.toHaveBeenCalled()
  })
})
