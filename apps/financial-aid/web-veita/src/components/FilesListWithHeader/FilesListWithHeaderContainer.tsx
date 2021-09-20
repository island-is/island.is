import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { ApplicationFile, FileType } from '@island.is/financial-aid/shared/lib'
import FilesListWithHeader from './FilesListWithHeader'
import * as styles from './FilesListWithHeader.treat'

interface Props {
  applicationFiles?: ApplicationFile[]
}

const FilesListWithHeaderContainer = ({ applicationFiles }: Props) => {
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
      <FilesListWithHeader
        heading="Skattframtal"
        files={applicationFiles?.filter((f) => f.type === FileType.TAXRETURN)}
      />
      <FilesListWithHeader
        heading="Tekjugögn"
        files={applicationFiles?.filter((f) => f.type === FileType.INCOME)}
      />
      <FilesListWithHeader
        heading="Innsend gögn"
        files={applicationFiles?.filter((f) => f.type === FileType.OTHER)}
      />
    </>
  )
}

export default FilesListWithHeaderContainer
