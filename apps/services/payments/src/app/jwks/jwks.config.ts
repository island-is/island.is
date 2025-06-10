import { z } from 'zod'
import { defineConfig } from '@island.is/nest/config'

const decodeBase64Key = (base64Key: string | undefined): string | undefined => {
  if (!base64Key) return undefined
  return Buffer.from(base64Key, 'base64').toString('utf-8')
}

const schema = z.object({
  issuer: z.string(),
  keyId: z.string(),
  privateKey: z.string(),
  publicKey: z.string(),
  expiresInMinutes: z.number().int(),
  previousPublicKeyId: z.string().optional(),
  previousPublicKey: z.string().optional(),
})

export type JwksConfigType = z.infer<typeof schema>

export const JwksConfig = defineConfig({
  name: 'JwksConfig',
  schema,
  load: (env) => ({
    issuer: env.required('PAYMENTS_WEB_URL'),
    keyId: env.required('PAYMENTS_JWT_SIGNING_KEY_ID'),
    privateKey: decodeBase64Key(
      env.required('PAYMENTS_JWT_SIGNING_PRIVATE_KEY'),
    ) as string,
    publicKey: decodeBase64Key(
      env.required('PAYMENTS_JWT_SIGNING_PUBLIC_KEY'),
    ) as string,
    expiresInMinutes:
      env.optionalJSON('PAYMENTS_JWT_SIGNING_EXPIRES_IN_MINUTES') ?? 5,
    previousPublicKeyId: env.optional('PAYMENTS_PREVIOUS_KEY_ID'),
    previousPublicKey: decodeBase64Key(
      env.optional('PAYMENTS_PREVIOUS_PUBLIC_KEY'),
    ),
  }),
})
