import { TOKEN_PREFIX } from './constants'

const tokenGenerator = (type: string): ((name: string) => string) => (
  name: string,
): string => `${TOKEN_PREFIX}${type}${name}`

export const getQueueConfigToken = tokenGenerator('QueueConfig')
export const getQueueProviderToken = tokenGenerator('QueueService')
export const getWorkerToken = tokenGenerator('QueueWorker')
