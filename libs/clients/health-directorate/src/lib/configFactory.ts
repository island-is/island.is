import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'
import { HealthDirectorateApisId } from './healthDirectorateClient.types'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
})

export const ClientConfigFactory = (
  apiIndex: keyof typeof HealthDirectorateApisId,
  scope: Array<string>,
  XRoadPath: string,
  backupXRoad?: string,
) =>
  defineConfig<z.infer<typeof schema>>({
    name: `${HealthDirectorateApisId[apiIndex]}ClientConfig`,
    schema,
    load: (env) => ({
      xroadPath: env.required(`XROAD_${XRoadPath}_PATH`, backupXRoad),
      scope,
    }),
  })
