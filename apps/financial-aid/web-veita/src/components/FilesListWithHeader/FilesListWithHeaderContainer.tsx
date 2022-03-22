import React from 'react'
import { Text, Box, Button } from '@island.is/island-ui/core'
import {
  ApplicationFile,
  FileType,
  getFileTypeName,
} from '@island.is/financial-aid/shared/lib'
import * as styles from './FilesListWithHeader.css'
import { FileList } from '@island.is/financial-aid/shared/components'
import CollapsibleProfileUnit from '../ProfileUnit/CollapsibleProfileUnit'

interface Props {
  applicationFiles?: ApplicationFile[]
}

const FilesListWithHeaderContainer = ({ applicationFiles }: Props) => {
  if (!applicationFiles || applicationFiles?.length <= 0) {
    return null
  }

  return (
    <>
      <CollapsibleProfileUnit
        heading="Gögn frá umsækjanda"
        info={[]}
        className={`contentUp delay-125 ${styles.widthFull}`}
      >
        <Box marginBottom={[5, 5, 7]}>
          {Object.values(FileType).map((file, index) => {
            const filterFiles = applicationFiles.filter((f) => f.type === file)

            if (filterFiles.length !== 0) {
              return (
                <span key={'fileList-' + index}>
                  <Text variant="eyebrow" marginBottom={2}>
                    {getFileTypeName[file]}
                  </Text>
                  <FileList files={filterFiles} />
                </span>
              )
            }
          })}
        </Box>
      </CollapsibleProfileUnit>
    </>
  )
}

export default FilesListWithHeaderContainer
