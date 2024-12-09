import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import ServicePortalDocumentsV2 from './OverviewV2'
import ServicePortalDocumentsV3 from './OverviewV3'
import { useEffect, useState } from 'react'
import { DocumentsProvider } from './DocumentContext'
import { Box } from '@island.is/island-ui/core'

export const DocumentIndex = () => {
  const featureFlagClient = useFeatureFlagClient()
  const [v3Enabled, setV3Enabled] = useState<boolean>()

  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        `isServicePortalDocumentsV3PageEnabled`,
        false,
      )
      setV3Enabled(ffEnabled as boolean)
    }
    isFlagEnabled()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (v3Enabled) {
    return (
      <Box paddingTop={2}>
        <DocumentsProvider>
          <ServicePortalDocumentsV3 />
        </DocumentsProvider>
      </Box>
    )
  }
  if (v3Enabled === false) {
    return (
      <Box paddingTop={2}>
        <DocumentsProvider>
          <ServicePortalDocumentsV2 />
        </DocumentsProvider>
      </Box>
    )
  }
  return null
}

export default DocumentIndex
