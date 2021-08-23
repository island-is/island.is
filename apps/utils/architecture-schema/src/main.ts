import { logger } from '@island.is/logging'
import { workspace } from './workspace'
import { pushWorkspace } from './pushWorkspace'

pushWorkspace(workspace).then(
  (response) => {
    logger.info(response)
  },
  (error) => {
    logger.error('Failed pushing workspace', error)
  },
)
