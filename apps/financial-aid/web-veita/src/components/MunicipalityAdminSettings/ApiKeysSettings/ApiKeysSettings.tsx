import React, { useContext, useEffect, useState } from 'react'
import {
  Text,
  Box,
  Input,
  Button,
  toast,
  Checkbox,
} from '@island.is/island-ui/core'
import { randomBytes } from 'crypto'

import { ApiKeysForMunicipality } from '@island.is/financial-aid/shared/lib'
import { useMutation } from '@apollo/client'
import {
  ApiKeyForMunicipalityMutation,
  UpdateApiKeyForMunicipalityMutation,
} from '@island.is/financial-aid-web/veita/graphql'
import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'
import copyToClipboard from 'copy-to-clipboard'
import CreateApiKeyModal from '../CreateApiKeyModal/CreateApiKeyModal'

interface Props {
  apiKeyInfo?: ApiKeysForMunicipality
  currentMunicipalityCode: string
}

const ApiKeysSettings = ({ apiKeyInfo, currentMunicipalityCode }: Props) => {
  const createApiKeyState = (apiKeyInfo?: ApiKeysForMunicipality) => ({
    isActive: apiKeyInfo ? true : false,
    isChecked: apiKeyInfo ? true : false,
    name: apiKeyInfo?.name ?? '',
    apiKey: apiKeyInfo?.apiKey ?? '',
    hasError: false,
  })

  const [apiKeyState, setApiKeyState] = useState(createApiKeyState(apiKeyInfo))

  const [createApiKey] = useMutation(ApiKeyForMunicipalityMutation)
  const [updateApiKeyMutation] = useMutation(
    UpdateApiKeyForMunicipalityMutation,
  )

  const { municipality, setMunicipality } = useContext(AdminContext)

  useEffect(() => {
    setApiKeyState(createApiKeyState(apiKeyInfo))
  }, [apiKeyInfo])

  const addNewApiKeyToMunicipality = (
    newApiKeyInfo: ApiKeysForMunicipality,
  ) => {
    if (newApiKeyInfo && setMunicipality) {
      const updatedMunicipality = municipality.map((muni) => ({
        ...muni,
        apiKeyInfo:
          muni.municipalityId === newApiKeyInfo.municipalityCode
            ? newApiKeyInfo
            : muni.apiKeyInfo,
      }))

      setMunicipality(updatedMunicipality)
      setApiKeyState({
        ...apiKeyState,
        isActive: true,
      })
      toast.success('Api lykill hefur verið búinn til')
    }
  }

  const createOrUpdateApiKey = () => {
    if (apiKeyState.isActive) {
      updateApiKeyForMunicipality()
    } else {
      createApiKeyForMunicipality()
    }
  }

  const updateApiKeyForMunicipality = async () => {
    await updateApiKeyMutation({
      variables: {
        input: {
          id: apiKeyInfo?.id,
          name: apiKeyState.name,
        },
      },
    })
      .then((res) => {
        addNewApiKeyToMunicipality(res.data?.updateApiKey)
      })
      .catch(() => {
        toast.error(
          'Ekki tókst að uppfæra nafn á lyklinum, vinsamlega reynið aftur síðar',
        )
      })
  }

  const createApiKeyForMunicipality = async () => {
    if (!apiKeyState.isChecked || !apiKeyState.name || !apiKeyState.apiKey) {
      setApiKeyState({
        ...apiKeyState,
        hasError: true,
      })
      return
    }

    await createApiKey({
      variables: {
        input: {
          name: apiKeyState.name,
          municipalityCode: currentMunicipalityCode,
          apiKey: apiKeyState.apiKey,
        },
      },
    })
      .then((res) => {
        addNewApiKeyToMunicipality(res.data?.createApiKey)
      })
      .catch(() => {
        toast.error(
          'Ekki tókst að búa til api lykil, vinsamlega reynið aftur síðar',
        )
      })
  }

  const copyApiKeyToClipboard = (apiKey?: string) => {
    if (apiKey) {
      const copied = copyToClipboard(apiKey)

      if (copied) {
        toast.success('Lykill hefur verið afritaður')
      } else {
        toast.error('Ekki tókst að afrita lykil')
      }
    } else {
      toast.error('Vantar lykill')
    }
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

  return (
    <Box marginBottom={[2, 2, 7]} id="apiKeySettings">
      <Text as="h3" variant="h3" marginBottom={[2, 2, 3]} color="dark300">
        Tenging við ytri kerfi
      </Text>
      {/* 
      {apiKeyState.isActive ? (
        <Button
          onClick={() => console.log('open modal')}
          icon="lockClosed"
          size="small"
        >
          Búa til lykill
        </Button>
      ) : (
        <div>helo</div>
      )} */}

      <Box marginBottom={3} id="apiKeySettings">
        <Checkbox
          name="isApiKeyActive"
          label="Virkja tengingu við ytri kerfi"
          checked={apiKeyState.isChecked}
          hasError={apiKeyState.hasError && !apiKeyState.isChecked}
          onChange={(event) => {
            if (event.target.checked && !apiKeyState.apiKey) {
              setApiKeyState({
                ...apiKeyState,
                isChecked: event.target.checked,
                apiKey: generateApiKey(),
                hasError: false,
              })
            } else {
              setApiKeyState({
                ...apiKeyState,
                isChecked: event.target.checked,
                hasError: false,
              })
            }
          }}
        />
      </Box>

      <Input
        label="Kerfi"
        name="name"
        value={apiKeyState?.name}
        backgroundColor="blue"
        disabled={!apiKeyState?.isChecked}
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
        útskýring
      </Text>

      <Box display="flex">
        <Box flexGrow={1} marginRight={1}>
          <Input
            label="Lykill"
            name="apiKey"
            value={apiKeyState?.apiKey}
            backgroundColor="blue"
            autoComplete="off"
            readOnly
            disabled={!apiKeyState?.isChecked}
          />
        </Box>

        <Button
          onClick={() => copyApiKeyToClipboard(apiKeyState?.apiKey)}
          icon="copy"
          size="small"
          disabled={!apiKeyState?.apiKey}
        >
          Afrit af lykli
        </Button>
      </Box>

      <Text marginTop={1} marginBottom={3} variant="small">
        útskýring
      </Text>
      <Box display="flex" justifyContent="spaceBetween">
        <Button
          onClick={() => createOrUpdateApiKey()}
          icon="checkmark"
          size="small"
          disabled={!apiKeyState?.isChecked}
        >
          {apiKeyState.isActive ? `Uppfæra lykil` : `Búa til lykil`}
        </Button>
      </Box>
    </Box>
  )
}

export default ApiKeysSettings
