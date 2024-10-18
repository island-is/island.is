import React from 'react'
import { Text, Box, UploadFile } from '@island.is/island-ui/core'
import { getFileType } from '@island.is/financial-aid/shared/lib'
import { useFileUpload } from '../../lib/hooks/useFileUpload'
import cn from 'classnames'

import * as styles from './FileList.css'

type Props = {
  applicationSystemId: string
  files?: UploadFile[]
}

const FileList = ({ files }: Props) => {
  if (files === undefined || files.length === 0) {
    return null
  }

  return (
    <Box marginBottom={2}>
      {files.map((file, i) => {
        return file.key ? (
          <div
            className={cn({
              [`${styles.filesLink}`]: true,
              [styles.hoverState]: file.id,
            })}
            key={'file-' + i}
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
            </div>
          </div>
        ) : null
      })}
    </Box>
  )
}

export default FileList
