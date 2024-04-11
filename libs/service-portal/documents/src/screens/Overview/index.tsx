import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import ServicePortalDocuments from './Overview'
import ServicePortalDocumentsV2 from './OverviewV2'
import { useEffect, useState } from 'react'
import { DocumentsProvider } from './DocumentContext'

export const DocumentIndex = () => {
  const featureFlagClient = useFeatureFlagClient()
  const [v2Enabled, setV2Enabled] = useState<boolean>()

  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        `isServicePortalDocumentsV2PageEnabled`,
        false,
      )
      if (ffEnabled) {
        setV2Enabled(ffEnabled as boolean)
      }
    }
    isFlagEnabled()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (v2Enabled) {
    return (
      <DocumentsProvider>
        <ServicePortalDocumentsV2 />
      </DocumentsProvider>
    )
  }
  if (v2Enabled === false) {
    return <ServicePortalDocuments />
  }
  return null
}

export default DocumentIndex
