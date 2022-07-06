import { Inject } from '@nestjs/common'
import { getQueueServiceToken, getWorkerServiceToken } from './utils'

export const InjectQueue = (name: string): ParameterDecorator =>
  Inject(getQueueServiceToken(name))

export const InjectWorker = (name: string): ParameterDecorator =>
  Inject(getWorkerServiceToken(name))
