import { logger } from '@island.is/logging'

import { metrics } from './metrics'

metrics().catch((error) => {
  logger.error(
    'Metrics job failed; check collector configuration and database availability',
    { error },
  )
  process.exitCode = 1
})
