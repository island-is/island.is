import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  workerMaxFailureEventsPerFlow: z.number().int().positive(),
  workerMinutesToWaitBeforeCreatingFjsCharge: z.number().int().positive(),
})

export type WorkerModuleConfigType = z.infer<typeof schema>

export const WorkerModuleConfig = defineConfig({
  name: 'WorkerModuleConfig',
  schema,
  load: (env) => ({
    workerMaxFailureEventsPerFlow:
      env.optionalJSON('PAYMENTS_WORKER_MAX_FAILURE_EVENTS_PER_FLOW') ?? 5,
    workerMinutesToWaitBeforeCreatingFjsCharge:
      env.optionalJSON(
        'PAYMENTS_WORKER_MINUTES_TO_WAIT_BEFORE_CREATING_FJS_CHARGE',
      ) ?? 5,
  }),
})
