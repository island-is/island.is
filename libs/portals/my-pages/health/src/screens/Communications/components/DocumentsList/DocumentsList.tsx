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
  // Max number of documents to show. Omit to show all.
  limit?: number
}

export const DocumentsList: FC<DocumentsListProps> = ({
  documents,
  onDocumentClick,
  loading,
  limit,
}) => {
  const documentsList =
    limit !== undefined ? documents?.slice(0, limit) ?? [] : documents ?? []

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
      ) : documentsList.length > 0 ? (
        documentsList.map((doc, i) => (
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
