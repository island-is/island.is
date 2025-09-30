import { useCallback, useContext } from 'react'
import React from 'react'
import { useIntl } from 'react-intl'

import {
  FileUploadStatus,
  InputFileUpload,
  UploadFile,
} from '@island.is/island-ui/core'
import { CaseFileCategory, EventType } from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import {
  FormContext,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { FileWithPreviewURL } from '@island.is/judicial-system-web/src/components/UploadFiles/UploadFiles'
import {
  TUploadFile,
  useFileList,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'
import useEventLog from '@island.is/judicial-system-web/src/utils/hooks/useEventLog'

export const CriminalRecordUpdate = ({
  uploadFiles,
  addUploadFiles,
  updateUploadFile,
  removeUploadFile,
}: {
  uploadFiles: TUploadFile[]
  addUploadFiles: (
    files: FileWithPreviewURL[],
    overRides?: Partial<TUploadFile>,
    setUserGeneratedFilename?: boolean,
  ) => TUploadFile[]
  updateUploadFile: (file: TUploadFile, newId?: string) => void
  removeUploadFile: (file: TUploadFile) => void
}) => {
  const { formatMessage } = useIntl()
  const { workingCase } = useContext(FormContext)

  const { handleUpload, handleRemove } = useS3Upload(workingCase.id)
  const { createEventLog } = useEventLog()

  const { onOpenFile } = useFileList({
    caseId: workingCase.id,
  })

  const isSentToPublicProsecutor = Boolean(
    workingCase.indictmentSentToPublicProsecutorDate,
  )

  const handleCriminalRecordUpdateUpload = useCallback(
    async (files: File[]) => {
      // If the case has been sent to the public prosecutor
      // we want to complete these uploads straight away
      if (isSentToPublicProsecutor) {
        const uploadResult = await handleUpload(
          addUploadFiles(files, {
            category: CaseFileCategory.CRIMINAL_RECORD_UPDATE,
          }),
          updateUploadFile,
        )
        if (uploadResult !== 'ALL_SUCCEEDED') {
          return
        }

        // TODO: Make sure to log an event if at least one file was uploaded
        const eventLogCreated = createEventLog({
          caseId: workingCase.id,
          eventType: EventType.INDICTMENT_CRIMINAL_RECORD_UPDATED_BY_COURT,
        })
        if (!eventLogCreated) {
          return
        }
      }
      // Otherwise we don't complete uploads until
      // we handle the next button click
      else {
        addUploadFiles(files, {
          category: CaseFileCategory.CRIMINAL_RECORD_UPDATE,
          status: FileUploadStatus.done,
        })
      }
    },
    [
      workingCase.id,
      addUploadFiles,
      handleUpload,
      isSentToPublicProsecutor,
      updateUploadFile,
      createEventLog,
    ],
  )

  const handleRemoveFile = useCallback(
    (file: UploadFile) => {
      if (file.key) {
        handleRemove(file, removeUploadFile)
      } else {
        removeUploadFile(file)
      }
    },
    [handleRemove, removeUploadFile],
  )

  return (
    <>
      <SectionHeading title="Tilkynning til sakaskrár" />
      <InputFileUpload
        name="criminalRecordUpdate"
        files={uploadFiles.filter(
          (file) => file.category === CaseFileCategory.CRIMINAL_RECORD_UPDATE,
        )}
        accept="application/pdf"
        title={formatMessage(core.uploadBoxTitle)}
        buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
        description={formatMessage(core.uploadBoxDescription, {
          fileEndings: '.pdf',
        })}
        onChange={handleCriminalRecordUpdateUpload}
        onRemove={handleRemoveFile}
        onOpenFile={(file) => onOpenFile(file)}
      />
    </>
  )
}
