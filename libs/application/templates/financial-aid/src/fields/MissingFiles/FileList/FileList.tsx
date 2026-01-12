import React from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'

import { Text, Box, UploadFileDeprecated } from '@island.is/island-ui/core'
import {
  getFileSizeInKilo,
  getFileType,
} from '@island.is/financial-aid/shared/lib'

import * as styles from './FileList.css'
import { missingFiles } from '../../../lib/messages'
import { useFileUpload } from '../../../lib/hooks/useFileUpload'

interface Props {
  applicationSystemId: string
  files?: UploadFileDeprecated[]
}

const FileList = ({ files, applicationSystemId }: Props) => {
  const { formatMessage } = useIntl()
  const { openFileById } = useFileUpload(files ?? [], applicationSystemId)

  if (files === undefined || files.length === 0) {
    return null
  }

  return (
    <Box marginBottom={2}>
      {files.map((file, i) => {
        return file.id ? (
          <button
            className={cn({
              [`${styles.filesLink}`]: true,
              [styles.hoverState]: file.id,
            })}
            key={'file-' + i}
            onClick={(e) => {
              e.preventDefault()
              openFileById(file.id as string)
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
        ) : null
      })}
    </Box>
  )
}

export default FileList
