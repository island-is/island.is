import React, { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'

import type { UploadFile } from '@island.is/island-ui/core'
import { FileUploadStatus, InputFileUpload } from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'
import {
  FormContext,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import type { FileWithPreviewURL } from '@island.is/judicial-system-web/src/components/UploadFiles/UploadFiles'
import {
  CaseFileCategory,
  EventType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import type { TUploadFile } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  useFileList,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'
import useEventLog from '@island.is/judicial-system-web/src/utils/hooks/useEventLog'
import { isSentToPublicProsecutor } from '@island.is/judicial-system-web/src/utils/utils'

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

  // Same rule as the parent uses for its send button, so a reopened or
  // corrected case stages the files for the next send rather than uploading
  // them straight away
  const sentToPublicProsecutor = isSentToPublicProsecutor(workingCase)

  const handleCriminalRecordUpdateUpload = useCallback(
    async (files: File[]) => {
      // If the case has been sent to the public prosecutor
      // we want to complete these uploads straight away
      if (sentToPublicProsecutor) {
        const uploadResult = await handleUpload(
          addUploadFiles(files, {
            category: CaseFileCategory.CRIMINAL_RECORD_UPDATE,
          }),
          updateUploadFile,
        )

        if (uploadResult === 'NONE_SUCCEEDED') {
          return
        }

        // At least one file is now on the case. This event is what tells the
        // criminal records office about it, so it has to be logged even when
        // some of the files failed.
        await createEventLog({
          caseId: workingCase.id,
          eventType: EventType.INDICTMENT_CRIMINAL_RECORD_UPDATED_BY_COURT,
        })
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
      sentToPublicProsecutor,
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
