import { act, render } from '@testing-library/react'

import type { PowerBiSlice as PowerBiSliceSchema } from '@island.is/web/graphql/schema'

import { PowerBiSlice } from './PowerBiSlice'

type Handler = (event: unknown) => Promise<void>

let embedProps: {
  getEmbeddedComponent: (embed: unknown) => void
  eventHandlers: Map<string, Handler>
}

jest.mock('powerbi-client', () => ({
  models: {
    LayoutType: { MobilePortrait: 2 },
    TokenType: { Embed: 1 },
  },
}))
jest.mock('powerbi-client-react', () => ({
  PowerBIEmbed: (props: typeof embedProps) => {
    embedProps = props
    return null
  },
}))
jest.mock('next/router', () => ({
  useRouter: () => ({ query: {}, asPath: '/report', push: jest.fn() }),
}))
jest.mock('@apollo/client', () => ({
  useApolloClient: () => ({}),
  useQuery: () => ({}),
}))
jest.mock('@island.is/web/hooks', () => ({
  useNamespace: () => (_key: string, fallback: unknown) => fallback,
}))
jest.mock('@island.is/web/i18n', () => ({
  useI18n: () => ({ activeLocale: 'is' }),
}))
jest.mock('@island.is/web/screens/queries', () => ({
  GET_NAMESPACE_QUERY: {},
}))
jest.mock('@island.is/web/screens/queries/Fiskistofa', () => ({
  GET_SINGLE_SHIP: {},
}))

const DESKTOP_WIDTH = 1440
const MOBILE_WIDTH = 375

const desktopPage = {
  name: 'desktop-page',
  defaultSize: { width: 1000, height: 500 },
  mobileSize: { width: 320, height: 960 },
  hasLayout: async () => false,
  getSlicers: async () => [],
}
const mobilePage = {
  ...desktopPage,
  name: 'mobile-page',
  hasLayout: async () => true,
}

const setup = async ({
  config = {},
  width = DESKTOP_WIDTH,
  page = desktopPage as unknown,
}: {
  config?: Record<string, unknown>
  width?: number
  page?: unknown
}) => {
  window.innerWidth = width

  render(
    <PowerBiSlice
      slice={{ powerBiEmbedProps: config } as unknown as PowerBiSliceSchema}
    />,
  )

  const report = {
    element: document.createElement('div'),
    iframe: document.createElement('iframe'),
    getActivePage: jest.fn(async () => page),
  }

  act(() => embedProps.getEmbeddedComponent(report))

  const fire = async (eventName: string, pageName = 'page') =>
    act(async () => {
      await embedProps.eventHandlers.get(eventName)?.({
        target: { powerBiEmbed: report },
        detail: { newPage: { name: pageName } },
      })
    })

  return { report, fire }
}

describe('PowerBiSlice sizing', () => {
  it('shows a placeholder until the report has loaded', async () => {
    const { report } = await setup({})

    expect(report.element.style.aspectRatio).toBe('16/9')
  })

  it('uses the size of the active page on desktop', async () => {
    const { report, fire } = await setup({})

    await fire('loaded')

    expect(report.element.style.aspectRatio).toBe('1000/500')
    expect(report.element.style.height).toBe('auto')
  })

  describe('on small screens with the mobile layout enabled', () => {
    const config = { displayMobilePortraitLayoutOnSmallScreens: true }

    it('uses the mobile size when the page has a mobile layout', async () => {
      const { report, fire } = await setup({
        config,
        width: MOBILE_WIDTH,
        page: mobilePage,
      })

      await fire('pageChanged')

      expect(report.element.style.aspectRatio).toBe('320/960')
    })

    it('uses the desktop size when the page has no mobile layout', async () => {
      const { report, fire } = await setup({ config, width: MOBILE_WIDTH })

      await fire('pageChanged')

      expect(report.element.style.aspectRatio).toBe('1000/500')
    })

    it('falls back to portrait when the mobile size is unusable', async () => {
      const { report, fire } = await setup({
        config,
        width: MOBILE_WIDTH,
        page: { ...mobilePage, mobileSize: undefined },
      })

      await fire('pageChanged')

      expect(report.element.style.aspectRatio).toBe('9/16')
    })

    const configuredPages = {
      style: {
        element: { height: '600px', minHeight: '760px' },
        pages: {
          configured: {
            iframe: { height: '1420px' },
          },
        },
      },
    }

    it('prefers the size of the mobile layout over CMS styles', async () => {
      const { report, fire } = await setup({
        config: { ...config, ...configuredPages },
        width: MOBILE_WIDTH,
        page: { ...mobilePage, name: 'configured' },
      })

      await fire('pageChanged')

      expect(report.element.style.aspectRatio).toBe('320/960')
      expect(report.element.style.height).toBe('auto')
      expect(report.element.style.minHeight).toBe('')
      expect(report.iframe.style.height).toBe('100%')
    })

    it('sizes a new page on a slice with a configured height', async () => {
      const { report, fire } = await setup({
        config: { ...config, ...configuredPages },
        width: MOBILE_WIDTH,
        page: { ...mobilePage, name: 'brand-new-page' },
      })

      await fire('pageChanged')

      expect(report.element.style.aspectRatio).toBe('320/960')
      expect(report.element.style.height).toBe('auto')
      expect(report.element.style.minHeight).toBe('')
    })

    it('uses CMS page styles when the mobile size is unknown', async () => {
      const { report, fire } = await setup({
        config: { ...config, ...configuredPages },
        width: MOBILE_WIDTH,
        page: { ...mobilePage, name: 'configured', mobileSize: undefined },
      })

      await fire('pageChanged')

      expect(report.element.style.aspectRatio).toBe('')
      expect(report.iframe.style.height).toBe('1420px')
      expect(report.element.style.minHeight).toBe('760px')
    })

    it('uses CMS page styles for a page without a mobile layout', async () => {
      const { report, fire } = await setup({
        config: { ...config, ...configuredPages },
        width: MOBILE_WIDTH,
        page: { ...desktopPage, name: 'configured' },
      })

      await fire('pageChanged')

      expect(report.element.style.aspectRatio).toBe('')
      expect(report.iframe.style.height).toBe('1420px')
    })

    it('restores every style a previous page applied', async () => {
      const { report, fire } = await setup({
        config: {
          ...config,
          style: {
            element: { maxHeight: '1200px' },
            pages: {
              styled: {
                element: { maxHeight: '900px', maxWidth: '300px' },
                iframe: { width: '90%' },
              },
            },
          },
        },
        width: MOBILE_WIDTH,
        page: { ...desktopPage, name: 'styled' },
      })

      await fire('pageChanged')
      expect(report.element.style.maxHeight).toBe('900px')
      expect(report.element.style.maxWidth).toBe('300px')
      expect(report.iframe.style.width).toBe('90%')

      report.getActivePage.mockResolvedValue(mobilePage)
      await fire('pageChanged')

      // The mobile layout's own size isn't capped by the CMS max height
      expect(report.element.style.maxHeight).toBe('')
      expect(report.element.style.maxWidth).toBe('')
      expect(report.iframe.style.width).toBe('')

      // Nothing is left to restore on the next page change
      report.element.style.maxWidth = '10px'
      await fire('pageChanged')

      expect(report.element.style.maxWidth).toBe('10px')
    })

    it.each([
      ['a page without a mobile layout', desktopPage],
      ['a page with its own styles', { name: 'styled', mobileSize: undefined }],
    ])(
      'restores the CMS max height when switching to %s',
      async (_, nextPage) => {
        const { report, fire } = await setup({
          config: {
            ...config,
            style: {
              element: { maxHeight: '1200px' },
              pages: { styled: { iframe: { height: '1400px' } } },
            },
          },
          width: MOBILE_WIDTH,
          page: mobilePage,
        })

        await fire('pageChanged')
        expect(report.element.style.maxHeight).toBe('')

        report.getActivePage.mockResolvedValue({ ...mobilePage, ...nextPage })
        await fire('pageChanged')

        expect(report.element.style.maxHeight).toBe('1200px')
      },
    )

    it.each([
      ['100%', undefined],
      ['800px', { height: '800px' }],
    ])(
      'resets the iframe height to %s for a page without its own',
      async (expected, iframe) => {
        const { report, fire } = await setup({
          config: {
            ...config,
            style: {
              iframe,
              pages: {
                tall: { iframe: { height: '1420px' } },
                elementOnly: { element: { height: '900px' } },
              },
            },
          },
          width: MOBILE_WIDTH,
          page: { ...desktopPage, name: 'tall' },
        })

        await fire('pageChanged')
        expect(report.iframe.style.height).toBe('1420px')

        report.getActivePage.mockResolvedValue({
          ...desktopPage,
          name: 'elementOnly',
        })
        await fire('pageChanged')

        expect(report.iframe.style.height).toBe(expected)
      },
    )
  })

  it('lets a height from the CMS win over the page size', async () => {
    const { report, fire } = await setup({
      config: { style: { element: { height: '800px' } } },
    })

    expect(report.element.style.height).toBe('800px')
    expect(report.element.style.aspectRatio).toBe('')

    await fire('loaded')

    expect(report.element.style.height).toBe('800px')
    expect(report.element.style.aspectRatio).toBe('')
  })

  it('applies iframe styles from the CMS to the iframe', async () => {
    const { report } = await setup({
      config: { style: { iframe: { height: '800px' } } },
    })

    expect(report.iframe.style.height).toBe('800px')
    expect(report.element.style.height).toBe('auto')
  })

  it('ignores a slow response for a page the user has already left', async () => {
    const { report, fire } = await setup({})
    let resolveSlowPage: (page: unknown) => void = () => undefined

    report.getActivePage.mockImplementationOnce(
      () => new Promise((resolve) => (resolveSlowPage = resolve)),
    )
    const slow = fire('pageChanged', 'slow')

    report.getActivePage.mockResolvedValue({
      ...desktopPage,
      defaultSize: { width: 400, height: 300 },
    })
    await fire('pageChanged', 'fast')

    resolveSlowPage(desktopPage)
    await slow

    expect(report.element.style.aspectRatio).toBe('400/300')
  })

  // Without the error handling this crashes the jest worker with an unhandled
  // rejection, rather than failing the assertion below
  it('keeps the current size if the report fails to respond', async () => {
    const { report, fire } = await setup({})
    report.getActivePage.mockRejectedValue(new Error('not ready'))

    await fire('pageChanged')

    expect(report.element.style.aspectRatio).toBe('16/9')
  })
})
