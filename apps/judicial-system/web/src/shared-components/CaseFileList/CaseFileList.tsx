import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { CaseFile as TCaseFile } from '@island.is/judicial-system/types'
import { CaseFile } from '..'
import useFileList from '../../utils/hooks/useFileList'

interface Props {
  caseId: string
  files: TCaseFile[]
  canOpenFiles?: boolean
}

const CaseFileList: React.FC<Props> = (props) => {
  const { caseId, files, canOpenFiles = true } = props

  const { handleOpenFile } = useFileList({ caseId })

  return (
    <>
      {files.length > 0 ? (
        files.map((file, index) => (
          <Box marginBottom={index !== files.length - 1 ? 3 : 0} key={index}>
            <CaseFile
              fileId={file.id}
              name={`${index + 1}. ${file.name}`}
              size={file.size}
              uploadedAt={file.created}
              canOpenFiles={canOpenFiles}
              onOpen={handleOpenFile}
            />
          </Box>
        ))
      ) : (
        <Text>Engin rannsóknargögn fylgja kröfunni í Réttarvörslugátt.</Text>
      )}
    </>
  )
}

export default CaseFileList
