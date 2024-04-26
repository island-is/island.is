import React from 'react'
import { Text, Box, Button } from '@island.is/island-ui/core'

import { ApiKeysForMunicipality } from '@island.is/financial-aid/shared/lib'
import AnimateHeight from 'react-animate-height'
import useApiKeysInfo from '@island.is/financial-aid-web/veita/src/utils/useApiKeysInfo'

interface Props {
  apiKeyInfo?: ApiKeysForMunicipality
}

const ApiKeyInfo = ({ apiKeyInfo }: Props) => {
  const { isKeyVisable, setIsKeyVisable, copyApiKeyToClipboard } =
    useApiKeysInfo()

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
