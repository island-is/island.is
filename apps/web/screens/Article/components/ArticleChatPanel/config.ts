import { Locale } from '@island.is/shared/types'
import { ZendeskChatPanelProps } from '@island.is/web/components'

export const defaultZendeskConfig: Record<Locale, ZendeskChatPanelProps> = {
  is: {
    snippetUrl:
      'https://static.zdassets.com/ekr/snippet.js?key=981362b3-9805-4375-b7cf-eafa3ac78ff5',
    chatBubbleVariant: 'default',
  },
  en: {
    snippetUrl:
      'https://static.zdassets.com/ekr/snippet.js?key=981362b3-9805-4375-b7cf-eafa3ac78ff5',
    chatBubbleVariant: 'default',
  },
}
