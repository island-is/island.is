import { z } from 'zod'

const KEY_PATH_ENV_VAR = 'BFF_CLIENT_KEY_PATH'

export const environmentSchema = z.strictObject({
  production: z.boolean().default(false),
  port: z.preprocess(
    (val) => (val ? parseInt(val as string, 10) : 3010),
    z
      .number({ required_error: 'PORT must be a valid number' })
      .min(1)
      .max(65535),
  ),
  /**
   * The global prefix for the API
   */
  keyPath: z
    .string({
      required_error: `${KEY_PATH_ENV_VAR} is required`,
    })
    .refine((val) => !val.endsWith('/bff'), {
      message: `${KEY_PATH_ENV_VAR} must not end with /bff`,
    }),
  name: z.string({ required_error: 'BFF_NAME is required' }),
})

export type BffEnvironment = z.infer<typeof environmentSchema>
