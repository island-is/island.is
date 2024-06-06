import { defineConfig } from '@island.is/nest/config'
import { XRoadMemberClass } from '@island.is/shared/utils/server'
import * as z from 'zod'

const schema = z.object({
  apiKey: z.string(),
  vmstMemberCode: z.string(),
  vmstMemberClass: z.nativeEnum(XRoadMemberClass),
  vmstApiPath: z.string(),
  xroadBasePathWithEnv: z.string(),
})

const XROAD_VMST_MEMBER_CLASS = XRoadMemberClass.GovernmentInstitution

export const VmstClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'VmstClient',
  schema,
  load(env) {
    return {
      apiKey: env.required('XROAD_VMST_API_KEY', ''),
      vmstMemberCode: env.required('XROAD_VMST_MEMBER_CODE', ''),
      vmstMemberClass: XROAD_VMST_MEMBER_CLASS,
      vmstApiPath: env.required('XROAD_VMST_API_PATH', ''),
      xroadBasePathWithEnv: env.required('XROAD_BASE_PATH_WITH_ENV', ''),
    }
  },
})
