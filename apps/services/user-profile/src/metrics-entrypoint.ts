import { logger } from '@island.is/logging'

import { metrics } from './metrics'

metrics().catch(() => {
  logger.error(
    'Metrics job failed; check collector configuration and database availability',
  )
  process.exitCode = 1
})
