const TOKEN_PREFIX = 'IslandIsMessageQueue'

export const getQueueServiceToken = (name: string): string =>
  `${TOKEN_PREFIX}/QueueService/${name}`

export const getWorkerServiceToken = (name: string): string =>
  `${TOKEN_PREFIX}/WorkerService/${name}`

export const getClientServiceToken = (name: string): string =>
  `${TOKEN_PREFIX}/ClientService/${name}`

export const clamp = (v: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, v))
