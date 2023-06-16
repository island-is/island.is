import { z } from 'zod'
import { zfd } from 'zod-form-data'

import { AuthAdminEnvironment } from '@island.is/api/schema'

export const defaultEnvironmentSchema = z.object({
  environment: z.nativeEnum(AuthAdminEnvironment),
  syncEnvironments: zfd.repeatable(
    z.optional(z.array(z.nativeEnum(AuthAdminEnvironment))),
  ),
})
