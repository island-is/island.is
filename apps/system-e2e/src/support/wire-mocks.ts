import {
  EqualPredicate,
  FlexiPredicate,
  HttpMethod,
  Imposter,
  Mountebank,
  Proxy,
  ProxyMode,
  Response,
  Stub,
} from '@anev/ts-mountebank'
import { XroadConfig } from '../../../../infra/src/dsl/types/input-types'

const defaultMock = (port: number) => {
  const imposter = new Imposter().withPort(port).withRecordRequests(true)
  return { port, imposter }
}

const mockedServices = {
  xroad: defaultMock(9545),
}

const mb = new Mountebank().withURL(
  process.env.MOCK_SERVER ?? 'http://localhost:2525',
)
export const resetMocks = async () => {
  await Promise.all(
    Object.values(mockedServices).map(async (mock) => {
      await mb.createImposter(mock.imposter)
    }),
  )
}

export const addStub = async (key: keyof typeof mockedServices, stub: Stub) => {
  mockedServices[key].imposter.withStub(stub)
  await mb.createImposter(mockedServices[key].imposter)
}
export const wildcard = async () => {
  mockedServices.xroad.imposter.withStub(
    new Stub()
      .withPredicate(new FlexiPredicate())
      .withProxy(
        new Proxy('http://host.docker.internal:8081').withMode(
          ProxyMode.ProxyAlways,
        ),
      ),
  )
  await mb.createImposter(mockedServices.xroad.imposter)
}
export const addXroadMock = async (
  xroadConfig: XroadConfig,
  servicePathPrefix: string,
  api: string,
  stub: Response | Response[],
  prefixType: 'only-base-path' | 'base-path-with-env' = 'only-base-path',
  method: HttpMethod = HttpMethod.GET,
) => {
  // @ts-ignore
  const path = xroadConfig.getEnv()[servicePathPrefix]['dev'] as string
  const prefix = path.startsWith('r1/') ? '/' : '/r1/'
  const env = prefixType === 'base-path-with-env' ? 'IS-DEV/GOV/10003' : ''
  const stubResponses = Array.isArray(stub) ? stub : [stub]
  const stub1 = new Stub().withPredicate(
    new EqualPredicate()
      .withPath(`${prefix}${env}${path}${api}`)
      .withMethod(method),
  )
  for (const stub1Element of stubResponses) {
    stub1.withResponse(stub1Element)
  }
  mockedServices.xroad.imposter.withStub(stub1)
  await mb.createImposter(mockedServices['xroad'].imposter)
}
