import { z } from 'zod'

export const authSchema = z.strictObject({
  issuer: z.string(),
  clientId: z.string(),
  audience: z.string().array(),
  scopes: z.string().array(),
  allowedRedirectUris: z.string().array(),
  secret: z.string(),
  callbacksRedirectUris: z.strictObject({
    login: z.string(),
    logout: z.string(),
  }),
})

export const environmentSchema = z.strictObject({
  production: z.boolean(),
  port: z.number(),
  /**
   * The global prefix for the API
   */
  globalPrefix: z.string(),
  /**
   * Audit configuration
   */
  audit: z.strictObject({
    defaultNamespace: z.string(),
    groupName: z.string(),
    serviceName: z.string(),
  }),
  /**
   * Identity server configuration
   */
  auth: authSchema,
  /**
   * Enable CORS configuration
   */
  enableCors: z
    .object({
      origin: z.string().array(),
      methods: z.enum(['GET', 'POST']).array(),
      credentials: z.boolean().optional(),
    })
    .optional(),
})

export type BffEnvironmentSchema = z.infer<typeof environmentSchema>
