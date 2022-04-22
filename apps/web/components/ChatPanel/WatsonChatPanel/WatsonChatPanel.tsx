import { useEffect } from 'react'

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
}

export const WatsonChatPanel = ({
  integrationID,
  region,
  serviceInstanceID,
  version = 'latest',
}: WatsonChatPanelProps) => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mainInstance: any

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const windowObject: any = window
    windowObject.watsonAssistantChatOptions = {
      integrationID,
      region,
      serviceInstanceID,
      onLoad: (instance) => {
        mainInstance = instance
        instance.render()
      },
    }

    const scriptElement = document.createElement('script')
    scriptElement.src = getScriptSource(version)
    document.head.appendChild(scriptElement)

    return () => {
      scriptElement?.remove()
      mainInstance?.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default WatsonChatPanel
