import { useCallback, useEffect, useRef, useState } from 'react'

import { useI18n } from '@island.is/web/i18n'

import type {
  MessengerError,
  NewConversationResponse,
} from '../../../components/ChatPanel/ZendeskChatPanel/types'
import { toConversationTitle } from './conversations'

/* Documentation: https://developer.zendesk.com/api-reference/widget-messaging/web/core/ */

const SCRIPT_ID = 'ze-snippet'
/**
 * The widget queues commands until it has booted and never calls back if it
 * never does, which happens when messaging is not enabled for the widget key.
 * Without a deadline the page would sit in its loading state forever.
 */
const BOOT_TIMEOUT_MS = 20000
const COMMAND_TIMEOUT_MS = 10000

export type MessengerStatus = 'idle' | 'loading' | 'ready' | 'error'

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

/**
 * Boots the Zendesk messaging widget in embedded mode with its own header
 * hidden, and exposes the commands the surrounding page needs to act as the
 * launcher: starting a conversation and opening one.
 *
 * Nothing is loaded until `load` is called, so a visitor who only reads the
 * page never pays for the third party script. Calling it more than once is a
 * no-op, since the widget is booted only on the first call.
 *
 * The widget is rendered once into `containerId`, which must therefore stay
 * mounted for the lifetime of the page. Showing and hiding it is done by the
 * caller, since a second `render` call tears down the conversation in progress.
 *
 * Zendesk does not support the embedded and floating modes on the same page, so
 * this must not be mounted alongside a ZendeskChatPanel.
 */
export const useZendeskMessenger = ({
  snippetUrl,
  containerId,
}: {
  snippetUrl: string
  containerId: string
}) => {
  const [status, setStatus] = useState<MessengerStatus>('idle')
  const [shouldLoad, setShouldLoad] = useState(false)
  const { activeLocale } = useI18n()

  // The locale is read while booting, but re-running the effect on a locale
  // change would tear down an in-progress conversation.
  const localeRef = useRef(activeLocale)
  localeRef.current = activeLocale

  /** Boots the widget, on the first call only */
  const load = useCallback(() => setShouldLoad(true), [])

  useEffect(() => {
    if (!shouldLoad) return

    setStatus('loading')

    let hasSettled = false
    const settle = (next: MessengerStatus) => {
      if (hasSettled) return
      hasSettled = true
      setStatus(next)
    }

    const bootTimeout = window.setTimeout(() => {
      if (!hasSettled) console.error('Zendesk messenger did not finish booting')
      settle('error')
    }, BOOT_TIMEOUT_MS)

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
        localeRef.current === 'en' ? 'en-US' : 'is-IS',
      )

      // The widget header lives inside a cross origin iframe and cannot be
      // styled from here, so it is hidden and this page supplies its own.
      window.zE?.('messenger:set', 'customization', {
        common: { hideHeader: true },
        conversationList: { hideHeader: true },
        messageLog: { hideHeader: true },
      })

      window.zE?.(
        'messenger',
        'render',
        {
          mode: 'embedded',
          widget: { targetElement: `#${containerId}` },
        },
        (error) => {
          if (error) {
            console.error(error)
            settle('error')
            return
          }
          settle('ready')
        },
      )
    }

    script.onerror = (error) => {
      console.error(error)
      settle('error')
    }

    document.body.appendChild(script)

    return () => {
      window.clearTimeout(bootTimeout)
      window.zE?.('messenger', 'hide')
      document.getElementById(SCRIPT_ID)?.remove()
      delete window.zEACLoaded
      delete window.zE
      delete window.zEmbed
      delete window.$zopim
      delete window.zEMessenger
    }
  }, [shouldLoad, snippetUrl, containerId])

  /** Starts a conversation whose first message is the visitor's question. */
  const startConversation = useCallback(
    (question: string) =>
      new Promise<string>((resolve, reject) => {
        if (!window.zE) {
          reject(new Error('Zendesk messenger is not loaded'))
          return
        }
        const timeout = window.setTimeout(
          () => reject(new Error('Creating a conversation timed out')),
          COMMAND_TIMEOUT_MS,
        )
        window.zE(
          'messenger',
          'newConversation',
          {
            // Names the conversation for the agents who pick it up
            displayName: toConversationTitle(question),
            message: { content: { type: 'text', text: question } },
          },
          (
            error: MessengerError | null,
            response?: NewConversationResponse,
          ) => {
            window.clearTimeout(timeout)
            const id = response?.id
            if (error || !id) {
              reject(
                error ?? new Error('Conversation was created without an id'),
              )
              return
            }
            resolve(id)
          },
        )
      }),
    [],
  )

  /** Moves the embedded widget onto one specific conversation. */
  const openConversation = useCallback((conversationId: string) => {
    window.zE?.('messenger:ui', 'navigation', {
      screen: 'Conversation',
      options: { conversationId },
    })
  }, [])

  return {
    status,
    load,
    startConversation,
    openConversation,
  }
}
