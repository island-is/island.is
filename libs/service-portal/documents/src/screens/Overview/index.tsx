import ServicePortalDocumentsV2 from './OverviewV2'
import { DocumentsProvider } from './DocumentContext'
import { Box } from '@island.is/island-ui/core'

export const DocumentIndex = () => {
  return (
    <Box paddingTop={2}>
      <DocumentsProvider>
        <ServicePortalDocumentsV2 />
      </DocumentsProvider>
    </Box>
  )
}

export default DocumentIndex
