import { service, ServiceBuilder } from '../../../infra/src/dsl/dsl'
import { settings } from '../../../infra/src/dsl/settings'

export const serviceSetup = (): ServiceBuilder<'github-actions-cache'> => {
  return service('github-actions-cache')
    .namespace('github-actions-cache')
    .serviceAccount()
    .command('node')
    .args('--tls-min-v1.0', 'main.js')

    .env({
      REDIS_NODES:
        'clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379',
    })
    .ingress({
      primary: {
        host: {
          dev: ['cache'],
          staging: [''],
          prod: ['', ''],
        },
        paths: ['/'],
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          staging: {},
          prod: {},
        },
        public: true,
      },
    })
    .readiness('/health')
    .liveness('/liveness')
    .rolloutStrategy('RollingUpdate')
    .replicaCount({
      min: 3,
      max: 8,
      default: 5,
    })
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '100m', memory: '256Mi' },
    })
}
