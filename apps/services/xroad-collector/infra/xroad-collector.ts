import { Base, Client } from '../../../../infra/src/dsl/xroad'
import { scheduledJob, ScheduledJobBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ScheduledJobBuilder<'xroad-collector'> =>
  scheduledJob('xroad-collector')
    .namespace('xroad-collector')
    .image('services-xroad-collector')
    .serviceAccount()
    .env({
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
      ELASTIC_NODE: {
        dev: 'https://vpc-search-njkekqydiegezhr4vqpkfnw5la.eu-west-1.es.amazonaws.com',
        staging:
          'https://vpc-search-q6hdtjcdlhkffyxvrnmzfwphuq.eu-west-1.es.amazonaws.com',
        prod: 'https://vpc-search-mw4w5c2m2g5edjrtvwbpzhkw24.eu-west-1.es.amazonaws.com',
      },
    })
    .xroad(Base, Client)
    .command('node')
    .args('main.cjs')
    .schedule({
      dev: '0 2 * * *',
      staging: '0 2 * * *',
      prod: '0 2 * * *',
    })
