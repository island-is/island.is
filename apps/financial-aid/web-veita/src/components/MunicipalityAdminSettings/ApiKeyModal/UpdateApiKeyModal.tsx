import React, { useEffect, useState } from 'react'
import { Text, Input } from '@island.is/island-ui/core'

import ActionModal from '../../ActionModal/ActionModal'

interface Props {
  isVisible: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  name: string
  apiKey: string
  onSubmit: (name: string) => void
}
interface ApiKeyState {
  name?: string
  apiKey: string
  hasError: boolean
}

const UpdateApiKeyModal = ({
  isVisible,
  setIsVisible,
  name,
  apiKey,
  onSubmit,
}: Props) => {
  const [apiKeyState, setApiKeyState] = useState<ApiKeyState>({
    hasError: false,
    apiKey: apiKey,
    name: name,
  })

  useEffect(() => {
    setApiKeyState({ ...apiKeyState, apiKey: apiKey, name: name })
  }, [name, apiKey])

  return (
    <ActionModal
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      header={'Uppfæra lykill'}
      hasError={apiKeyState.hasError}
      errorMessage="Kerfi þarf að hafa nafn"
      submitButtonText={'Uppfæra'}
      onSubmit={() => {
        if (!apiKeyState.name) {
          setApiKeyState({
            ...apiKeyState,
            hasError: true,
          })
          return
        }
        onSubmit(apiKeyState.name)
      }}
    >
      <Input
        label="Kerfi"
        name="name"
        value={apiKeyState?.name}
        backgroundColor="blue"
        autoComplete="off"
        hasError={apiKeyState.hasError && !apiKeyState.name}
        onChange={(event) => {
          setApiKeyState({
            ...apiKeyState,
            name: event.target.value,
            hasError: false,
          })
        }}
        errorMessage="Til að uppfæra til lykill þarf nafn að vera til staðar"
      />
      <Text marginTop={1} marginBottom={3} variant="small">
        Nafn á kerfið
      </Text>

      <Input
        label="Lykill"
        name="apiKey"
        value={apiKeyState?.apiKey}
        backgroundColor="blue"
        autoComplete="off"
        readOnly
      />
    </ActionModal>
  )
}

export default UpdateApiKeyModal
