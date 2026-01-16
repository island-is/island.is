import {
  CodeOwners,
  Context,
  json,
  service,
  ServiceBuilder,
} from '../../../../infra/src/dsl/dsl'

const REDIS_NODE_CONFIG = {
  dev: json([
    'clustercfg.general-redis-cluster-group.fbbkpo.euw1.cache.amazonaws.com:6379',
  ]),
  staging: json([
    'clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379',
  ]),
  prod: json([
    'clustercfg.general-redis-cluster-group.dnugi2.euw1.cache.amazonaws.com:6379',
  ]),
}

const serviceName = 'services-form-system-api'
const workerName = `${serviceName}-worker`

export const serviceSetup = (): ServiceBuilder<typeof serviceName> =>
  service(serviceName)
    .image(serviceName)
    .namespace(serviceName)
    .serviceAccount(serviceName)
    .codeOwner(CodeOwners.Advania)
    .db()
    .migrations()
    .env({
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      S3_REGION: 'eu-west-1',
      S3_TIME_TO_LIVE_POST: '15',
      S3_TIME_TO_LIVE_GET: '5',
      FILE_STORAGE_UPLOAD_BUCKET: {
        dev: 'island-is-dev-upload-api',
        staging: 'island-is-staging-upload-api',
        prod: 'island-is-prod-upload-api',
      },
      FORM_SYSTEM_BUCKET: {
        dev: 'island-is-dev-form-system-presign-bucket',
        staging: 'island-is-staging-form-system-presign-bucket',
        prod: 'island-is-prod-form-system-presign-bucket',
      },
      REDIS_URL_NODE_01: REDIS_NODE_CONFIG,
    })
    .secrets({
      FORM_SYSTEM_ZENDESK_TENANT_ID_SANDBOX:
        '/k8s/form-system/FORM_SYSTEM_ZENDESK_TENANT_ID_SANDBOX',
      FORM_SYSTEM_ZENDESK_TENANT_ID_PROD:
        '/k8s/form-system/FORM_SYSTEM_ZENDESK_TENANT_ID_PROD',
      FORM_SYSTEM_ZENDESK_API_KEY_SANDBOX:
        '/k8s/form-system/FORM_SYSTEM_ZENDESK_API_KEY_SANDBOX',
      FORM_SYSTEM_ZENDESK_API_KEY_PROD:
        '/k8s/form-system/FORM_SYSTEM_ZENDESK_API_KEY_PROD',
    })
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '50m', memory: '256Mi' },
    })
    .liveness('/liveness')
    .readiness('/liveness')
    .grantNamespaces('islandis', 'nginx-ingress-external')

/**
 * Make sure that each feature deployment has its own bull prefix. Since each
 * feature deployment has its own database and applications, we don't want bull
 * jobs to jump between environments.
 */
const FORM_SYSTEM_BULL_PREFIX = (ctx: Context) =>
  ctx.featureDeploymentName
    ? `form_system_api_bull_module.${ctx.featureDeploymentName}`
    : 'form_system_api_bull_module'

export const workerSetup = (): ServiceBuilder<typeof workerName> =>
  service(workerName)
    .image(serviceName)
    .namespace(serviceName)
    .serviceAccount(workerName)
    .codeOwner(CodeOwners.Advania)
    .redis()
    .db()
    .env({
      FORM_SYSTEM_BULL_PREFIX,
    })
    .args('main.cjs', '--job', 'worker')
    .command('node')
    .extraAttributes({
      dev: { schedule: '*/30 * * * *' },
      staging: { schedule: '*/30 * * * *' },
      prod: { schedule: '*/30 * * * *' },
    })
    .resources({
      limits: { cpu: '400m', memory: '768Mi' },
      requests: { cpu: '150m', memory: '384Mi' },
    })
