import { logger } from '@island.is/logging'
import { setupE2EEnvironment } from '@island.is/testing/e2e'

const initializeLocalEnvironment = () => {
  logger.info('initializeLocalEnvironment is being called')
  try {
    setupE2EEnvironment({ app: 'consultation-portal' })
  } catch (error) {
    logger.error('Error while setting up environment: ', error)
    throw error
  }
}

export default initializeLocalEnvironment

// Add this line to invoke the function
initializeLocalEnvironment()
