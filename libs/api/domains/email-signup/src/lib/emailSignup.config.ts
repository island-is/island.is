import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  fiskistofaZenterEmail: z.string(),
  fiskistofaZenterPassword: z.string(),
  fiskistofaZenterClientId: z.string(),
  fiskistofaZenterClientPassword: z.string(),
  vinnueftirlitidCampaignMonitorApiKey: z.string(),
})

export const EmailSignupConfig = defineConfig({
  name: 'EmailSignup',
  schema,
  load(env) {
    return {
      fiskistofaZenterEmail: env.required('FISKISTOFA_ZENTER_EMAIL'),
      fiskistofaZenterPassword: env.required('FISKISTOFA_ZENTER_PASSWORD'),
      fiskistofaZenterClientId: env.required('FISKISTOFA_ZENTER_CLIENT_ID'),
      fiskistofaZenterClientPassword: env.required(
        'FISKISTOFA_ZENTER_CLIENT_PASSWORD',
      ),
      vinnueftirlitidCampaignMonitorApiKey: env.required(
        'VINNUEFTIRLITID_CAMPAIGN_MONITOR_API_KEY',
      ),
    }
  },
})
