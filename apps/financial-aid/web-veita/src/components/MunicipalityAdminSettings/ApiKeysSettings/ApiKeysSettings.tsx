import React, { useContext, useEffect, useState } from 'react'
import { Text, Box, Button, toast } from '@island.is/island-ui/core'

import { ApiKeysForMunicipality } from '@island.is/financial-aid/shared/lib'
import { useMutation } from '@apollo/client'
import {
  ApiKeyForMunicipalityMutation,
  UpdateApiKeyForMunicipalityMutation,
} from '@island.is/financial-aid-web/veita/graphql'
import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'
import copyToClipboard from 'copy-to-clipboard'
import CreateApiKeyModal from '../ApiKeyModal/CreateApiKeyModal'
import AnimateHeight from 'react-animate-height'
import UpdateApiKeyModal from '../ApiKeyModal/UpdateApiKeyModal'

interface Props {
  apiKeyInfo?: ApiKeysForMunicipality
  currentMunicipalityCode: string
}

const ApiKeysSettings = ({ apiKeyInfo, currentMunicipalityCode }: Props) => {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)

  const [isKeyVisable, setIsKeyVisable] = useState(false)

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
        name: newApiKeyInfo.name,
        apiKey: newApiKeyInfo.apiKey,
        isActive: true,
      })
    }
  }
  const updateApiKeyForMunicipality = async (name: string) => {
    await updateApiKeyMutation({
      variables: {
        input: {
          id: apiKeyInfo?.id,
          name: name,
        },
      },
    })
      .then((res) => {
        if (res.data?.updateApiKey) {
          addNewApiKeyToMunicipality(res.data?.updateApiKey)
          toast.success('Api lykill hefur verið uppfærður')
          setIsUpdateModalVisible(false)
        }
      })
      .catch(() => {
        toast.error(
          'Ekki tókst að uppfæra nafn á lyklinum, vinsamlega reynið aftur síðar',
        )
      })
  }

  const createApiKeyForMunicipality = async (name: string, key: string) => {
    await createApiKey({
      variables: {
        input: {
          name: name,
          municipalityCode: currentMunicipalityCode,
          apiKey: key,
        },
      },
    })
      .then((res) => {
        if (res.data?.createApiKey) {
          addNewApiKeyToMunicipality(res.data?.createApiKey)
          toast.success('Api lykill hefur búinn til')
          setIsCreateModalVisible(false)
        }
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

  return (
    <Box marginBottom={[2, 2, 7]} id="apiKeySettings">
      <Box display="flex" justifyContent="spaceBetween" alignItems="center">
        <Text as="h3" variant="h3" marginBottom={[2, 2, 3]} color="dark300">
          Tenging við ytri kerfi
        </Text>
        {apiKeyState.isActive ? (
          <Button
            size="small"
            icon="pencil"
            variant="ghost"
            onClick={() => setIsUpdateModalVisible(true)}
          >
            Uppfæra lykil
          </Button>
        ) : (
          <Button
            size="small"
            icon="add"
            variant="ghost"
            onClick={() => setIsCreateModalVisible(true)}
          >
            Búa til lykil
          </Button>
        )}
      </Box>

      {!apiKeyState.isActive ? (
        <>
          <Text variant="h5" marginBottom={1}>
            Enginn lykill
          </Text>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="spaceBetween">
          <Box>
            <Text variant="h5" marginBottom={1}>
              Nafn
            </Text>
            <Text marginBottom={2}>{apiKeyState.name}</Text>
          </Box>
          <Box display="flex">
            <Button
              onClick={() => setIsKeyVisable(!isKeyVisable)}
              icon="lockOpened"
              size="small"
              disabled={!apiKeyState?.apiKey}
              variant="ghost"
            >
              {isKeyVisable ? 'Fela lykill' : 'Sýna lykill'}
            </Button>
            <Box marginLeft={2}>
              <Button
                onClick={() => copyApiKeyToClipboard(apiKeyState?.apiKey)}
                icon="copy"
                size="small"
                disabled={!apiKeyState?.apiKey}
                variant="primary"
              >
                Afrit af lykli
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      <AnimateHeight duration={250} height={isKeyVisable ? 'auto' : 0}>
        <Text variant="eyebrow" marginBottom={1}>
          Lykill
        </Text>
        <Text marginBottom={2}>{apiKeyState?.apiKey}</Text>
      </AnimateHeight>

      <CreateApiKeyModal
        isVisible={isCreateModalVisible}
        setIsVisible={(isModalVisible) => {
          setIsCreateModalVisible(isModalVisible)
        }}
        onSubmit={(name, key) => createApiKeyForMunicipality(name, key)}
      />

      <UpdateApiKeyModal
        isVisible={isUpdateModalVisible}
        setIsVisible={(isModalVisible) => {
          setIsUpdateModalVisible(isModalVisible)
        }}
        name={apiKeyState.name}
        apiKey={apiKeyState.apiKey}
        onSubmit={(name) => updateApiKeyForMunicipality(name)}
      />
    </Box>
  )
}

export default ApiKeysSettings
