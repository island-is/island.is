import {
  CodeOwners,
  ref,
  service,
  ServiceBuilder,
} from '../../../../infra/src/dsl/dsl'

const envs = {
  APPLICATION_URL: 'http://search-indexer-service',
  ELASTIC_NODE: {
    dev: 'https://vpc-search-njkekqydiegezhr4vqpkfnw5la.eu-west-1.es.amazonaws.com',
    staging:
      'https://vpc-search-q6hdtjcdlhkffyxvrnmzfwphuq.eu-west-1.es.amazonaws.com',
    prod: 'https://vpc-search-mw4w5c2m2g5edjrtvwbpzhkw24.eu-west-1.es.amazonaws.com',
  },
  ELASTIC_INDEX: 'island-is',
  CONTENTFUL_SPACE: '8k0h54kbe6bj',
  CONTENTFUL_ENVIRONMENT: 'master',
  CONTENTFUL_HOST: {
    dev: 'preview.contentful.com',
    staging: 'cdn.contentful.com',
    prod: 'cdn.contentful.com',
  },
  CONTENTFUL_ENTRY_FETCH_CHUNK_SIZE: {
    dev: '40',
    staging: '40',
    prod: '40',
  },
  AIR_DISCOUNT_SCHEME_FRONTEND_HOSTNAME: {
    dev: 'loftbru.dev01.devland.is',
    staging: 'loftbru.staging01.devland.is',
    prod: 'loftbru.island.is',
  },
  ENVIRONMENT: ref((h) => h.env.type),
}
export const serviceSetup = (): ServiceBuilder<'search-indexer-service'> =>
  service('search-indexer-service')
    .image('services-search-indexer')
    .namespace('search-indexer')
    .serviceAccount('search-indexer')
    .codeOwner(CodeOwners.Stefna)
    .secrets({
      CONTENTFUL_ACCESS_TOKEN: '/k8s/search-indexer/CONTENTFUL_ACCESS_TOKEN',
      API_CMS_SYNC_TOKEN: '/k8s/search-indexer/API_CMS_SYNC_TOKEN',
      API_CMS_DELETION_TOKEN: '/k8s/search-indexer/API_CMS_DELETION_TOKEN',
      APOLLO_BYPASS_CACHE_SECRET: '/k8s/api/APOLLO_BYPASS_CACHE_SECRET',
    })
    .env(envs)
    .initContainer({
      containers: [
        {
          command: '/usr/local/bin/node',
          args: ['/webapp/migrateAws.js'],
          name: 'migrate-aws',
          resources: {
            requests: {
              cpu: '100m',
              memory: '512Mi',
            },
            limits: {
              cpu: '400m',
              memory: '2048Mi',
            },
          },
        },
        {
          command: '/usr/local/bin/node',
          args: ['/webapp/migrateElastic.js'],
          name: 'migrate-elastic',
          resources: {
            requests: {
              cpu: '300m',
              memory: '3072Mi',
            },
            limits: {
              cpu: '700m',
              memory: '4096Mi',
            },
          },
        },
        {
          command: '/usr/local/bin/node',
          args: ['/webapp/migrateKibana.js'],
          name: 'migrate-kibana',
          resources: {
            requests: {
              cpu: '100m',
              memory: '512Mi',
            },
            limits: {
              cpu: '400m',
              memory: '2048Mi',
            },
          },
        },
      ],
      envs: Object.assign({}, envs, {
        S3_BUCKET: {
          dev: 'dev-es-custom-packages',
          staging: 'staging-es-custom-packages',
          prod: 'prod-es-custom-packages',
        },
        ELASTIC_DOMAIN: 'search',
        NODE_OPTIONS: '--max-old-space-size=2048',
      }),
      secrets: {
        CONTENTFUL_ACCESS_TOKEN: '/k8s/search-indexer/CONTENTFUL_ACCESS_TOKEN',
        CONFIGCAT_SDK_KEY: '/k8s/configcat/CONFIGCAT_SDK_KEY',
      },
    })
    .resources({
      requests: {
        cpu: '400m',
        memory: '3072Mi',
      },
      limits: {
        cpu: '800m',
        memory: '4096Mi',
      },
    })
    .ingress({
      primary: {
        host: {
          dev: 'search-indexer-service',
          staging: 'search-indexer-service',
          prod: 'search-indexer-service',
        },
        paths: ['/'],
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          staging: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          prod: {},
        },
      },
    })
    .replicaCount({
      min: 1,
      max: 1,
      default: 1,
    })
    .extraAttributes({
      dev: { progressDeadlineSeconds: 25 * 60 },
      staging: { progressDeadlineSeconds: 25 * 60 },
      prod: { progressDeadlineSeconds: 25 * 60 },
    })
