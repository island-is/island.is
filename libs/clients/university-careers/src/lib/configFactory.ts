import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'
import { UniversityId } from './universityCareers.types'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
})

export const clientConfigFactory = (
  universityId: UniversityId,
  scope: Array<string>,
  backupXRoad?: string,
) =>
  defineConfig<z.infer<typeof schema>>({
    name: `${universityId}CareerClientConfig`,
    schema,
    load: (env) => ({
      xroadPath: env.required(`XROAD_${universityId}_PATH`, backupXRoad),
      scope,
    }),
  })
