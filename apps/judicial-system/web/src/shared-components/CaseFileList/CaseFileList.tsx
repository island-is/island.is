import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { CaseFile as TCaseFile } from '@island.is/judicial-system/types'
import { CaseFile, Modal } from '..'
import { useFileList } from '../../utils/hooks'
import { AnimatePresence } from 'framer-motion'

interface Props {
  caseId: string
  files: TCaseFile[]
  canOpenFiles?: boolean
}

const CaseFileList: React.FC<Props> = (props) => {
  const { caseId, files, canOpenFiles = true } = props

  const { handleOpenFile, fileNotFound, dismissFileNotFound } = useFileList({
    caseId,
  })

  return files.length > 0 ? (
    <>
      {files.map((file, index) => (
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
      ))}
      <AnimatePresence>
        {fileNotFound && (
          <Modal
            title="Skjalið er ekki lengur aðgengilegt í Réttarvörslugátt"
            text="Rannsóknargögnum er eytt sjálfkrafa að loknum kærufresti."
            handleClose={() => dismissFileNotFound()}
            handlePrimaryButtonClick={() => dismissFileNotFound()}
            primaryButtonText="Loka glugga"
          />
        )}
      </AnimatePresence>
    </>
  ) : (
    <Text>Engin rannsóknargögn fylgja kröfunni í Réttarvörslugátt.</Text>
  )
}

export default CaseFileList
