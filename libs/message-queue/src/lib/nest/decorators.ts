import { Inject } from '@nestjs/common'
import { getQueueProviderToken, getWorkerToken } from './utils'

export const useQueue = (name: string): ParameterDecorator =>
  Inject(getQueueProviderToken(name))

export const useWorker = (name: string): ParameterDecorator =>
  Inject(getWorkerToken(name))
