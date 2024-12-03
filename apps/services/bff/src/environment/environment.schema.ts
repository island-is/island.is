import { z } from 'zod'

export const environmentSchema = z.strictObject({
  production: z.boolean().default(false),
  name: z.string({ required_error: 'BFF_NAME is required' }),
  port: z.preprocess(
    (val) => (val ? parseInt(val as string, 10) : 3010),
    z
      .number({ required_error: 'PORT must be a valid number' })
      .min(1)
      .max(65535),
  ),
  /**
   * The global prefix path for the API
   * This is used to create the base path for the API
   */
  globalPrefix: z
    .string({
      required_error: 'BFF_GLOBAL_PREFIX is required',
    })
    .refine((val) => val.endsWith('/bff'), {
      message: 'BFF_GLOBAL_PREFIX must end with /bff',
    }),
})

export type BffEnvironment = z.infer<typeof environmentSchema>
