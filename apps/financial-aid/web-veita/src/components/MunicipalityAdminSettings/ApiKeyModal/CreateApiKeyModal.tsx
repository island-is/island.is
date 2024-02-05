import React, { useEffect, useState } from 'react'
import { Text, Input } from '@island.is/island-ui/core'
import { randomBytes } from 'crypto'

import ActionModal from '../../ActionModal/ActionModal'

interface Props {
  isVisible: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  onSubmit: (name: string, key: string) => void
}
interface ApiKeyState {
  name?: string
  apiKey: string
  hasError: boolean
}
// Function to generate a random API key
const generateApiKey = () => {
  // Length of the API key
  const length = 32
  // Generate random bytes
  const bytes = randomBytes(length)
  // Convert bytes to hexadecimal
  const apiKey = bytes.toString('hex')

  return apiKey
}

const CreateApiKeyModal = ({ isVisible, setIsVisible, onSubmit }: Props) => {
  const [apiKeyState, setApiKeyState] = useState<ApiKeyState>({
    hasError: false,
    apiKey: generateApiKey(),
  })

  useEffect(() => {
    if (isVisible && apiKeyState.name) {
      setApiKeyState({
        ...apiKeyState,
        name: '',
        apiKey: generateApiKey(),
      })
    }
  }, [isVisible])

  return (
    <ActionModal
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      header={'Nýr lykill'}
      hasError={false}
      errorMessage=""
      submitButtonText={'Stofna Api lykil'}
      onSubmit={() => {
        if (!apiKeyState.name) {
          setApiKeyState({
            ...apiKeyState,
            hasError: true,
          })
          return
        }
        onSubmit(apiKeyState.name, apiKeyState.apiKey)
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
        errorMessage="Til að búa til lykill þarf nafn að vera til staðar"
      />
      <Text marginTop={1} marginBottom={3} variant="small">
        Veldu nafn á kerfið
      </Text>

      <Input
        label="Lykill"
        name="apiKey"
        value={apiKeyState?.apiKey}
        backgroundColor="blue"
        autoComplete="off"
        readOnly
      />
      <Text marginTop={1} marginBottom={3} variant="small">
        Lykill hefur verið búin til
      </Text>
    </ActionModal>
  )
}

export default CreateApiKeyModal
