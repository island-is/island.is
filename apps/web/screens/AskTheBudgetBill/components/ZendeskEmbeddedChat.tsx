import { useEffect, useState } from 'react'

import { Box, LoadingDots } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'

import * as styles from '../AskTheBudgetBill.css'

/* Documentation: https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/web/embedded-mode/ */

/**
 * Renders the Zendesk messaging Web Widget inline instead of as the floating
 * launcher that ZendeskChatPanel uses. Zendesk does not support both modes on
 * the same page, so this must not be mounted alongside a ZendeskChatPanel.
 */

const SCRIPT_ID = 'ze-snippet'
const CONTAINER_ID = 'zendesk-embedded-chat-container'

declare global {
  interface Window {
    /**
     * Read by the Zendesk snippet while it boots. Setting `autorender` to false
     * stops it from mounting the floating launcher, so that we can render the
     * widget into our own container instead.
     */
    zEMessenger?: { autorender?: boolean }
  }
}

interface ZendeskEmbeddedChatProps {
  snippetUrl: string
  className?: string
  onError?: () => void
}

export const ZendeskEmbeddedChat = ({
  snippetUrl,
  className,
  onError,
}: ZendeskEmbeddedChatProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const { activeLocale } = useI18n()

  useEffect(() => {
    // Zendesk requires the container to be in the DOM before 'render' is
    // called, which is guaranteed here since effects run after the first paint.
    window.zEMessenger = { ...window.zEMessenger, autorender: false }

    document.getElementById(SCRIPT_ID)?.remove()

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = snippetUrl
    script.async = true

    script.onload = () => {
      window.zE?.(
        'messenger:set',
        'locale',
        activeLocale === 'en' ? 'en-US' : 'is-IS',
      )

      window.zE?.(
        'messenger',
        'render',
        {
          mode: 'embedded',
          widget: { targetElement: `#${CONTAINER_ID}` },
        },
        (error) => {
          setIsLoading(false)
          if (error) {
            console.error(error)
            onError?.()
          }
        },
      )
    }

    script.onerror = (error) => {
      console.error(error)
      setIsLoading(false)
      onError?.()
    }

    document.body.appendChild(script)

    return () => {
      window.zE?.('messenger', 'hide')
      document.getElementById(SCRIPT_ID)?.remove()
      delete window.zEACLoaded
      delete window.zE
      delete window.zEmbed
      delete window.$zopim
      delete window.zEMessenger
    }
    // Re-running this on a locale change would tear down an in-progress
    // conversation, so the widget keeps the locale it was mounted with.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippetUrl])

  return (
    <Box className={className} position="relative">
      {isLoading && (
        <Box className={styles.chatLoadingOverlay}>
          <LoadingDots size="large" />
        </Box>
      )}
      <Box id={CONTAINER_ID} width="full" height="full" />
    </Box>
  )
}
