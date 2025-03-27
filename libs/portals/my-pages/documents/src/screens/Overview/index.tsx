import DocumentsOverview from './Overview'
import { DocumentsProvider } from './DocumentContext'
import { Box } from '@island.is/island-ui/core'

export const DocumentIndex = () => {
  return (
    <Box paddingTop={2}>
      <DocumentsProvider>
        <DocumentsOverview />
      </DocumentsProvider>
    </Box>
  )
}

export default DocumentIndex
