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
  XROAD_BASE_PATH: defaultMock(9029),
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
  mockedServices.XROAD_BASE_PATH.imposter.withStub(
    new Stub()
      .withPredicate(new FlexiPredicate().withMethod(HttpMethod.GET))
      .withProxy(
        new Proxy('http://host.docker.internal:8081').withMode(
          ProxyMode.ProxyAlways,
        ),
      ),
  )
  await mb.createImposter(mockedServices['XROAD_BASE_PATH'].imposter)
}
export const addXroadMock = async (
  xroadConfig: XroadConfig,
  servicePathPrefix: string,
  api: string,
  stub: Response,
) => {
  // @ts-ignore
  const path = xroadConfig.getEnv()[servicePathPrefix]['dev'] as string
  const prefix = path.startsWith('r1/') ? '/' : '/r1/'
  mockedServices.XROAD_BASE_PATH.imposter.withStub(
    new Stub()
      .withPredicate(new EqualPredicate().withPath(`${prefix}${path}${api}`))
      .withResponse(stub),
  )
  await mb.createImposter(mockedServices['XROAD_BASE_PATH'].imposter)
}
