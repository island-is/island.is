import * as z from 'zod'

export const LoginServiceSchema = z.object({
  field: z.string(),
})

export type LoginService = z.TypeOf<typeof LoginServiceSchema>
