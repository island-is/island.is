import React from 'react'
import { Text, Box, Button } from '@island.is/island-ui/core'
import {
  ApplicationFile,
  FileType,
  getFileTypeName,
} from '@island.is/financial-aid/shared/lib'
import * as styles from './FilesListWithHeader.css'
import cn from 'classnames'
import { FileList } from '@island.is/financial-aid/shared/components'

interface Props {
  applicationFiles?: ApplicationFile[]
}

const FilesListWithHeaderContainer = ({ applicationFiles }: Props) => {
  if (!applicationFiles || applicationFiles?.length <= 0) {
    return null
  }

  const printAll = () => {
    // var pages = applicationFiles
    // for (var i = 0; i < pages.length; i++) {
    //   var oWindow = window.open(pages[i].name, 'print')
    //   oWindow?.print()
    //   oWindow?.close()
    // }
  }

  return (
    <>
      <Box
        marginBottom={[2, 2, 3]}
        className={`contentUp delay-125 ${styles.widthFull}`}
        borderBottomWidth="standard"
        borderColor="dark200"
      >
        <Text as="h2" variant="h3" color="dark300" marginBottom={1}>
          Gögn frá umsækjanda
        </Text>
      </Box>
      <Box
        className={cn({
          [`contentUp delay-125 ${styles.widthAlmostFull}`]: true,
        })}
        marginBottom={[5, 5, 7]}
      >
        {Object.values(FileType).map((file, index) => {
          const filterFiles = applicationFiles.filter((f) => f.type === file)

          if (filterFiles.length !== 0) {
            return (
              <span key={'fileList-' + index}>
                <Text variant="eyebrow" marginBottom={2}>
                  {getFileTypeName[file]}
                </Text>
                <FileList files={filterFiles} className="" />
              </span>
            )
          }
        })}
      </Box>
      {/* <Box
        className={`contentUp delay-125 ${styles.widthFull}`}
        marginBottom={[2, 2, 3]}
        printHidden
      >
        <Button onClick={printAll}>helo</Button>
      </Box> */}
    </>
  )
}

export default FilesListWithHeaderContainer
