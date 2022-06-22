import cn from 'classnames'
import format from 'date-fns/format'
import React, { FC } from 'react'
import { useWindowSize } from 'react-use'

import { Document } from '@island.is/api/schema'
import { getAccessToken } from '@island.is/auth/react'
import {
  Box,
  GridColumn,
  GridRow,
  Link,
  Text,
  Icon,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { dateFormat } from '@island.is/shared/constants'

import * as styles from './DocumentLine.css'

interface Props {
  documentLine: Document
  img?: string
}

const DocumentLine: FC<Props> = ({ documentLine, img }) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.sm

  const onClickHandler = async () => {
    // Create form elements
    const form = document.createElement('form')
    const documentIdInput = document.createElement('input')
    const tokenInput = document.createElement('input')

    const token = await getAccessToken()
    if (!token) return

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
    tokenInput.value = token

    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }

  const date = (variant: 'small' | 'medium') => (
    <Text variant={variant}>
      {format(new Date(documentLine.date), dateFormat.is)}
    </Text>
  )

  const image = img && <img className={styles.image} src={img} alt="" />
  const isLink = documentLine.fileType === 'url' && documentLine.url

  const subject = isLink ? (
    <Link href={documentLine.url} newTab>
      <button className={styles.button}>
        {documentLine.subject}
        <Icon type="outline" icon="open" size="small" className={styles.icon} />
      </button>
    </Link>
  ) : (
    <button
      className={cn(styles.button, {
        [styles.unopened]: !documentLine.opened,
      })}
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
    <Box
      position="relative"
      className={cn(styles.line, {
        [styles.unopenedWrapper]: !documentLine.opened && !isLink,
        [styles.linkWrapper]: isLink,
      })}
      paddingY={2}
    >
      {isMobile ? (
        <GridRow alignItems="flexStart" align="flexStart">
          {img && (
            <GridColumn span="2/12">
              <Box
                display="flex"
                alignItems="center"
                height="full"
                paddingX={[0, 2]}
                paddingBottom={[1, 0]}
              >
                {image}
              </Box>
            </GridColumn>
          )}
          <GridColumn span="7/12">
            <Box
              display="flex"
              alignItems="center"
              paddingX={[0, 2]}
              className={styles.sender}
            >
              {sender('eyebrow')}
            </Box>
            <Box display="flex" alignItems="center" paddingX={[0, 2]}>
              {subject}
            </Box>
          </GridColumn>
          <GridColumn span="3/12">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flexEnd"
              height="full"
              paddingX={[0, 2]}
            >
              {date('small')}
            </Box>
          </GridColumn>
        </GridRow>
      ) : (
        <GridRow>
          <GridColumn span={['1/1', '2/12']}>
            <Box
              display="flex"
              alignItems="center"
              height="full"
              paddingX={[0, 2]}
            >
              {date('medium')}
            </Box>
          </GridColumn>
          <GridColumn span={['1/1', '6/12', '6/12', '6/12', '7/12']}>
            <Box
              display="flex"
              alignItems="center"
              height="full"
              paddingX={[0, 2]}
              paddingBottom={[1, 0]}
            >
              {img && image}
              {subject}
            </Box>
          </GridColumn>
          <GridColumn span={['1/1', '4/12', '4/12', '4/12', '3/12']}>
            <Box
              display="flex"
              alignItems="center"
              height="full"
              paddingX={[0, 2]}
              className={styles.sender}
            >
              {sender('medium')}
            </Box>
          </GridColumn>
        </GridRow>
      )}
    </Box>
  )
}

export default DocumentLine
