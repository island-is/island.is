/**
 * @jest-environment node
 */

// Server-side fetches run where there is no `window`. This spec uses the node
// environment so that is the real situation, rather than a jsdom `window` that
// has been removed.
import { fetchScreen } from './graphql'
import type { ForwardAuthHeaders } from './graphql'

describe('graphql SDF server-side fetches', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('uses the local bff service directly for server-side screen fetches in local development', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          data: {
            applicationSdfScreen: {
              applicationId: 'app-1',
              locale: 'is',
              header: { title: 'Title' },
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
            },
          },
        }),
    } as Response)
    ;(
      globalThis as typeof globalThis & {
        fetch: typeof fetch
      }
    ).fetch = fetchMock as typeof fetch

    const headers: ForwardAuthHeaders = {
      cookie: 'sid=123',
      authorization: undefined,
      host: 'localhost:4250',
      protocol: 'http',
    }
    await fetchScreen('app-1', undefined, 'is', headers)

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3010/bff/api/graphql?op=ApplicationSdfScreen',
      expect.objectContaining({
        method: 'POST',
      }),
    )
  })
})
