import React, { useState } from 'react'
import { Text, Box, Button, toast } from '@island.is/island-ui/core'

import { ApiKeysForMunicipality } from '@island.is/financial-aid/shared/lib'
import copyToClipboard from 'copy-to-clipboard'
import AnimateHeight from 'react-animate-height'
import { DeleteApiKeyForMunicipalityMutation } from '@island.is/financial-aid-web/veita/graphql'
import { useMutation } from '@apollo/client'

interface Props {
  apiKeyInfo?: ApiKeysForMunicipality
}

const ApiKeyInfo = ({ apiKeyInfo }: Props) => {
  const [isKeyVisable, setIsKeyVisable] = useState(false)

  const [deleteApiKeyMutation] = useMutation(
    DeleteApiKeyForMunicipalityMutation,
  )

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

  if (apiKeyInfo) {
    return (
      <>
        <Box display="flex" alignItems="center" justifyContent="spaceBetween">
          <Box>
            <Box>
              <Text variant="h5" marginBottom={1}>
                Nafn
              </Text>
              <Text marginBottom={2}>{apiKeyInfo?.name}</Text>
            </Box>
          </Box>
          <Button
            onClick={() => setIsKeyVisable(!isKeyVisable)}
            icon="close"
            size="small"
            variant="primary"
            colorScheme="destructive"
          >
            Eyða lykli
          </Button>
          <Box display="flex">
            <Button
              onClick={() => setIsKeyVisable(!isKeyVisable)}
              icon={isKeyVisable ? 'lockOpened' : 'lockClosed'}
              size="small"
              disabled={!apiKeyInfo?.apiKey}
              variant="ghost"
            >
              {isKeyVisable ? 'Fela lykill' : 'Sýna lykill'}
            </Button>
            <Box marginLeft={2}>
              <Button
                onClick={() => copyApiKeyToClipboard(apiKeyInfo?.apiKey)}
                icon="copy"
                size="small"
                disabled={!apiKeyInfo?.apiKey}
                variant="primary"
              >
                Afrit af lykli
              </Button>
            </Box>
          </Box>
        </Box>
        <AnimateHeight duration={250} height={isKeyVisable ? 'auto' : 0}>
          <Text variant="eyebrow" marginBottom={1}>
            Lykill
          </Text>
          <Text marginBottom={2}>{apiKeyInfo?.apiKey}</Text>
        </AnimateHeight>
      </>
    )
  } else {
    return (
      <Text variant="h5" marginBottom={1}>
        Enginn lykill
      </Text>
    )
  }
}

export default ApiKeyInfo
