import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import {
  ApplicationFile,
  FileType,
  getFileTypeName,
} from '@island.is/financial-aid/shared/lib'
import * as styles from './FilesListWithHeader.treat'
import cn from 'classnames'
import { FileList } from '@island.is/financial-aid/shared/components'

interface Props {
  applicationFiles?: ApplicationFile[]
}

const FilesListWithHeaderContainer = ({ applicationFiles }: Props) => {
  if (!applicationFiles || applicationFiles?.length <= 0) {
    return null
  }
  return (
    <>
      <Box
        marginBottom={[2, 2, 3]}
        className={`contentUp delay-125 ${styles.widthAlmostFull}`}
      >
        <Text as="h2" variant="h3" color="dark300">
          Gögn frá umsækjanda
        </Text>
      </Box>
      <Box
        className={cn({
          [`contentUp delay-125 ${styles.widthAlmostFull}`]: true,
        })}
        marginBottom={[5, 5, 7]}
      >
        {Object.values(FileType).map((file) => {
          const filterFiles = applicationFiles.filter((f) => f.type === file)

          if (filterFiles.length === 0) {
            return
          }
          return (
            <>
              <Text variant="eyebrow" marginBottom={2}>
                {getFileTypeName[file]}
              </Text>
              <FileList files={filterFiles} />
            </>
          )
        })}
      </Box>
    </>
  )
}

export default FilesListWithHeaderContainer
