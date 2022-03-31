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
        '5502694739',
      ),
      agentId: env.required('PERSONAL_TAX_RETURN_AGENT_ID', 'Tna#678#Gwq201'),
      url: env.required(
        'PERSONAL_TAX_RETURN_URL',
        'https://vefurp.rsk.is/ws/securep/UMS/WS/USStadgreidslaFramtalGogn.svc',
      ),
    }
  },
})
