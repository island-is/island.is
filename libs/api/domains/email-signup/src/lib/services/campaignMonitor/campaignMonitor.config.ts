import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  vinnueftirlitirdCampaignMonitorApiKey: z.string(),
})

export const CampaignMonitorSignupConfig = defineConfig({
  name: 'CampaignMonitorSignup',
  schema,
  load(env) {
    return {
      vinnueftirlitirdCampaignMonitorApiKey: env.required(
        'VINNUEFTIRLITID_CAMPAIGN_MONITOR_API_KEY',
      ),
    }
  },
})
