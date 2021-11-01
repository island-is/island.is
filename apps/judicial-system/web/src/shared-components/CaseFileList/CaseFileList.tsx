import React from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'
import { Box, Text, UploadedFile, UploadFile } from '@island.is/island-ui/core'
import {
  CaseFile as TCaseFile,
  CaseFileState,
} from '@island.is/judicial-system/types'
import { Modal } from '..'
import { useFileList } from '../../utils/hooks'
import { caseFiles as m } from '@island.is/judicial-system-web/messages/Core/caseFiles'
import { CaseFile } from '../../utils/hooks/useCourtUpload'

interface Props {
  caseId: string
  files: TCaseFile[]
  hideIcons?: boolean
  canOpenFiles?: boolean
  handleRetryClick?: (id: string) => void
}

const CaseFileList: React.FC<Props> = (props) => {
  const {
    caseId,
    files,
    hideIcons = true,
    canOpenFiles = true,
    handleRetryClick,
  } = props

  const { handleOpenFile, fileNotFound, dismissFileNotFound } = useFileList({
    caseId,
  })
  const { formatMessage } = useIntl()

  const xFiles = files as CaseFile[]

  return xFiles.length > 0 ? (
    <>
      {xFiles.map((file, index) => {
        return (
          <Box marginBottom={index !== xFiles.length - 1 ? 3 : 0} key={index}>
            <UploadedFile
              file={file as TCaseFile}
              showFileSize={true}
              defaultBackgroundColor={
                file.state === CaseFileState.BOKEN_LINK ? 'dark100' : 'blue100'
              }
              doneIcon="checkmark"
              hideIcons={
                hideIcons ||
                file.state === CaseFileState.BOKEN_LINK ||
                (file.state === CaseFileState.STORED_IN_RVG &&
                  file.status !== 'error')
              }
              onOpenFile={
                canOpenFiles && file.state === CaseFileState.STORED_IN_RVG
                  ? (file: UploadFile) => {
                      if (file.id) {
                        handleOpenFile(file.id)
                      }
                    }
                  : undefined
              }
              onRemoveClick={() =>
                canOpenFiles ? handleOpenFile(file.id) : null
              }
              onRetryClick={() => handleRetryClick && handleRetryClick(file.id)}
            />
          </Box>
        )
      })}
      <AnimatePresence>
        {fileNotFound && (
          <Modal
            title={formatMessage(m.modal.fileNotFound.title)}
            text={formatMessage(m.modal.fileNotFound.text)}
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
