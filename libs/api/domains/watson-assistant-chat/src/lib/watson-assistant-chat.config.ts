import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  directorateOfImmigrationPublicRSAKey: z.string(),
  directorateOfImmigrationPrivateRSAKey: z.string(),
  directorateOfImmigrationPublicIBMKey: z.string(),
  chatFeedbackUrl: z.string(),
})

export const WatsonAssistantChatConfig = defineConfig({
  name: 'WatsonAssistantChat',
  schema,
  load(env) {
    return {
      directorateOfImmigrationPublicRSAKey: env.required(
        'DIRECTORATE_OF_IMMIGRATION_WATSON_ASSISTANT_CHAT_PUBLIC_RSA_KEY',
      ),
      directorateOfImmigrationPrivateRSAKey: env.required(
        'DIRECTORATE_OF_IMMIGRATION_WATSON_ASSISTANT_CHAT_PRIVATE_RSA_KEY',
      ),
      directorateOfImmigrationPublicIBMKey: env.required(
        'DIRECTORATE_OF_IMMIGRATION_WATSON_ASSISTANT_CHAT_PUBLIC_IBM_KEY',
      ),
      chatFeedbackUrl: env.required('WATSON_ASSISTANT_CHAT_FEEDBACK_URL'),
    }
  },
})
