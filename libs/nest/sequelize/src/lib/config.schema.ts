import { z } from 'zod'

const baseConfigSchema = z.object({
  username: z.string(),
  password: z.string(),
  database: z.string(),
  host: z.string(),
  dialect: z.literal('postgres'),
  port: z.number().optional(),
})

type BaseConfig = z.infer<typeof baseConfigSchema>

type ReplicationConfig = {
  write: BaseConfig
  read: BaseConfig[]
}

type FullConfig = BaseConfig & {
  replication?: ReplicationConfig
}

type ConfigObject = {
  [env: string]: FullConfig
}

const environments = ['development', 'test', 'production'] as const
const dbEnvSchema = z.enum(environments).superRefine((value, ctx) => {
  if (!environments.includes(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid environment '${value}'. Must be one of ${environments.join(
        ',',
      )}.`,
    })
  }
})
export { dbEnvSchema, FullConfig, ConfigObject }
