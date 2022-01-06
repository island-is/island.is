import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

export default defineConfig({
  name: 'UserNotification',
  schema: z.object({
    mainQueueName: z.string(),
    deadLetterQueueName: z.string(),
    sqsConfig: z.object({
      endpoint: z.string().optional(),
      region: z.string().optional(),
      credentials: z
        .object({
          accessKeyId: z.string(),
          secretAccessKey: z.string(),
        })
        .optional(),
    }),
  }),
  load: (env) => {
    const accessKeyId = env.optional('SQS_ACCESS_KEY', 'testing')
    const secretAccessKey = env.optional('SQS_SECRET_ACCESS_KEY', 'testing')

    return {
      mainQueueName: env.required('MAIN_QUEUE_NAME', 'notifications'),
      deadLetterQueueName: env.required(
        'DEAD_LETTER_QUEUE_NAME',
        'notifications-failure',
      ),

      sqsConfig: {
        region: env.optional('SQS_REGION', 'eu-west-1'),
        endpoint: env.optional('SQS_ENDPOINT'),
        ...(accessKeyId &&
          secretAccessKey && {
            credentials: {
              accessKeyId,
              secretAccessKey,
            },
          }),
      },
    }
  },
})
