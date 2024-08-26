import { z } from 'zod'

export const environmentSchema = z.strictObject({
  production: z.boolean(),
  port: z.number(),
  audit: z.strictObject({
    defaultNamespace: z.string(),
    groupName: z.string(),
    serviceName: z.string(),
  }),
  auth: z.strictObject({
    issuer: z.string(),
    audience: z.string().array(),
    clientId: z.string(),
    scopes: z.string().array(),
  }),
})

export type BffEnvironmentSchema = z.infer<typeof environmentSchema>
