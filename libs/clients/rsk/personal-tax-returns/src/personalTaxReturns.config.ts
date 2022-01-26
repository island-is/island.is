import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  agentNationalId: z.string(),
  agentId: z.string(),
  url: z.string(),
})

export const PersonalTaxReturnsConfig = defineConfig({
  name: 'PersonalTaxReturnsConfig',
  schema,
  load(env) {
    return {
      agentNationalId: env.required(
        'PERSONAL_TAX_RETURNS_AGENT_NATIONAL_ID',
        '',
      ),
      agentId: env.required('PERSONAL_TAX_RETURNS_AGENT_ID', ''),
      url: env.required(
        'PERSONAL_TAX_RETURNS_URL',
        'https://vefurp.rsk.is/ws/securep/UMS/WS/USStadgreidslaFramtalGogn.svc?singleWsdl',
      ),
    }
  },
})
