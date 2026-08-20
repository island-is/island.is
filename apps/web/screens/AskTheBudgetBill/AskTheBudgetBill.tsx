import { useCallback, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { CustomPageUniqueIdentifier } from '@island.is/shared/types'
import { CustomPageUniqueIdentifier as GraphQLCustomPageUniqueIdentifier } from '@island.is/web/graphql/schema'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { withMainLayout } from '@island.is/web/layouts/main'

import type { ZendeskConversation } from '../../components/ChatPanel/ZendeskChatPanel/types'
import {
  type CustomScreen,
  withCustomPageWrapper,
} from '../CustomPage/CustomPageWrapper'
import { ChatConversation } from './components/ChatConversation'
import { ChatLauncher } from './components/ChatLauncher'
import {
  getConversationTitle,
  toConversationTitle,
} from './components/conversations'
import { useZendeskMessenger } from './components/useZendeskMessenger'
import { m } from './translations.strings'
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
  const { formatMessage } = useIntl()
  const router = useRouter()

  useContentfulId(customPageData?.id)

  const snippetUrl =
    (customPageData?.configJson?.zendeskSnippetUrl as string | undefined) ||
    DEFAULT_ZENDESK_SNIPPET_URL

  const { status, fetchConversations, startConversation, openConversation } =
    useZendeskMessenger({ snippetUrl, containerId: CONTAINER_ID })

  const [conversations, setConversations] = useState<ZendeskConversation[]>([])
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [isStarting, setIsStarting] = useState(false)
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

  const refreshConversations = useCallback(async () => {
    try {
      setConversations(await fetchConversations())
    } catch (error) {
      // Accounts that are not in multi conversation mode reject this call. The
      // chat itself still works, there is just no history to list.
      console.error(error)
      setConversations([])
    } finally {
      setIsLoadingConversations(false)
    }
  }, [fetchConversations])

  useEffect(() => {
    if (status !== 'ready') return
    void refreshConversations()
  }, [status, refreshConversations])

  useEffect(() => {
    if (status === 'error') setIsLoadingConversations(false)
  }, [status])

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

  const handleAsk = async (question: string) => {
    setIsStarting(true)
    try {
      const conversationId = await startConversation(question)
      setIsFallbackOpen(false)

      // Listed right away so the chat has a title before the widget has caught
      // up, the refresh below then replaces it with what Zendesk reports.
      setConversations((previous) => [
        {
          id: conversationId,
          displayName: toConversationTitle(question),
          lastUpdatedAt: Math.round(Date.now() / 1000),
        },
        ...previous.filter((conversation) => conversation.id !== conversationId),
      ])

      showConversation(conversationId)
      void refreshConversations()
    } catch (error) {
      console.error(error)
      setIsFallbackOpen(true)
    } finally {
      setIsStarting(false)
    }
  }

  const goToLauncher = useCallback(() => {
    setIsFallbackOpen(false)
    void router.push({ pathname: PATHNAME }, undefined, { shallow: true })
    void refreshConversations()
  }, [router, refreshConversations])

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  )

  const conversationTitle = activeConversation
    ? getConversationTitle(activeConversation, formatMessage(m.untitledChat))
    : formatMessage(m.untitledChat)

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
          title={conversationTitle}
          status={status}
          onBack={goToLauncher}
          onNewChat={goToLauncher}
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
            conversations={conversations}
            isLoadingConversations={isLoadingConversations}
            isStarting={isStarting}
            status={status}
            onAsk={handleAsk}
            onSelectConversation={showConversation}
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
