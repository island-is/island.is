import { useEffect, useMemo, useRef, useState } from 'react'
import cn from 'classnames'
import { useMutation, useQuery } from '@apollo/client'

import {
  Box,
  Button,
  Hidden,
  Icon,
  Inline,
  Input,
  Stack,
  Text,
  toast,
  ToastContainer,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import {
  Mutation,
  MutationWatsonAssistantChatSubmitFeedbackArgs,
  Query,
  QueryGetNamespaceArgs,
  WatsonAssistantChatSubmitFeedbackThumbStatus as ThumbStatus,
} from '@island.is/web/graphql/schema'
import { useNamespaceStrict } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { GET_NAMESPACE_QUERY } from '@island.is/web/screens/queries'
import { SUBMIT_WATSON_ASSISTANT_CHAT_FEEDBACK } from '@island.is/web/screens/queries/WatsonAssistantChat'

import { ChatBubble } from '../ChatBubble'
import { WatsonChatPanelProps } from '../types'
import type { WatsonInstance, WatsonInstanceEvent } from './types'
import * as styles from './WatsonChatPanel.css'

const chatLog: WatsonInstanceEvent[] = []

interface ChatFeedbackPanelProps {
  onClose: () => void
  submitText: string
  heading: string
  successText: string
  errorText: string
  inputPlaceholder?: string
  pushUp?: boolean
}

const ChatFeedbackPanel = ({
  onClose,
  submitText,
  heading,
  successText,
  errorText,
  inputPlaceholder = '',
  pushUp = false,
}: ChatFeedbackPanelProps) => {
  const { activeLocale } = useI18n()

  const [thumbStatus, setThumbStatus] = useState<ThumbStatus>(
    ThumbStatus.NoChoice,
  )
  const [feedbackText, setFeedbackText] = useState('')

  const updateThumbStatus = (newThumbStatus: ThumbStatus) => {
    setThumbStatus((previousThumbStatus) => {
      if (previousThumbStatus === newThumbStatus) {
        return ThumbStatus.NoChoice
      }
      return newThumbStatus
    })
  }

  const resetState = () => {
    setFeedbackText('')
    setThumbStatus(ThumbStatus.NoChoice)
  }

  const [submitFeedback, { loading }] = useMutation<
    Mutation,
    MutationWatsonAssistantChatSubmitFeedbackArgs
  >(SUBMIT_WATSON_ASSISTANT_CHAT_FEEDBACK, {
    onCompleted() {
      toast.success(successText)
      resetState()
      onClose()
    },
    onError() {
      toast.error(errorText)
      resetState()
      onClose()
    },
  })

  return (
    <Box
      className={cn(styles.feedbackPanelContainer, { [styles.pushUp]: pushUp })}
      borderRadius="large"
      padding="gutter"
      background="white"
    >
      <Stack space={2}>
        <Box display="flex" justifyContent="flexEnd">
          <Box
            onKeyDown={(ev) => {
              if (ev.key === 'Enter' || ev.key === ' ') {
                onClose()
                ev.preventDefault()
              }
            }}
            onClick={onClose}
            cursor="pointer"
            tabIndex={0}
            userSelect="none"
          >
            <VisuallyHidden>
              {activeLocale === 'is' ? 'Loka' : 'Close'}
            </VisuallyHidden>
            <Icon icon="close" />
          </Box>
        </Box>

        <Box display="flex" justifyContent="center">
          <Text fontWeight="regular">{heading}</Text>
        </Box>

        <Box display="flex" justifyContent="center">
          <Inline space={2} alignY="center">
            <Box
              tabIndex={0}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                  updateThumbStatus(ThumbStatus.Up)
                  ev.preventDefault()
                }
              }}
              onClick={() => {
                updateThumbStatus(ThumbStatus.Up)
              }}
              cursor="pointer"
              userSelect="none"
            >
              <VisuallyHidden>
                {activeLocale === 'is' ? 'Þumall upp' : 'Thumbs up'}
              </VisuallyHidden>
              <Icon
                color="blue400"
                icon="thumbsUp"
                type={thumbStatus === ThumbStatus.Up ? 'filled' : 'outline'}
              />
            </Box>
            <Box
              tabIndex={0}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                  updateThumbStatus(ThumbStatus.Down)
                  ev.preventDefault()
                }
              }}
              onClick={() => {
                updateThumbStatus(ThumbStatus.Down)
              }}
              cursor="pointer"
              userSelect="none"
            >
              <VisuallyHidden>
                {activeLocale === 'is' ? 'Þumall niður' : 'Thumbs down'}
              </VisuallyHidden>
              <Icon
                color="blue400"
                icon="thumbsDown"
                type={thumbStatus === ThumbStatus.Down ? 'filled' : 'outline'}
              />
            </Box>
          </Inline>
        </Box>

        <Input
          textarea
          rows={3}
          size="xs"
          name="webchat-feedback-input"
          value={feedbackText}
          placeholder={inputPlaceholder}
          onChange={(ev) => {
            setFeedbackText(ev.target.value)
          }}
        />

        <Box display="flex" justifyContent="flexEnd">
          <Button
            disabled={
              !(feedbackText.length > 0 || thumbStatus !== ThumbStatus.NoChoice)
            }
            size="small"
            loading={loading}
            onClick={() => {
              const chatLogCopy = [...chatLog]
              submitFeedback({
                variables: {
                  input: {
                    assistantChatLog: chatLogCopy,
                    thumbStatus,
                    feedback: feedbackText,
                    url: window.location.href,
                  },
                },
              })
              // Clear the chat log when submitting feedback
              chatLog.length = 0
            }}
          >
            {submitText}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

declare global {
  interface Window {
    watsonAssistantChatOptions: {
      showCloseAndRestartButton: boolean
      pageLinkConfig: {
        linkIDs: Record<string, Record<string, string>>
      }
      serviceDesk: {
        skipConnectAgentCard: boolean
      }
      onLoad: (instance: WatsonInstance) => void
    }
  }
}

const URL = 'https://web-chat.global.assistant.watson.appdomain.cloud'
const FILENAME = 'WatsonAssistantChatEntry.js'

const getScriptSource = (version: string) => {
  return `${URL}/versions/${version}/${FILENAME}`
}

const loadScript = (
  options: Window['watsonAssistantChatOptions'],
  version = '8.7.0',
) => {
  window.watsonAssistantChatOptions = options
  const scriptElement = document.createElement('script')
  scriptElement.src = getScriptSource(version)
  document.head.appendChild(scriptElement)
  return scriptElement
}

export const WatsonChatPanel = (props: WatsonChatPanelProps) => {
  const { activeLocale } = useI18n()
  const [loading, setLoading] = useState(false)
  const [shouldDisplayFeedbackPanel, setShouldDisplayFeedbackPanel] =
    useState(false)

  const {
    version = '8.7.0',
    showLauncher = true,
    namespaceKey,
    onLoad,
    pushUp = false,
  } = props

  const { data } = useQuery<Query, QueryGetNamespaceArgs>(GET_NAMESPACE_QUERY, {
    variables: {
      input: {
        lang: activeLocale,
        namespace: 'ChatPanels',
      },
    },
  })

  const namespace = useMemo(
    () => JSON.parse(data?.getNamespace?.fields || '{}'),
    [data?.getNamespace?.fields],
  )

  const n = useNamespaceStrict(namespace)

  const watsonInstance = useRef<WatsonInstance | null>(null)
  const [hasButtonBeenClicked, setHasButtonBeenClicked] = useState(false)

  const replaceDirectorateOfImmigrationWebChatWithAI = Boolean(
    namespace?.replaceDirectorateOfImmigrationWebChatWithAI,
  )

  useEffect(() => {
    if (Object.keys(namespace).length === 0) {
      return () => {
        watsonInstance?.current?.destroy()
      }
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    const namespaceValue = namespace?.[namespaceKey] ?? {}
    const { cssVariables, ...languagePack } = namespaceValue

    const propsCopy = { ...props }

    if (
      !replaceDirectorateOfImmigrationWebChatWithAI &&
      props.integrationID === '9e320784-ad44-4da9-9eb3-f305057a196a'
    ) {
      propsCopy.integrationID = '89a03e83-5c73-4642-b5ba-cd3771ceca54'
      propsCopy.serviceInstanceID = 'bc3d8312-d862-4750-b8bf-529db282050a'
    }

    let scriptElement: HTMLScriptElement | null = null

    const queryParam = new URLSearchParams(window.location.search).get('wa_lid')

    if (
      hasButtonBeenClicked ||
      showLauncher ||
      (queryParam && ['t10', 't11'].includes(queryParam))
    ) {
      setLoading(true)
      scriptElement = loadScript(
        {
          showCloseAndRestartButton: true,
          pageLinkConfig: {
            // If there is a query param of wa_lid=<linkID> then in the background a message will be sent and the chat will open
            linkIDs: {
              t10: {
                text: n('t10', 'Tala við manneskju'),
              },
              t11: {
                text: n('t11', 'Hæ Askur'),
              },
            },
          },
          serviceDesk: {
            skipConnectAgentCard: true,
            ...props.serviceDesk,
          },
          ...propsCopy,
          onLoad: (instance) => {
            watsonInstance.current = instance
            if (Object.keys(cssVariables).length > 0) {
              instance.updateCSSVariables(cssVariables)
            }
            if (Object.keys(languagePack).length > 0) {
              instance.updateLanguagePack(languagePack)
            }

            if (
              // Útlendingastofnun
              props.integrationID !== '89a03e83-5c73-4642-b5ba-cd3771ceca54' &&
              props.integrationID !== '9e320784-ad44-4da9-9eb3-f305057a196a'
            ) {
              // Keep the chat log in memory
              instance.on({
                type: 'receive',
                handler: (event) => {
                  chatLog.push(event)
                },
              })
              instance.on({
                type: 'send',
                handler: (event) => {
                  chatLog.push(event)
                },
              })

              instance.on({
                type: 'view:change',
                handler: (event) => {
                  const atLeastOneMessageReceived = chatLog.some(
                    (log) => log.type === 'receive',
                  )
                  const atLeastOneMessageSent = chatLog.some(
                    (log) => log.type === 'send',
                  )
                  if (
                    event.reason === 'mainWindowClosedAndRestarted' &&
                    atLeastOneMessageReceived &&
                    atLeastOneMessageSent
                  ) {
                    setShouldDisplayFeedbackPanel(true)
                  }
                },
              })
            }

            if (onLoad) {
              onLoad(instance)
            }

            instance
              .render()
              .then(() => {
                if (!showLauncher) {
                  instance.openWindow()
                }
                setLoading(false)
              })
              .catch((err) => {
                setLoading(false)
                throw err
              })
          },
        },
        version,
      )
    }

    return () => {
      watsonInstance?.current?.destroy()
      scriptElement?.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace, hasButtonBeenClicked, showLauncher])

  if (showLauncher) return null

  const chatTermsUrl = n('chatTermsUrl', '')

  return (
    <Hidden print>
      {shouldDisplayFeedbackPanel && (
        <ChatFeedbackPanel
          pushUp={pushUp}
          onClose={() => {
            setShouldDisplayFeedbackPanel(false)
          }}
          submitText={n(
            'chatFeedbackSubmitText',
            activeLocale === 'is' ? 'Senda' : 'Submit',
          )}
          heading={n(
            'chatFeedbackHeadingText',
            activeLocale === 'is'
              ? 'Hvernig fannst þér samtalið ganga?'
              : 'How did the conversation go?',
          )}
          inputPlaceholder={n(
            'chatFeedbackInputPlaceholderText',
            activeLocale === 'is' ? 'Athugasemd...' : 'Comment...',
          )}
          successText={n(
            'chatFeedbackSubmitSuccessText',
            activeLocale === 'is' ? 'Sending tókst' : 'Submission succeeded',
          )}
          errorText={n(
            'chatFeedbackSubmitErrorText',
            activeLocale === 'is' ? 'Ekki tókst að senda' : 'Submission failed',
          )}
        />
      )}
      <ChatBubble
        text={n('chatBubbleText', 'Hæ, get ég aðstoðað?')}
        isVisible={true}
        onClick={() => {
          watsonInstance.current?.openWindow()
          setHasButtonBeenClicked(true)
        }}
        pushUp={pushUp}
        loading={loading}
        embedDisclaimerProps={
          replaceDirectorateOfImmigrationWebChatWithAI &&
          props.integrationID === '9e320784-ad44-4da9-9eb3-f305057a196a'
            ? {
                localStorageKey: 'watsonAssistantChatAllowed',
                texts: {
                  message:
                    activeLocale === 'is' ? (
                      <Text variant="small">
                        Þetta netspjall er hýst af þriðja aðila. Með því að
                        halda áfram samþykkir þú{' '}
                        {!chatTermsUrl ? (
                          'skilmála'
                        ) : (
                          <a href={chatTermsUrl ?? ''}>skilmála</a>
                        )}{' '}
                        þeirra.
                      </Text>
                    ) : (
                      <Text variant="small">
                        This AI chatbot is hosted by a third party and by
                        continuing, you are agreeing to their{' '}
                        {!chatTermsUrl ? (
                          'terms and conditions'
                        ) : (
                          <a href={chatTermsUrl ?? ''}>terms and conditions</a>
                        )}
                        . The chatbots purpose is to assist you in your search
                        for information, it's still learning so suggestions must
                        be taken with caution.
                      </Text>
                    ),
                  remember: n(
                    'rememberThisSetting',
                    activeLocale === 'is'
                      ? 'Muna þessa stillingu'
                      : 'Remember this setting',
                  ),
                  accept: n(
                    'accept',
                    activeLocale === 'is' ? 'Halda áfram' : 'I agree',
                  ),
                  cancel: n(
                    'cancel',
                    activeLocale === 'is' ? 'Hætta við' : 'I disagree',
                  ),
                },
              }
            : undefined
        }
      />

      <ToastContainer />
    </Hidden>
  )
}

export default WatsonChatPanel
