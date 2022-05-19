import React from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'
import {
  Box,
  StatusColor,
  Text,
  UploadedFile,
  UploadFile,
} from '@island.is/island-ui/core'
import {
  CaseFile as TCaseFile,
  CaseFileState,
} from '@island.is/judicial-system/types'
import { caseFiles as m } from '@island.is/judicial-system-web/messages'
import { Modal } from '..'
import { useFileList } from '../../utils/hooks'
import { CaseFile, CaseFileStatus } from '../../utils/hooks/useCourtUpload'

interface Props {
  caseId: string
  files: TCaseFile[]
  hideIcons?: boolean
  canOpenFiles?: boolean
  handleRetryClick?: (id: string) => void
  isCaseCompleted: boolean
}

const getBackgroundColor = (status: CaseFileStatus): StatusColor => {
  if (status === 'broken') return { background: 'dark100', border: 'dark200' }

  return { background: 'blue100', border: 'blue300' }
}

const CaseFileList: React.FC<Props> = (props) => {
  const {
    caseId,
    files,
    hideIcons = true,
    canOpenFiles = true,
    handleRetryClick,
    isCaseCompleted,
  } = props

  const { handleOpenFile, fileNotFound, dismissFileNotFound } = useFileList({
    caseId,
  })
  const { formatMessage } = useIntl()

  const xFiles = [...files] as CaseFile[]

  if (xFiles.length <= 0) {
    return <Text>{formatMessage(m.noFilesFound)}</Text>
  }

  return (
    <>
      {xFiles.map((file, index) => (
        <Box
          marginBottom={
            index === xFiles.length - 1 || file.status === 'unsupported' ? 0 : 3
          }
          key={`${file.id}-${index}`}
        >
          <UploadedFile
            file={
              {
                ...file,
                status: file.status === 'unsupported' ? 'error' : file.status,
              } as TCaseFile
            }
            showFileSize={true}
            defaultBackgroundColor={getBackgroundColor(file.status)}
            doneIcon="checkmark"
            hideIcons={
              hideIcons || (file.status !== 'done' && file.status !== 'error')
            }
            onOpenFile={
              canOpenFiles &&
              file.key &&
              !(isCaseCompleted && file.state === CaseFileState.STORED_IN_COURT)
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
          {file.status === 'unsupported' && (
            <Text color="red600" variant="eyebrow" lineHeight="lg">
              {formatMessage(m.fileUnsupportedInCourt)}
            </Text>
          )}
        </Box>
      ))}
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
  )
}

export default CaseFileList
