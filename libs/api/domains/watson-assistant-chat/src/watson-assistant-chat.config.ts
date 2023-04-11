import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  directorateOfImmigrationPublicRSAKey: z.string(),
  directorateOfImmigrationPrivateRSAKey: z.string(),
})

export const WatsonAssistantChatConfig = defineConfig({
  name: 'WatsonAssistantChat',
  schema,
  load(env) {
    return {
      directorateOfImmigrationPublicRSAKey: env.required(
        'WATSON_ASSISTANT_CHAT_DIRECTORATE_OF_IMMIGRATION_PUBLIC_RSA_KEY',
      ),
      directorateOfImmigrationPrivateRSAKey: env.required(
        'WATSON_ASSISTANT_CHAT_DIRECTORATE_OF_IMMIGRATION_PRIVATE_RSA_KEY',
      ),
    }
  },
})
