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
import cn from 'classnames'
import { m } from '@island.is/service-portal/core'
interface Props {
  documentLine: Document
  userInfo: User
  img?: string
}

const DocumentLine: FC<Props> = ({ documentLine, userInfo, img }) => {
  const { formatMessage } = useLocale()
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

  const date = (variant: 'small' | 'medium') => (
    <Text variant={variant}>
      {format(new Date(documentLine.date), dateFormat.is)}
    </Text>
  )

  const image = img && (
    <img
      className={styles.image}
      src={img}
      alt={`${formatMessage(m.altText)} ${documentLine.subject}`}
    />
  )

  const subject =
    documentLine.fileType === 'url' && documentLine.url ? (
      <Link href={documentLine.url}>
        <button
          className={cn(styles.button, !documentLine.opened && styles.unopened)}
        >
          {documentLine.subject}
        </button>
      </Link>
    ) : (
      <button
        className={cn(styles.button, !documentLine.opened && styles.unopened)}
        onClick={onClickHandler}
      >
        {documentLine.subject}
      </button>
    )

  const sender = (variant: 'eyebrow' | 'medium') => (
    <Text variant={variant} id="senderName">
      {documentLine.senderName}
    </Text>
  )
  return (
    <Box position="relative" className={styles.line} paddingY={2}>
      {/* 
      RÖÐ:
      1. Dagsetning
      2. Mynd + titill
      3. Stofnun 
      
      1. Mynd
      2. RÖÐ
      1 Stofnun
      2 Dagsetning
      3.Titill
      */}
      {/* <GridRow>
        <GridColumn span={['1/2', '2/12']} order={[2, 1]}>
          <Box
            display="flex"
            alignItems="center"
            height="full"
            paddingX={[0, 2]}
            overflow="hidden"
          >
            <Text variant="medium">
              {format(new Date(documentLine.date), dateFormat.is)}
            </Text>
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
                alt={`${formatMessage(m.altText)} ${documentLine.subject}`}
              />
            )}
            {documentLine.fileType === 'url' && documentLine.url ? (
              <Link href={documentLine.url}>
                <button
                  className={cn(
                    styles.button,
                    !documentLine.opened && styles.unopened,
                  )}
                >
                  {documentLine.subject}
                </button>
              </Link>
            ) : (
              <button
                className={cn(
                  styles.button,
                  !documentLine.opened && styles.unopened,
                )}
                onClick={onClickHandler}
              >
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
            <Text variant="medium">{documentLine.senderName}</Text>
          </Box>
        </GridColumn>
      </GridRow> */}

      <GridRow>
        <GridColumn>
          <Box
            display="flex"
            alignItems="center"
            height="full"
            paddingX={[0, 2]}
            paddingBottom={[1, 0]}
            overflow="hidden"
          >
            {image}
          </Box>
        </GridColumn>
        <GridColumn>
          <GridRow>
            <GridColumn>
              <Box
                display="flex"
                alignItems="center"
                height="full"
                paddingX={[0, 2]}
                overflow="hidden"
                className={styles.sender}
              >
                {sender('eyebrow')}
              </Box>
            </GridColumn>
            <GridColumn>
              <Box
                display="flex"
                alignItems="center"
                height="full"
                paddingX={[0, 2]}
                overflow="hidden"
              >
                {date('small')}
              </Box>
            </GridColumn>
          </GridRow>
          <GridColumn>
            <Box
              display="flex"
              alignItems="center"
              height="full"
              paddingX={[0, 2]}
              overflow="hidden"
            >
              {subject}
            </Box>
          </GridColumn>
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default DocumentLine
