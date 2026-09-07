import { useCallback, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Box } from '@island.is/island-ui/core'
import { CustomPageUniqueIdentifier } from '@island.is/shared/types'
import { CustomPageUniqueIdentifier as GraphQLCustomPageUniqueIdentifier } from '@island.is/web/graphql/schema'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  type CustomScreen,
  withCustomPageWrapper,
} from '../CustomPage/CustomPageWrapper'
import { ChatConversation } from './components/ChatConversation'
import { ChatLauncher } from './components/ChatLauncher'
import { useZendeskMessenger } from './components/useZendeskMessenger'
import * as styles from './AskTheBudgetBill.css'

/**
 * The key in the url is the public client side identifier of the widget, the
 * same one the other chat panels on the site carry, and is not a secret.
 */
const ZENDESK_SNIPPET_URL =
  'https://static.zdassets.com/ekr/snippet.js?key=23812e00-4869-4552-85cd-ccdd7cd9d958'

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

  const { status, load, startConversation, openConversation } =
    useZendeskMessenger({
      snippetUrl: ZENDESK_SNIPPET_URL,
      containerId: CONTAINER_ID,
    })

  // The question that has been asked but has no conversation yet, either
  // because the widget is still booting or because it is being created. The
  // chat is shown the moment it is set, so the waiting happens in there.
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null)
  // Accounts that are not in multi conversation mode cannot be told which
  // conversation to show, so the widget is opened on whatever it defaults to.
  const [isFallbackOpen, setIsFallbackOpen] = useState(false)

  const activeConversationId =
    typeof router.query[CONVERSATION_QUERY_KEY] === 'string'
      ? (router.query[CONVERSATION_QUERY_KEY] as string)
      : undefined

  const shellRef = useRef<HTMLElement>(null)
  const [shellHeight, setShellHeight] = useState<number | null>(null)

  // The shell fills what is left of the viewport between the site header and
  // the footer, both of which move when an alert banner is shown or the mobile
  // browser chrome collapses. The footer is rendered by the layout, outside of
  // this tree, so it is measured off the document.
  useEffect(() => {
    const measure = () => {
      const top = shellRef.current?.getBoundingClientRect().top
      if (typeof top !== 'number') return
      const footerHeight =
        document.querySelector('footer')?.getBoundingClientRect().height ?? 0
      setShellHeight(
        Math.max(0, Math.round(window.innerHeight - top - footerHeight)),
      )
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

  // A conversation opened from a shared or reloaded url is the one case where
  // the widget is needed without the visitor asking anything first, and it can
  // only be handed the conversation once it has booted.
  useEffect(() => {
    if (!activeConversationId) return
    load()
  }, [activeConversationId, load])

  useEffect(() => {
    if (!activeConversationId || status !== 'ready') return
    openConversation(activeConversationId)
  }, [status, activeConversationId, openConversation])

  const handleAsk = useCallback(
    (question: string) => {
      // Swapping to the chat first, so the visitor is not left looking at the
      // question box while the widget boots. Both the boot and the conversation
      // being created are waited out behind the chat's own loading state.
      setPendingQuestion(question)
      load()
    },
    [load],
  )

  // The question the widget has already been handed, so that a re-render does
  // not start a second conversation for it.
  const sentQuestionRef = useRef<string | null>(null)

  useEffect(() => {
    if (pendingQuestion === null || status !== 'ready') return
    if (sentQuestionRef.current === pendingQuestion) return
    sentQuestionRef.current = pendingQuestion

    startConversation(pendingQuestion)
      .then((conversationId) => {
        setPendingQuestion(null)
        showConversation(conversationId)
      })
      .catch((error) => {
        console.error(error)
        // The widget is up, so the visitor is left with it on whatever
        // conversation it defaults to rather than with nothing at all.
        setPendingQuestion(null)
        setIsFallbackOpen(true)
      })
  }, [status, pendingQuestion, startConversation, showConversation])

  /** Leaves the open conversation behind and returns to an empty question box */
  const startNewChat = useCallback(() => {
    setPendingQuestion(null)
    sentQuestionRef.current = null
    setIsFallbackOpen(false)
    void router.push({ pathname: PATHNAME }, undefined, { shallow: true })
  }, [router])

  const isChatOpen =
    Boolean(activeConversationId) || isFallbackOpen || pendingQuestion !== null

  return (
    <Box
      ref={shellRef}
      className={styles.shell}
      style={shellHeight === null ? undefined : { height: `${shellHeight}px` }}
    >
      {Boolean(customPageData?.configJson?.noIndex) && (
        <Head>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
      )}

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
          status={status}
          isStarting={pendingQuestion !== null}
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
            isVisible={!isChatOpen}
            status={status}
            onAsk={handleAsk}
          />
        </Box>
      </Box>
    </Box>
  )
}

AskTheBudgetBill.getProps = async ({ customPageData }) => {
  // The page is live unless it is explicitly turned off, so that a missing
  // field in the CMS can not take it down
  if (customPageData?.configJson?.showPage === false) {
    throw new CustomNextError(
      404,
      'Ask the budget bill page has been turned off in the CMS',
    )
  }

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
  // The chat fills the viewport, so the page must not scroll past it. The small
  // island.is footer the organization pages carry still sits underneath it.
  { footerVersion: 'organization', wrapContent: false },
)
