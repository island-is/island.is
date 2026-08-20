import { useCallback, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { useRouter } from 'next/router'

import { Box } from '@island.is/island-ui/core'
import { CustomPageUniqueIdentifier } from '@island.is/shared/types'
import { CustomPageUniqueIdentifier as GraphQLCustomPageUniqueIdentifier } from '@island.is/web/graphql/schema'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { withMainLayout } from '@island.is/web/layouts/main'

import {
  type CustomScreen,
  withCustomPageWrapper,
} from '../CustomPage/CustomPageWrapper'
import { ChatConversation } from './components/ChatConversation'
import { ChatLauncher } from './components/ChatLauncher'
import {
  getStoredConversationTitle,
  storeConversationTitle,
  toConversationTitle,
} from './components/conversations'
import { useZendeskMessenger } from './components/useZendeskMessenger'
import * as styles from './AskTheBudgetBill.css'

/**
 * Overridable via the 'zendeskSnippetUrl' key in the custom page's configJson.
 * The key is a public client side widget identifier, not a secret.
 */
const DEFAULT_ZENDESK_SNIPPET_URL =
  'https://static.zdassets.com/ekr/snippet.js?key=981362b3-9805-4375-b7cf-eafa3ac78ff5'

const CONTAINER_ID = 'zendesk-embedded-chat-container'
const PATHNAME = '/spurdu-fjarlagafrumvarpid'
/** Query parameter holding the conversation the visitor currently has open */
const CONVERSATION_QUERY_KEY = 'spjall'

interface AskTheBudgetBillProps {
  languageToggleHrefOverride: {
    is: string
    en: string
  }
}

const AskTheBudgetBill: CustomScreen<AskTheBudgetBillProps> = ({
  customPageData,
}) => {
  const router = useRouter()

  useContentfulId(customPageData?.id)

  const snippetUrl =
    (customPageData?.configJson?.zendeskSnippetUrl as string | undefined) ||
    DEFAULT_ZENDESK_SNIPPET_URL

  const { status, startConversation, openConversation } = useZendeskMessenger({
    snippetUrl,
    containerId: CONTAINER_ID,
  })

  const [isStarting, setIsStarting] = useState(false)
  // The widget does not hand out the title of a conversation, so this holds
  // the question the open chat was started from.
  const [conversationTitle, setConversationTitle] = useState<string | null>(
    null,
  )
  // Accounts that are not in multi conversation mode cannot be told which
  // conversation to show, so the widget is opened on whatever it defaults to.
  const [isFallbackOpen, setIsFallbackOpen] = useState(false)

  const activeConversationId =
    typeof router.query[CONVERSATION_QUERY_KEY] === 'string'
      ? (router.query[CONVERSATION_QUERY_KEY] as string)
      : undefined

  const shellRef = useRef<HTMLElement>(null)
  const [shellHeight, setShellHeight] = useState<number | null>(null)

  // The shell fills what is left of the viewport below the site header, which
  // moves when an alert banner is shown or the mobile browser chrome collapses.
  useEffect(() => {
    const measure = () => {
      const top = shellRef.current?.getBoundingClientRect().top
      if (typeof top !== 'number') return
      setShellHeight(Math.max(0, Math.round(window.innerHeight - top)))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const showConversation = useCallback(
    (conversationId: string) => {
      openConversation(conversationId)
      void router.push(
        {
          pathname: PATHNAME,
          query: { [CONVERSATION_QUERY_KEY]: conversationId },
        },
        undefined,
        // Shallow, so that the page and with it the widget are not remounted
        { shallow: true },
      )
    },
    [openConversation, router],
  )

  // A conversation opened from a shared or reloaded url has to be handed to the
  // widget once it is ready, since the query is read before it has booted.
  useEffect(() => {
    if (status !== 'ready' || !activeConversationId) return
    openConversation(activeConversationId)
  }, [status, activeConversationId, openConversation])

  // The title survives a reload through storage rather than the url, so that
  // the visitor's question is not part of a link they might share.
  useEffect(() => {
    if (!activeConversationId) return
    setConversationTitle(
      (current) => current ?? getStoredConversationTitle(activeConversationId),
    )
  }, [activeConversationId])

  const handleAsk = async (question: string) => {
    setIsStarting(true)
    try {
      const conversationId = await startConversation(question)
      const title = toConversationTitle(question)
      setIsFallbackOpen(false)
      setConversationTitle(title)
      storeConversationTitle(conversationId, title)
      showConversation(conversationId)
    } catch (error) {
      console.error(error)
      setIsFallbackOpen(true)
    } finally {
      setIsStarting(false)
    }
  }

  /** Leaves the open conversation behind and returns to an empty question box */
  const startNewChat = useCallback(() => {
    setIsFallbackOpen(false)
    setConversationTitle(null)
    void router.push({ pathname: PATHNAME }, undefined, { shallow: true })
  }, [router])

  const isChatOpen = Boolean(activeConversationId) || isFallbackOpen

  return (
    <Box
      ref={shellRef}
      className={styles.shell}
      style={shellHeight === null ? undefined : { height: `${shellHeight}px` }}
    >
      <Box
        className={cn(
          styles.layer,
          isChatOpen
            ? styles.layerVisibility.visible
            : styles.layerVisibility.hidden,
        )}
        aria-hidden={!isChatOpen}
      >
        <ChatConversation
          question={conversationTitle ?? undefined}
          status={status}
          onNewChat={startNewChat}
        >
          {/* Rendered into by Zendesk once, and kept mounted from then on */}
          <Box id={CONTAINER_ID} width="full" height="full" />
        </ChatConversation>
      </Box>

      <Box
        className={cn(
          styles.layer,
          styles.launcherLayer,
          isChatOpen
            ? styles.layerVisibility.hidden
            : styles.layerVisibility.visible,
        )}
        aria-hidden={isChatOpen}
      >
        <Box className={styles.launcherInner}>
          <ChatLauncher
            isStarting={isStarting}
            status={status}
            onAsk={handleAsk}
          />
        </Box>
      </Box>
    </Box>
  )
}

AskTheBudgetBill.getProps = async ({ customPageData }) => {
  return {
    languageToggleHrefOverride: {
      is: PATHNAME,
      en: customPageData?.configJson?.englishFallbackUrl ?? '',
    },
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.AskTheBudgetBill as GraphQLCustomPageUniqueIdentifier,
    AskTheBudgetBill,
  ),
  // The chat fills the viewport, so the page must not scroll past it
  { showFooter: false, wrapContent: false },
)
