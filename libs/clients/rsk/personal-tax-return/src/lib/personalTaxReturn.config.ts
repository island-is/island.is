import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  agentNationalId: z.string(),
  agentId: z.string(),
  url: z.string(),
})

export const PersonalTaxReturnConfig = defineConfig({
  name: 'PersonalTaxReturnConfig',
  schema,
  load(env) {
    return {
      agentNationalId: env.required(
        'PERSONAL_TAX_RETURN_AGENT_NATIONAL_ID',
        '',
      ),
      agentId: env.required('PERSONAL_TAX_RETURN_AGENT_ID', ''),
      url: env.required(
        'PERSONAL_TAX_RETURN_URL',
        'https://vefurp.rsk.is/ws/Ums/USStadgreidslaFramtalGogn.svc',
      ),
    }
  },
})
