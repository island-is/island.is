import { DocumentV2 } from '@island.is/api/schema'
import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import {
  FALLBACK_ORG_LOGO_URL,
  ORG_LOGO_PARAMS,
} from '@island.is/portals/my-pages/core'
import { DocumentLine } from '@island.is/portals/my-pages/documents'
import { FC } from 'react'
import DocumentsEmpty from '../DocumentsEmpty/DocumentsEmpty'

interface DocumentsListProps {
  documents?: DocumentV2[]
  onDocumentClick?: (documentId: string) => void
  loading?: boolean
}

export const DocumentsList: FC<DocumentsListProps> = ({
  documents,
  onDocumentClick,
  loading,
}) => {
  return (
    <Box>
      {loading ? (
        <Box marginTop={4}>
          <SkeletonLoader
            space={2}
            repeat={6}
            display="block"
            width="full"
            height={65}
          />
        </Box>
      ) : documents && documents.length > 0 ? (
        documents.slice(0, 4).map((doc, i) => (
          <Box key={doc.id}>
            <DocumentLine
              img={
                doc?.sender?.logoUrl
                  ? doc.sender.logoUrl.concat(ORG_LOGO_PARAMS)
                  : FALLBACK_ORG_LOGO_URL
              }
              documentLine={doc}
              active={false}
              asFrame
              includeTopBorder={i === 0}
            />
          </Box>
        ))
      ) : (
        <DocumentsEmpty /> // TODO: check delegation access if needed
      )}
    </Box>
  )
}
