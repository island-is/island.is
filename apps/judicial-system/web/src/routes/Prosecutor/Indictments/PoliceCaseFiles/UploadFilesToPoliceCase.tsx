import { FC, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import _isEqual from 'lodash/isEqual'

import { FileUploadStatus, InputFileUpload } from '@island.is/island-ui/core'
import { errors as errorMessages } from '@island.is/judicial-system-web/messages'
import { Item } from '@island.is/judicial-system-web/src/components'
import {
  CaseFile,
  CaseFileCategory,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  TUploadFile,
  useFileList,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import {
  mapPoliceCaseFileToPoliceCaseFileCheck,
  PoliceCaseFileCheck,
  PoliceCaseFiles,
  PoliceCaseFilesData,
} from '../../components'
import { strings } from './PoliceCaseFilesRoute.strings'

interface UploadFilesToPoliceCaseProps {
  caseId: string
  policeCaseNumber: string
  setAllUploaded: (allUploaded: boolean) => void
  caseFiles: CaseFile[]
  policeCaseFilesData: PoliceCaseFilesData
}

const UploadFilesToPoliceCase: FC<UploadFilesToPoliceCaseProps> = ({
  caseId,
  policeCaseNumber,
  setAllUploaded,
  caseFiles,
  policeCaseFilesData,
}) => {
  const { formatMessage } = useIntl()
  const {
    uploadFiles,
    allFilesDoneOrError,
    addUploadFile,
    addUploadFiles,
    updateUploadFile,
    removeUploadFile,
  } = useUploadFiles(caseFiles)
  const { handleUpload, handleUploadFromPolice, handleRetry, handleRemove } =
    useS3Upload(caseId)
  const { onOpenFile } = useFileList({
    caseId,
  })

  const [isUploadingPoliceCaseFiles, setIsUploadingPoliceCaseFiles] =
    useState<boolean>(false)
  const [policeCaseFileList, setPoliceCaseFileList] = useState<
    PoliceCaseFileCheck[]
  >([])

  const errorMessage = useMemo(() => {
    if (uploadFiles.some((file) => file.status === FileUploadStatus.error)) {
      return formatMessage(errorMessages.general)
    }
    if (uploadFiles.some((file) => file.size === 0)) {
      return 'Villa kom upp. Tómt skjal.'
    } else {
      return undefined
    }
  }, [uploadFiles, formatMessage])

  useEffect(() => {
    setAllUploaded(allFilesDoneOrError && !isUploadingPoliceCaseFiles)
  }, [allFilesDoneOrError, isUploadingPoliceCaseFiles, setAllUploaded])

  useEffect(() => {
    if (policeCaseFilesData.files?.length === 0) {
      return
    }

    setPoliceCaseFileList(
      policeCaseFilesData.files
        ?.filter(
          (file) =>
            !caseFiles.some((caseFile) => caseFile.policeFileId === file.id),
        )
        .map(mapPoliceCaseFileToPoliceCaseFileCheck) ?? [],
    )
  }, [caseFiles, policeCaseFilesData.files, policeCaseNumber])

  const uploadPoliceCaseFileCallback = (file: TUploadFile, id?: string) => {
    if (id) {
      addUploadFile({ ...file, id: id ?? file.id })
    }

    setPoliceCaseFileList((previous) =>
      id
        ? previous.filter((p) => p.id !== file.id)
        : previous.map((p) =>
            p.id === file.id ? { ...p, checked: false } : p,
          ),
    )
  }

  const removeFileCB = (file: TUploadFile) => {
    const policeCaseFile = policeCaseFilesData.files.find(
      (f) => f.id === file.policeFileId,
    )

    if (policeCaseFile) {
      setPoliceCaseFileList((previous) => [
        mapPoliceCaseFileToPoliceCaseFileCheck(policeCaseFile),
        ...previous,
      ])
    }

    removeUploadFile(file)
  }

  const onPoliceCaseFileUpload = async (selectedFiles: Item[]) => {
    let currentChapter: number | undefined | null
    let currentOrderWithinChapter: number | undefined | null

    const getCategory = (file: PoliceCaseFileCheck) => {
      switch (file.type) {
        case 'RVSK':
          return CaseFileCategory.COST_BREAKDOWN
        case 'REIKN':
          return CaseFileCategory.CASE_FILE
        default:
          return CaseFileCategory.CASE_FILE_RECORD
      }
    }

    const filesToUpload = policeCaseFileList
      .filter((p) => selectedFiles.some((f) => f.id === p.id))
      .sort((p1, p2) => (p1.chapter ?? -1) - (p2.chapter ?? -1))
      .map((f) => {
        if (
          f.chapter !== undefined &&
          f.chapter !== null &&
          f.chapter !== currentChapter
        ) {
          currentChapter = f.chapter
          currentOrderWithinChapter = Math.max(
            -1,
            ...caseFiles
              .filter((p) => p.chapter === currentChapter)
              .map((p) => p.orderWithinChapter ?? -1),
          )
        }

        return {
          id: f.id,
          name: f.name,
          type: 'application/pdf',
          category: getCategory(f),
          policeCaseNumber: f.policeCaseNumber,
          chapter: f.chapter ?? undefined,
          orderWithinChapter:
            currentOrderWithinChapter !== undefined &&
            currentOrderWithinChapter !== null
              ? ++currentOrderWithinChapter
              : undefined,
          displayDate: f.displayDate ?? undefined,
          policeFileId: f.id,
          policeType: f.type,
        }
      })

    setIsUploadingPoliceCaseFiles(true)

    await handleUploadFromPolice(filesToUpload, uploadPoliceCaseFileCallback)

    setIsUploadingPoliceCaseFiles(false)
  }

  return (
    <section className={grid({ gap: 5 })}>
      <PoliceCaseFiles
        onUpload={onPoliceCaseFileUpload}
        policeCaseFileList={policeCaseFileList}
        policeCaseFiles={policeCaseFilesData}
      />
      <InputFileUpload
        name="fileUpload"
        files={uploadFiles}
        accept="application/pdf"
        title={formatMessage(strings.inputFileUpload.header)}
        description={formatMessage(strings.inputFileUpload.description)}
        buttonLabel={formatMessage(strings.inputFileUpload.buttonLabel)}
        onChange={(files) =>
          handleUpload(
            addUploadFiles(files, {
              category: CaseFileCategory.CASE_FILE_RECORD,
              policeCaseNumber,
            }),
            updateUploadFile,
          )
        }
        onOpenFile={(file) => onOpenFile(file)}
        onRemove={(file) => handleRemove(file, removeFileCB)}
        onRetry={(file) => handleRetry(file, updateUploadFile)}
        errorMessage={errorMessage}
      />
    </section>
  )
}

export default UploadFilesToPoliceCase
