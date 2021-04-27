import * as z from 'zod'

export const LoginServiceSchema = z.object({
  termsOfAgreement: z.boolean().refine((v) => v, {}),
})

export type LoginService = z.TypeOf<typeof LoginServiceSchema>
