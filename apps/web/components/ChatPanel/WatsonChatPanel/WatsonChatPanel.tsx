import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { ChatBubble } from '../ChatBubble'

const URL = 'https://web-chat.global.assistant.watson.appdomain.cloud'
const FILENAME = 'WatsonAssistantChatEntry.js'

const getScriptSource = (version: string) => {
  return `${URL}/versions/${version}/${FILENAME}`
}

interface WatsonChatPanelProps {
  // The region your integration is hosted in.
  region: string

  integrationID: string
  serviceInstanceID: string
  version?: string
  cssVariables?: Record<string, string>

  // Whether the default launcher is shown
  showLauncher?: boolean
}

export const WatsonChatPanel = (props: WatsonChatPanelProps) => {
  const { version = 'latest', showLauncher = true, cssVariables } = props

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
      text="Hæ, get ég aðstoðað?"
      isVisible={isButtonVisible}
      onClick={watsonInstance.current?.openWindow}
    />
  )
}

export default WatsonChatPanel
