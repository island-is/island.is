import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const envs = {
  APPLICATION_URL: 'http://search-indexer-service',
  ELASTIC_NODE: {
    dev:
      'https://vpc-search-njkekqydiegezhr4vqpkfnw5la.eu-west-1.es.amazonaws.com',
    staging:
      'https://vpc-search-q6hdtjcdlhkffyxvrnmzfwphuq.eu-west-1.es.amazonaws.com',
    prod:
      'https://vpc-search-mw4w5c2m2g5edjrtvwbpzhkw24.eu-west-1.es.amazonaws.com',
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
    dev: '20',
    staging: '40',
    prod: '40',
  },
  AIR_DISCOUNT_SCHEME_FRONTEND_HOSTNAME: {
    dev: ref((h) => h.svc('loftbru.dev01.devland.is')),
    staging: ref((h) => h.svc('loftbru.staging01.devland.is')),
    prod: ref((h) => h.svc('loftbru.island.is')),
  },
}
export const serviceSetup = (): ServiceBuilder<'search-indexer-service'> =>
  service('search-indexer-service')
    .image('services-search-indexer')
    .namespace('search-indexer')
    .serviceAccount('search-indexer')
    .secrets({
      CONTENTFUL_ACCESS_TOKEN: '/k8s/search-indexer/CONTENTFUL_ACCESS_TOKEN',
      API_CMS_SYNC_TOKEN: '/k8s/search-indexer/API_CMS_SYNC_TOKEN',
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
      }),
      secrets: {
        CONTENTFUL_ACCESS_TOKEN: '/k8s/search-indexer/CONTENTFUL_ACCESS_TOKEN',
      },
    })
    .resources({
      requests: {
        cpu: '100m',
        memory: '512Mi',
      },
      limits: {
        cpu: '400m',
        memory: '2048Mi',
      },
    })
    .ingress({
      primary: {
        host: {
          dev: 'search-indexer-service',
          staging: 'search-indexer-service',
          prod: 'search-indexer-service.devland.is',
        },
        paths: ['/'],
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          staging: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          prod: { 'nginx.ingress.kubernetes.io/enable-global-auth': 'false' },
        },
      },
    })
    .replicaCount({
      min: 1,
      max: 1,
      default: 1,
    })
