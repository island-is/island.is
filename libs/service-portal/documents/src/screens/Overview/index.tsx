import ServicePortalDocumentsV2 from './OverviewV2'
import { DocumentsProvider } from './DocumentContext'
import { Box } from '@island.is/island-ui/core'
import { useEffect, useState } from 'react'
import {
  FeatureFlagClient,
  Features,
  useFeatureFlagClient,
} from '@island.is/react/feature-flags'

export const DocumentIndex = () => {
  const [actionsEnabled, setIsActionsEnabled] = useState(false)
  const featureFlagClient: FeatureFlagClient = useFeatureFlagClient()

  const isFlagEnabled = async () => {
    const ffEnabled = await featureFlagClient.getValue(
      Features.servicePortalDocumentsActionsEnabled,
      false,
    )
    if (ffEnabled) {
      setIsActionsEnabled(ffEnabled as boolean)
    }
  }

  /* Should show the paper mail settings? */
  useEffect(() => {
    isFlagEnabled()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box paddingTop={2}>
      <DocumentsProvider>
        <ServicePortalDocumentsV2 actionsEnabled={actionsEnabled} />
      </DocumentsProvider>
    </Box>
  )
}

export default DocumentIndex
