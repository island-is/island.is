import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import cn from 'classnames'
import { ApplicationFile } from '@island.is/financial-aid/shared/lib'
import { FileList } from '@island.is/financial-aid/shared/components'
import * as styles from './FilesListWithHeader.treat'

interface Props {
  heading?: string
  files?: ApplicationFile[]
}

const FilesListWithHeader = ({ heading, files }: Props) => {
  return (
    <Box
      className={cn({
        [`contentUp delay-125 ${styles.widthAlmostFull}`]: true,
      })}
      marginBottom={2}
    >
      <Text variant="eyebrow" marginBottom={2}>
        {heading}
      </Text>
      <FileList
        files={files}
        className={`contentUp delay-125 ${styles.widthAlmostFull}`}
      />
    </Box>
  )
}

export default FilesListWithHeader
