import { Box } from '@island.is/island-ui/core'
import { File } from '@island.is/judicial-system/types'
import React from 'react'
import { CaseFile } from '..'

interface Props {
  files: File[]
  canOpenFiles: boolean
  onOpen: (fileId: string) => void
}

const CaseFileList: React.FC<Props> = (props) => {
  const { files, canOpenFiles, onOpen } = props

  return (
    <>
      {files.map((file, index) => (
        <Box marginBottom={index !== files.length - 1 ? 3 : 0} key={index}>
          <CaseFile
            fileId={file.id}
            name={`${index + 1}. ${file.name}`}
            size={file.size}
            uploadedAt={file.created}
            canOpenFiles={canOpenFiles}
            onOpen={onOpen}
          />
        </Box>
      ))}
    </>
  )
}

export default CaseFileList
