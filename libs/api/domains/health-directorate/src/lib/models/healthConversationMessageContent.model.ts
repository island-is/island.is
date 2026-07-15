import { createUnionType } from '@nestjs/graphql'
import { HealthDirectorateHealthConversationSegmentedContent } from './healthConversationSegmentedContent.model'
import { HealthDirectorateHealthConversationTextContent } from './healthConversationTextContent.model'
import { HealthDirectorateHealthConversationVideoContent } from './healthConversationVideoContent.model'

export const HealthDirectorateHealthConversationMessageContent =
  createUnionType({
    name: 'HealthDirectorateHealthConversationMessageContent',
    types: () =>
      [
        HealthDirectorateHealthConversationTextContent,
        HealthDirectorateHealthConversationSegmentedContent,
        HealthDirectorateHealthConversationVideoContent,
      ] as const,

    resolveType: (value) => value.typename ?? null,
  })
