import type { FC } from 'react'

import { Box, Icon, Tag, Text } from '@island.is/island-ui/core'
import type { CourtDocumentResponse } from '@island.is/judicial-system-web/src/graphql/schema'

import * as styles from './UnfiledCourtDocumentList.css'

interface Props {
  courtDocuments: CourtDocumentResponse[]
  isDisabled: boolean
  onOpen: (courtDocumentId: string) => void
  onFile: (courtDocument: CourtDocumentResponse) => void
}

// The documents of the case that are not laid before the court, offered for
// filing. The case's own documents and the ones copied in from each merged
// case are listed apart, because filing a copy puts it back in its own merged
// case's section of the record rather than at the end of the court session.
export const UnfiledCourtDocumentList: FC<Props> = ({
  courtDocuments,
  isDisabled,
  onOpen,
  onFile,
}) => (
  <Box display="flex" flexDirection="column" rowGap={2} width="full">
    {courtDocuments.map((courtDocument) => (
      <div className={styles.row} key={courtDocument.id}>
        <Box
          className={styles.documentCard}
          background="white"
          borderRadius="large"
          border="standard"
          borderColor="blue200"
        >
          <Box
            className={styles.documentButton}
            component="button"
            onClick={() => onOpen(courtDocument.id)}
            paddingX={2}
            paddingY={2}
          >
            <Text variant="h5" as="span" className={styles.documentName}>
              {courtDocument.name}
            </Text>
            <Box marginLeft={1} flexShrink={0}>
              <Icon icon="open" type="outline" size="small" />
            </Box>
          </Box>
        </Box>
        <div className={styles.fileAction}>
          <Tag
            outlined
            variant="darkerBlue"
            onClick={() => onFile(courtDocument)}
            disabled={isDisabled}
          >
            Leggja fram
          </Tag>
        </div>
      </div>
    ))}
  </Box>
)
