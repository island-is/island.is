import { useQuery } from '@apollo/client'
import React, { useMemo, useEffect, useRef, useState } from 'react'
import { ChatBubble } from '../ChatBubble'
import { Query, QueryGetNamespaceArgs } from '@island.is/api/schema'
import { GET_NAMESPACE_QUERY } from '@island.is/web/screens/queries'
import { useI18n } from '@island.is/web/i18n'
import { useNamespaceStrict } from '@island.is/web/hooks'
import { WatsonChatPanelProps } from '../types'

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
    cssVariables,
    languagePack,
    onLoad,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const windowObject: any = window
    windowObject.watsonAssistantChatOptions = {
      ...props,
      onLoad: (instance) => {
        watsonInstance.current = instance
        if (cssVariables) {
          instance.updateCSSVariables(cssVariables)
        }
        if (languagePack) {
          instance.updateLanguagePack(languagePack)
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
      watsonInstance?.current?.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (showLauncher) return null

  return (
    <ChatBubble
      text={n('chatBubbleText', 'Hæ, get ég aðstoðað?')}
      isVisible={isButtonVisible}
      onClick={watsonInstance.current?.openWindow}
    />
  )
}

export default WatsonChatPanel
