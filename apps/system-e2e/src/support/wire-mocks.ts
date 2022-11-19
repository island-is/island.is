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
import { getEnvVariables } from '../../../../infra/src/dsl/service-to-environment/pre-process-service'

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
export const addXroadMock = async ({
  config,
  prefix: servicePathPrefix,
  path: api,
  response,
  conf: prefixType = 'only-base-path',
  method = HttpMethod.GET,
}: {
  config: XroadConfig
  prefix: string
  path: string
  response: Response | Response[]
  conf?: 'only-base-path' | 'base-path-with-env'
  method?: HttpMethod
}) => {
  const { envs } = getEnvVariables(config.getEnv(), 'xroadConfig', 'dev')
  const servicePathPrefixValue = envs[servicePathPrefix]
  const path =
    typeof servicePathPrefixValue === 'string'
      ? servicePathPrefixValue
      : 'this should never happen url'
  const prefix = path.startsWith('r1/') ? '/' : '/r1/'
  const env = prefixType === 'base-path-with-env' ? 'IS-DEV/GOV/10003' : ''
  const stubResponses = Array.isArray(response) ? response : [response]
  const stub = new Stub().withPredicate(
    new EqualPredicate()
      .withPath(`${prefix}${env}${path}${api}`)
      .withMethod(method),
  )
  for (const response of stubResponses) {
    stub.withResponse(response)
  }
  mockedServices.xroad.imposter.withStub(stub)
  await mb.createImposter(mockedServices.xroad.imposter)
}
