import { Configuration, GeneralApi } from '../../../gen/fetch/v1'
import {
  APPLICATION_GUID_HEADER,
  applicationGuidMiddleware,
  withApplicationGuidContext,
} from './withApplicationGuid'

describe('application guid header', () => {
  const makeApi = () => {
    const fetchApi = jest.fn().mockResolvedValue({
      status: 200,
      json: async () => [],
    })
    const api = new GeneralApi(
      new Configuration({
        fetchApi,
        middleware: [applicationGuidMiddleware],
      }),
    )
    return { api, fetchApi }
  }

  const sentHeaders = (fetchApi: jest.Mock) => fetchApi.mock.calls[0][1].headers

  describe('withApplicationGuidContext', () => {
    it('adds the header to requests made inside the context', async () => {
      const { api, fetchApi } = makeApi()

      await withApplicationGuidContext('guid-123', () =>
        api.apiProtectedV1GeneralCurrenciesGet(),
      )

      expect(sentHeaders(fetchApi)[APPLICATION_GUID_HEADER]).toBe('guid-123')
    })

    it('keeps the header across awaits inside the context', async () => {
      const { api, fetchApi } = makeApi()

      await withApplicationGuidContext('guid-123', async () => {
        await Promise.resolve()
        await api.apiProtectedV1GeneralCurrenciesGet()
      })

      expect(sentHeaders(fetchApi)[APPLICATION_GUID_HEADER]).toBe('guid-123')
    })

    it('does not add the header outside a context', async () => {
      const { api, fetchApi } = makeApi()

      await api.apiProtectedV1GeneralCurrenciesGet()

      expect(sentHeaders(fetchApi)).not.toHaveProperty(APPLICATION_GUID_HEADER)
    })

    it('runs the callback without a header when there is no application guid', async () => {
      const { api, fetchApi } = makeApi()

      await withApplicationGuidContext(undefined, () =>
        api.apiProtectedV1GeneralCurrenciesGet(),
      )

      expect(sentHeaders(fetchApi)).not.toHaveProperty(APPLICATION_GUID_HEADER)
    })

    it('keeps concurrent contexts apart', async () => {
      const { api, fetchApi } = makeApi()

      await Promise.all(
        ['guid-a', 'guid-b'].map((guid) =>
          withApplicationGuidContext(guid, async () => {
            await new Promise((resolve) => setTimeout(resolve, 1))
            await api.apiProtectedV1GeneralCurrenciesGet()
          }),
        ),
      )

      const sent = fetchApi.mock.calls.map(
        (call) => call[1].headers[APPLICATION_GUID_HEADER],
      )
      expect(sent.sort()).toEqual(['guid-a', 'guid-b'])
    })
  })
})
