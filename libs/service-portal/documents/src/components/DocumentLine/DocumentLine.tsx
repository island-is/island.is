import React, { FC } from 'react'
import { Document } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import {
  Text,
  Box,
  GridRow,
  GridColumn,
  Link,
  Hidden,
} from '@island.is/island-ui/core'
import format from 'date-fns/format'
import { dateFormat } from '@island.is/shared/constants'
import * as styles from './DocumentLine.css'
import { User } from 'oidc-client'

interface Props {
  documentLine: Document
  userInfo: User
  img?: string
}

const DocumentLine: FC<Props> = ({ documentLine, userInfo, img }) => {
  const onClickHandler = () => {
    // Create form elements
    const form = document.createElement('form')
    const documentIdInput = document.createElement('input')
    const tokenInput = document.createElement('input')

    form.appendChild(documentIdInput)
    form.appendChild(tokenInput)

    // Form values
    form.method = 'post'
    // TODO: Use correct url
    form.action = documentLine.url
    form.target = '_blank'

    // Document Id values
    documentIdInput.type = 'hidden'
    documentIdInput.name = 'documentId'
    documentIdInput.value = documentLine.id

    // National Id values
    tokenInput.type = 'hidden'
    tokenInput.name = '__accessToken'
    tokenInput.value = userInfo.access_token

    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }

  return (
    <>
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
                  {format(new Date(documentLine.date), dateFormat.is)}
                </Text>
              </Hidden>
              <Hidden below="sm">
                <Text>
                  {format(new Date(documentLine.date), dateFormat.is)}
                </Text>
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
              {img && (
                <img
                  className={styles.image}
                  src={img}
                  alt={documentLine.subject}
                />
              )}
              {documentLine.fileType === 'url' && documentLine.url ? (
                <Link href={documentLine.url}>
                  <button className={styles.button}>
                    {documentLine.subject}
                  </button>
                </Link>
              ) : (
                <button className={styles.button} onClick={onClickHandler}>
                  {documentLine.subject}
                </button>
              )}
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
                <Text variant="small">{documentLine.senderName}</Text>
              </Hidden>
              <Hidden below="sm">
                <Text>{documentLine.senderName}</Text>
              </Hidden>
            </Box>
          </GridColumn>
        </GridRow>
      </Box>
    </>
  )
}

export default DocumentLine
