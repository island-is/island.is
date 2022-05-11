import { service, ServiceBuilder } from '../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'identity-server'> => {
  return service('identity-server')
    .namespace('identity-server')
    .env({
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
        dev: 'clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com',
        staging: 'clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com',
        prod: 'clustercfg.general-redis-cluster-group.dnugi2.euw1.cache.amazonaws.com',
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
      PersistenceSettings__BaseAddress: {
        dev: 'http://web-services-auth-api',
        staging: 'http://web-services-auth-api',
        prod: 'http://web-services-auth-api',
      },
      PersistenceSettings__UserProfileBaseAddress: {
        dev: 'http://web-service-portal-api.service-portal.svc.cluster.local',
        staging: 'http://web-service-portal-api.service-portal.svc.cluster.local',
        prod: 'http://web-service-portal-api.service-portal.svc.cluster.local',
      },
      Application__MinCompletionPortThreads: {
        dev: '',
        staging: '',
        prod: '10'
      }
    })
    .secrets({
      AudkenniSettings__ClientId: '/k8s/identity-server/AudkenniClientId',
      AudkenniSettings__ClientSecret: '/k8s/identity-server/AudkenniClientSecret',
      IdentityServer__FakePersons: '/k8s/identity-server/FakePersons',
      IdentityServer__SigningCertificate__Passphrase: '/k8s/identity-server/SigningCertificatePassphrase',
      PersistenceSettings__AccessTokenManagementSettings__ClientSecret: '/k8s/identity-server/ClientSecret',
      Scopes__Admin__RootAccessList: '/k8s/identity-server/AdminRootAccessList',
      FeatureFlags__ConfigCatSdkKey: '/k8s/configcat/CONFIGCAT_SDK_KEY'
    })
    .ingress({
      primary: {
        host: {
          dev: 'identity-server.dev01.devland.is',
          staging: 'identity-server.staging01.devland.is',
          prod: 'innskra.island.is',
        },
        extraAnnotations: {
            dev: {
              'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
            },
            staging: {
              'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
            },
            prod: {},
        },
        paths:
        [
          {
            path: '/',
          },
        ],
        public: true,
      },
    })
    .serviceAccount('identity-server')
    .readiness('/liveness')
    .liveness('/liveness')
}
