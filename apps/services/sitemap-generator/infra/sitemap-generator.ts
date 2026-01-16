import {
  CodeOwners,
  ServiceBuilder,
  service,
} from '../../../../infra/src/dsl/dsl'

const serviceName = 'sitemap-generator'
const serviceWorkerName = `${serviceName}-worker`
const imageName = `services-${serviceName}`

export const sitemapGeneratorWorkerSetup = (): ServiceBuilder<
  typeof serviceWorkerName
> =>
  service(serviceWorkerName)
    .image(imageName)
    .namespace(serviceName)
    .serviceAccount(serviceWorkerName)
    .codeOwner(CodeOwners.DigitalIceland)
    .command('node')
    .args('--no-experimental-fetch', 'main.cjs', '--job=worker')
    .env({
      SITEMAP_BASE_URL: {
        dev: 'https://beta.dev01.devland.is',
        staging: 'https://beta.staging01.devland.is',
        prod: 'https://island.is',
      },
      S3_BUCKET: {
        dev: 'island-is-sitemaps-dev',
        staging: 'island-is-sitemaps-staging',
        prod: 'island-is-sitemaps-prod',
      },
      SITEMAP_UPDATE_INTERVAL_MINUTES: {
        dev: '30',
        staging: '60',
        prod: '60',
      },
      CONTENTFUL_HOST: {
        dev: 'preview.contentful.com',
        staging: 'cdn.contentful.com',
        prod: 'cdn.contentful.com',
      },
    })
    .secrets({
      CONTENTFUL_ACCESS_TOKEN: `/k8s/${serviceName}/CONTENTFUL_ACCESS_TOKEN`,
    })
    .extraAttributes({
      dev: { schedule: '*/30 * * * *' }, // Every 30 minutes
      staging: { schedule: '0 * * * *' }, // Every hour
      prod: { schedule: '0 * * * *' }, // Every hour
    })
    .resources({
      limits: {
        cpu: '200m',
        memory: '256Mi',
      },
      requests: {
        cpu: '100m',
        memory: '128Mi',
      },
    })
