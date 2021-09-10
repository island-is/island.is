import React from 'react'
import { Text, Box, UploadFile } from '@island.is/island-ui/core'

import * as styles from './FileList.treat'
import cn from 'classnames'
import {
  ApplicationFile,
  getFileSizeInKilo,
  getFileType,
} from '@island.is/financial-aid/shared/lib'

interface Props {
  className?: string
  files?: UploadFile[] | ApplicationFile[]
}

const FileList = ({ className, files }: Props) => {
  if (files === undefined || files.length === 0) {
    return null
  }
  return (
    <Box className={cn({ [`${className}`]: true })} marginBottom={2}>
      <>
        {files.map((item, index) => {
          return (
            <a
              key={'file-' + index}
              href={item.name}
              target="_blank"
              rel="noreferrer noopener"
              className={styles.filesLink}
              download
            >
              <div className={styles.container}>
                <div className={styles.type}>
                  <Text color="dark300" fontWeight="semiBold" variant="small">
                    {getFileType(item.name)}
                  </Text>
                </div>
                <div className={styles.name}>
                  <Text variant="small">{item.name}</Text>
                </div>
                <Text variant="small">{`Skjal • ${getFileSizeInKilo(
                  item,
                )} KB`}</Text>
                {'created' in item && (
                  <Text variant="small"> {`${item.created}`}</Text>
                )}
              </div>
            </a>
          )
        })}
      </>
    </Box>
  )
}

export default FileList
