import React, { FC } from 'react'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { Document, DocumentDetails } from '@island.is/api/schema'
import {
  Text,
  Box,
  GridRow,
  GridColumn,
  Hidden,
} from '@island.is/island-ui/core'
import format from 'date-fns/format'
import { dateFormat } from '@island.is/shared/constants'

import * as styles from './DocumentLine.treat'

const getEdgecaseDocument = (
  document: Document,
): DocumentDetails | undefined => {
  const { url, fileType } = document
  return fileType === 'url' && url
    ? { fileType, url, content: '', html: '' }
    : undefined
}

interface Props {
  document: Document
}

const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1

const DocumentLine: FC<Props> = ({ document }) => {
  const externalUrl = getEdgecaseDocument(document)?.url

  return (
    <Box position="relative" className={styles.line} paddingY={2}>
      <GridRow>
        <GridColumn span={['1/2', '2/12']} order={[2, 1]}>
          <Box
            className={styles.date}
            display="flex"
            alignItems="center"
            justifyContent={['flexEnd', 'flexStart']}
            height="full"
            paddingX={[0, 2]}
            marginBottom={1}
          >
            <Hidden above="xs">
              <Text variant="small" color="dark300">
                {format(new Date(document.date), dateFormat.is)}
              </Text>
            </Hidden>
            <Hidden below="sm">
              <Text>{format(new Date(document.date), dateFormat.is)}</Text>
            </Hidden>
          </Box>
        </GridColumn>
        <GridColumn
          span={['1/1', '6/12', '7/12', '6/12', '7/12']}
          order={[2, 3]}
        >
          <Box
            display="flex"
            alignItems="center"
            height="full"
            paddingX={[0, 2]}
            paddingBottom={[1, 0]}
            overflow="hidden"
          >
            {
              <a
                href={
                  externalUrl ||
                  ServicePortalPath.ElectronicDocumentsFileDownload.replace(
                    ':id',
                    document.id,
                  )
                }
                className={styles.link}
                target={isFirefox ? '_self' : '_blank'}
              >
                {document.subject}
              </a>
            }
          </Box>
        </GridColumn>
        <GridColumn
          span={['1/2', '4/12', '3/12', '4/12', '3/12']}
          order={[1, 3]}
        >
          <Box
            display="flex"
            alignItems="center"
            height="full"
            paddingX={[0, 2]}
            overflow="hidden"
          >
            <Hidden above="xs">
              <Text variant="small">{document.senderName}</Text>
            </Hidden>
            <Hidden below="sm">
              <Text>{document.senderName}</Text>
            </Hidden>
          </Box>
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default DocumentLine
