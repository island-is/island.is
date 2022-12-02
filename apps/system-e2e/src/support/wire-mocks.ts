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
import { XroadConf, XRoadEnvs } from '../../../../infra/src/dsl/xroad'
import { getEnvVariables } from '../../../../infra/src/dsl/service-to-environment/pre-process-service'
import { XRoadMemberClass } from '@island.is/shared/utils/server'

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
export const addXroadMock = async <Conf>(
  options:
    | {
        config: XroadConf<Conf>
        orgType?: XRoadMemberClass
        serviceMemberCode: XRoadEnvs<Conf>
        prefix: XRoadEnvs<Conf>
        apiPath: string
        response: Response | Response[]
        prefixType: 'base-path-with-env'
        method?: HttpMethod
      }
    | {
        config: XroadConf<Conf>
        prefix: XRoadEnvs<Conf>
        response: Response | Response[]
        apiPath: string
        prefixType: 'only-base-path'
        method?: HttpMethod
      },
) => {
  const method = options.method === undefined ? HttpMethod.GET : options.method
  const { envs } = getEnvVariables(
    options.config.getEnv(),
    'xroadConfig',
    'dev',
  )

  const servicePathPrefixValue = envs[options.prefix as string]
  const path =
    typeof servicePathPrefixValue === 'string'
      ? servicePathPrefixValue
      : 'this should never happen url'
  const prefix = path.startsWith('r1/') ? '/' : '/r1/'
  const env =
    options.prefixType === 'base-path-with-env'
      ? `IS-DEV/${options.orgType ?? 'GOV'}/${options.serviceMemberCode}`
      : ''
  const stubResponses = Array.isArray(options.response)
    ? options.response
    : [options.response]
  const stub = new Stub().withPredicate(
    new EqualPredicate()
      .withPath(`${prefix}${env}${path}${options.apiPath}`)
      .withMethod(method),
  )
  for (const response of stubResponses) {
    stub.withResponse(response)
  }
  mockedServices.xroad.imposter.withStub(stub)
  await mb.createImposter(mockedServices.xroad.imposter)
}
