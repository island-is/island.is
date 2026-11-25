import React from 'react'
import { TextStyle } from 'react-native'

import { useBrowser } from '@/hooks/use-browser'
import { navigateToUniversalLink } from '@/lib/deep-linking'
import { useEnvironmentStore } from '@/stores/environment-store'
import { variants } from '@/ui'
import { Markdown } from '@/ui/lib/markdown/markdown'

const FALLBACK_BASE_URL = 'https://island.is'

/**
 * Guidance attached to the selected message type, shown between the service
 * picker and the message field. The copy comes from island.is translations and
 * may contain markdown links. Links that map to a native screen open there;
 * the rest fall back to the in-app browser.
 */
export const ServiceInstructions = ({ text }: { text: string }) => {
  const { openBrowser } = useBrowser()
  const baseUrl = useEnvironmentStore(
    (state) => state.environment?.baseUrl ?? FALLBACK_BASE_URL,
  )

  return (
    <Markdown
      fontSize={variants.eyebrow.fontSize}
      lineHeight={variants.eyebrow.lineHeight}
      // `variants` is an untyped literal, so its values widen to string.
      fontWeight={variants.eyebrow.fontWeight as TextStyle['fontWeight']}
      paragraphSpacing={false}
      onPressLink={(url) =>
        navigateToUniversalLink({
          // Instruction links are site-relative; the browser fallback needs an
          // absolute URL (native route matching handles either).
          link: url.startsWith('/') ? `${baseUrl}${url}` : url,
          openBrowser,
        })
      }
    >
      {text}
    </Markdown>
  )
}
