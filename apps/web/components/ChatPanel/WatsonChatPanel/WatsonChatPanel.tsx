import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@apollo/client'

import { Query, QueryGetNamespaceArgs } from '@island.is/api/schema'
import { useNamespaceStrict } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { GET_NAMESPACE_QUERY } from '@island.is/web/screens/queries'

import { ChatBubble } from '../ChatBubble'
import { WatsonChatPanelProps } from '../types'
import { onDirectorateOfImmigrationChatLoad } from './directorateOfImmigrationChatUtils'

const URL = 'https://web-chat.global.assistant.watson.appdomain.cloud'
const FILENAME = 'WatsonAssistantChatEntry.js'

const getScriptSource = (version: string) => {
  return `${URL}/versions/${version}/${FILENAME}`
}

export const WatsonChatPanel = (props: WatsonChatPanelProps) => {
  const { activeLocale } = useI18n()

  const {
    version = 'latest',
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
    () => JSON.parse(data?.getNamespace?.fields ?? '{}'),
    [data?.getNamespace?.fields],
  )

  const n = useNamespaceStrict(namespace)

  const watsonInstance = useRef(null)
  const [isButtonVisible, setIsButtonVisible] = useState(false)

  useEffect(() => {
    if (Object.keys(namespace).length === 0) {
      return () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        watsonInstance?.current?.destroy()
      }
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    const namespaceValue = namespace?.[namespaceKey] ?? {}
    const { cssVariables, ...languagePack } = namespaceValue

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const windowObject: any = window
    windowObject.watsonAssistantChatOptions = {
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
      },
      ...props,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      onLoad: (instance) => {
        watsonInstance.current = instance
        if (cssVariables) {
          instance.updateCSSVariables(cssVariables)
        }
        if (Object.keys(languagePack).length > 0) {
          instance.updateLanguagePack(languagePack)
        }
        if (props.integrationID === '89a03e83-5c73-4642-b5ba-cd3771ceca54') {
          onDirectorateOfImmigrationChatLoad(instance, namespace, activeLocale)
        }

        if (onLoad) {
          onLoad(instance)
        }

        instance.render().then(() => setIsButtonVisible(true))
      },
    }

    const scriptElement = document.createElement('script')
    scriptElement.src = getScriptSource(version)
    document.head.appendChild(scriptElement)

    return () => {
      scriptElement?.remove()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      watsonInstance?.current?.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace])

  if (showLauncher) return null

  return (
    <ChatBubble
      text={n('chatBubbleText', 'Hæ, get ég aðstoðað?')}
      isVisible={isButtonVisible}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      onClick={watsonInstance.current?.openWindow}
      pushUp={pushUp}
    />
  )
}

export default WatsonChatPanel
