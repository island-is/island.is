import React from 'react'
import { useIntl } from 'react-intl'
import { useLazyQuery } from '@apollo/client'
import cn from 'classnames'

import { Text, Box } from '@island.is/island-ui/core'
import {
  getFileSizeInKilo,
  getFileType,
} from '@island.is/financial-aid/shared/lib'
import { GET_ATTACHMENT_PRESIGNED_URL } from '@island.is/application/graphql'

import * as styles from './FileList.css'
import { missingFiles } from '../../../lib/messages'

interface FileItem {
  id?: string
  key?: string
  name: string
  size?: number
}

interface Props {
  applicationSystemId: string
  files?: FileItem[]
}

const FileList = ({ files, applicationSystemId }: Props) => {
  const { formatMessage } = useIntl()

  const [getPresignedUrl] = useLazyQuery(GET_ATTACHMENT_PRESIGNED_URL, {
    fetchPolicy: 'no-cache',
  })

  const handleOpenFile = async (file: FileItem) => {
    if (!file.key) {
      return
    }
    const { data } = await getPresignedUrl({
      variables: {
        input: {
          id: applicationSystemId,
          attachmentKey: file.key,
        },
      },
    })
    const url = data?.attachmentPresignedURL?.url
    if (url) {
      window.open(url)
    }
  }

  if (!files || files.length === 0) {
    return null
  }

  return (
    <Box marginBottom={2}>
      {files.map((file, i) =>
        file.key ? (
          <button
            className={cn({
              [`${styles.filesLink}`]: true,
              [styles.hoverState]: !!file.key,
            })}
            key={'file-' + i}
            onClick={(e) => {
              e.preventDefault()
              handleOpenFile(file)
            }}
          >
            <div className={styles.container}>
              <div className={styles.type}>
                <Text color="dark300" fontWeight="semiBold" variant="small">
                  {getFileType(file.name)}
                </Text>
              </div>
              <div className={styles.name}>
                <Text variant="small">{file.name}</Text>
              </div>
              <Text variant="small">{`${formatMessage(
                missingFiles.confirmation.file,
              )} • ${getFileSizeInKilo(file)} KB`}</Text>
            </div>
          </button>
        ) : null,
      )}
    </Box>
  )
}

export default FileList
