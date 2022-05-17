import { service, ServiceBuilder, ref } from '../../../../infra/src/dsl/dsl'

/**
 * This setup is for the Identity Server, which is hosted in a different repository - https://github.com/island-is/identity-server.web
 */
export const serviceSetup = (services: {
  authApi: ServiceBuilder<'services-auth-api'>
}): ServiceBuilder<'identity-server'> => {
  return service('identity-server')
    .namespace('identity-server')
    .image('identity-server')
    .env({
      AWS__CloudWatch__AuditLogGroup: '/identity-server/audit-log',
      ASPNETCORE_URLS: 'http://*:5000',
      CORECLR_ENABLE_PROFILING: '1',
      CORECLR_PROFILER: '{846F5F1C-F9AE-4B07-969E-05C26BC060D8}',
      CORECLR_PROFILER_PATH: '/opt/datadog/Datadog.Trace.ClrProfiler.Native.so',
      DD_INTEGRATIONS: '/opt/datadog/integrations.json',
      DD_DOTNET_TRACER_HOME: '/opt/datadog',
      Datadog__Metrics__Port: '5003',
      AudkenniSettings__Retries: '24',

      AWS__SystemsManager__ParameterStore__DataProtectionPrefix: {
        dev: '/k8s/identity-server/DataProtectionSecret',
        staging: '/k8s/identity-server/DataProtectionSecret',
        prod: '/k8s/identity-server/DataProtectionSecret',
      },
      CacheSettings__Enabled: {
        dev: 'true',
        staging: 'true',
        prod: 'true',
      },
      CacheSettings__Memcached__Address: {
        dev: 'identity-server.5fzau3.cfg.euw1.cache.amazonaws.com',
        staging: 'identity-server.ab9ckb.cfg.euw1.cache.amazonaws.com',
        prod: 'identity-server.dnugi2.cfg.euw1.cache.amazonaws.com',
      },
      CacheSettings__Memcached__Port: {
        dev: '11211',
        staging: '11211',
        prod: '11211',
      },
      CacheSettings__Redis__Address: {
        dev:
          'clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com',
        staging:
          'clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com',
        prod:
          'clustercfg.general-redis-cluster-group.dnugi2.euw1.cache.amazonaws.com',
      },
      CacheSettings__Redis__Port: {
        dev: '6379',
        staging: '6379',
        prod: '6379',
      },
      IdentityServer__EnableFakeLogin: {
        dev: 'true',
        staging: 'true',
        prod: 'true',
      },
      IdentityServer__EnableFeatureDeploymentWildcards: {
        dev: 'true',
        staging: 'true',
        prod: 'https://innskra.island.is',
      },
      IdentityServer__EnableDelegation: {
        dev: 'true',
        staging: '',
        prod: '',
      },
      PersistenceSettings__BaseAddress: ref(
        (h) => `http://${h.svc(services.authApi)}`,
      ),
      PersistenceSettings__UserProfileBaseAddress:
        'http://web-service-portal-api.service-portal.svc.cluster.local',
      Application__MinCompletionPortThreads: {
        dev: '',
        staging: '',
        prod: '10',
      },
    })
    .secrets({
      AudkenniSettings__ClientId: '/k8s/identity-server/AudkenniClientId',
      AudkenniSettings__ClientSecret:
        '/k8s/identity-server/AudkenniClientSecret',
      IdentityServer__FakePersons: '/k8s/identity-server/FakePersons',
      IdentityServer__SigningCertificate__Passphrase:
        '/k8s/identity-server/SigningCertificatePassphrase',
      PersistenceSettings__AccessTokenManagementSettings__ClientSecret:
        '/k8s/identity-server/ClientSecret',
      Scopes__Admin__RootAccessList: '/k8s/identity-server/AdminRootAccessList',
      FeatureFlags__ConfigCatSdkKey: '/k8s/configcat/CONFIGCAT_SDK_KEY',
    })
    .ingress({
      primary: {
        host: {
          dev: 'identity-server',
          staging: 'identity-server',
          prod: 'innskra.island.is',
        },
        paths: ['/'],
        public: true,
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          staging: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          prod: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
        },
      },
    })
    .files({
      filename: 'pathids-signing.pfx',
      env: 'IdentityServer__SigningCertificate__Path',
    })
    .healthPort(5010)
    .targetPort(5000)
    .serviceAccount('identity-server')
    .readiness('/readiness')
    .liveness('/liveness')
}
