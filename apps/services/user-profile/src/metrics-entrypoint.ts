import { logger } from '@island.is/logging'

import { metrics } from './metrics'

metrics()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    logger.error(
      'Metrics job failed; check collector configuration and database availability',
      { error },
    )
    process.exit(1)
  })
