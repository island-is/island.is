import {
  FlexiPredicate,
  HttpMethod,
  Imposter,
  Mountebank,
  Operator,
  Proxy,
  ProxyMode,
  Response,
  Stub,
} from '@anev/ts-mountebank'
import {
  Base,
  XroadConf,
  XRoadEnvs,
  XroadSectionConfig,
} from '../../../../../../infra/src/dsl/xroad'
import { getEnvVariables } from '../../../../../../infra/src/dsl/service-to-environment/pre-process-service'
import { XRoadMemberClass } from '@island.is/shared/utils/server'
import { serializeValueSource } from '../../../../../../infra/src/dsl/output-generators/serialization-helpers'
import { Localhost } from '../../../../../../infra/src/dsl/localhost-runtime'
import {
  EnvironmentVariableValue,
  ServiceDefinitionForEnv,
  ValueSource,
} from '../../../../../../infra/src/dsl/types/input-types'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Envs } from '../../../../../../infra/src/environments'
import { env, TestEnvironment } from './urls'

const getServiceMock = (envVariableRef: ValueSource) => {
  const resolver = new Localhost()
  serializeValueSource(
    envVariableRef,
    resolver,
    {} as unknown as ServiceDefinitionForEnv,
    Envs.dev01,
  )
  const ports = Object.values(resolver.ports)
  if (ports.length !== 1)
    throw new Error('Error discovering the port for Xroad service')
  const imposter = new Imposter().withPort(ports[0]).withRecordRequests(true)
  return { port: ports[0], imposter }
}

const getVariableValue = (
  envVar: EnvironmentVariableValue,
  env: TestEnvironment,
) => {
  switch (typeof envVar) {
    case 'object': {
      const envValues: { [name in TestEnvironment]: ValueSource } = {
        local: envVar.local ?? envVar.dev,
        dev: envVar.dev,
        staging: envVar.staging,
        prod: 'no mocking in prod',
      }
      const result = envValues[env]
      if (typeof result === 'string') {
        throw new Error('Should have been a reference, not a string value')
      } else {
        return result
      }
    }
    case 'function':
      return envVar
    default:
      throw new Error('Env variable should have been a reference')
  }
}

const mockedServices = {
  xroad: getServiceMock(
    getVariableValue(
      Base.getEnvVarByName('XROAD_BASE_PATH') ?? 'missing var',
      env,
    ),
  ),
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

export const wildcard = async (target: string) => {
  mockedServices.xroad.imposter.withStub(
    new Stub()
      .withPredicate(new FlexiPredicate())
      .withProxy(
        new Proxy(target.replace('localhost', 'host.docker.internal')).withMode(
          ProxyMode.ProxyAlways,
        ),
      ),
  )
  await mb.createImposter(mockedServices.xroad.imposter)
}
export const addXroadMock = async <Conf extends XroadSectionConfig>(
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
      ? `IS-DEV/${options.orgType ?? 'GOV'}/${String(
          options.serviceMemberCode,
        )}`
      : ''
  const stubResponses = Array.isArray(options.response)
    ? options.response
    : [options.response]

  const [apiPath, query] = options.apiPath.split('?')
  const queries = query
    ? Object.fromEntries(new URLSearchParams(query))
    : undefined

  const stub = new Stub().withPredicate(
    new FlexiPredicate()
      .withOperator(Operator.deepEquals)
      .withPath(`${prefix}${env}${path}${apiPath}`)
      .withMethod(method)
      .withQuery(queries),
  )
  for (const response of stubResponses) {
    stub.withResponse(response)
  }
  mockedServices.xroad.imposter.withStub(stub)
  await mb.createImposter(mockedServices.xroad.imposter)
}
