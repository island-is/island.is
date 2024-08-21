import { FC, useCallback, useContext, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useIntl } from 'react-intl'
import isValid from 'date-fns/isValid'
import parseISO from 'date-fns/parseISO'

import { Box, Button, Text, toast, UploadFile } from '@island.is/island-ui/core'

import { CaseFileCategory } from '../../graphql/schema'
import {
  TUploadFile,
  useFileList,
  useS3Upload,
  useUploadFiles,
} from '../../utils/hooks'
import { EditableCaseFile as TEditableCaseFile } from '../AccordionItems/IndictmentsCaseFilesAccordionItem/IndictmentsCaseFilesAccordionItem'
import { useUpdateFilesMutation } from '../AccordionItems/IndictmentsCaseFilesAccordionItem/updateFiles.generated'
import EditableCaseFile from '../EditableCaseFile/EditableCaseFile'
import { FormContext } from '../FormProvider/FormProvider'
import { strings } from './UploadFiles.strings'
import * as styles from './UploadFiles.css'

interface Props {
  files: UploadFile[]
  onChange: (files: File[]) => void
}

const UploadFiles: FC<Props> = (props) => {
  const { files, onChange } = props
  const [fileList, setFileList] = useState<TEditableCaseFile[]>([])
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()

  const { onOpen } = useFileList({ caseId: workingCase.id })
  const { handleRemove, handleRetry } = useS3Upload(workingCase.id)
  const { updateUploadFile } = useUploadFiles(workingCase.caseFiles)
  const [updateFilesMutation] = useUpdateFilesMutation()

  const mapUpdateFileToEditableCaseFile = (
    file: UploadFile,
  ): TEditableCaseFile => ({
    ...file,
    displayText: file.name,
    displayDate: new Date().toISOString(),
  })

  useEffect(() => {
    setFileList(files)
  }, [files])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles)
    },
    [onChange],
  )

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: 'application/pdf',
    onDrop,
  })

  const handleDelete = (id: string) => {
    handleRemove({ id } as TUploadFile, (file) => {
      setFileList((prev) => prev.filter((item) => item.id !== file.id))
    })
  }

  const handleRename = async (
    fileId: string,
    newName?: string,
    newDisplayDate?: string,
  ) => {
    let newDate: Date | null = null
    const fileInReorderableItems = fileList.findIndex(
      (item) => item.id === fileId,
    )

    if (fileInReorderableItems === -1) {
      return
    }

    if (newDisplayDate) {
      const [day, month, year] = newDisplayDate.split('.')
      newDate = parseISO(`${year}-${month}-${day}`)

      if (!isValid(newDate)) {
        toast.error(formatMessage(strings.invalidDateErrorMessage))
        return
      }
    }

    setFileList((prev) => {
      const newReorderableItems = [...prev]
      newReorderableItems[fileInReorderableItems].userGeneratedFilename =
        newName
      newReorderableItems[fileInReorderableItems].displayDate = newDate
        ? newDate.toISOString()
        : newReorderableItems[fileInReorderableItems].displayDate

      return newReorderableItems
    })

    const { errors } = await updateFilesMutation({
      variables: {
        input: {
          caseId: workingCase.id,
          files: [
            {
              id: fileId,
              userGeneratedFilename: newName,
              ...(newDate && { displayDate: newDate.toISOString() }),
            },
          ],
        },
      },
    })

    if (errors) {
      toast.error(formatMessage(strings.renameFailedErrorMessage))
    }
  }

  return (
    <div className={styles.container} {...getRootProps}>
      <Box marginBottom={1}>
        <Text variant="h4" as="h4">
          {formatMessage(strings.heading)}
        </Text>
      </Box>
      <Box marginBottom={2}>
        <Text>{formatMessage(strings.acceptFiles)}</Text>
      </Box>
      <Box marginBottom={3}>
        <Button
          variant="ghost"
          size="small"
          icon="attach"
          onClick={() => open()}
        >
          {formatMessage(strings.buttonText)}
        </Button>
      </Box>
      {files.map((file) => (
        <Box key={file.id} marginBottom={1} width="full">
          <EditableCaseFile
            enableDrag={false}
            caseFile={mapUpdateFileToEditableCaseFile(file)}
            onOpen={onOpen}
            onRename={handleRename}
            onDelete={handleDelete}
            onRetry={(file) => handleRetry(file, updateUploadFile)}
          />
        </Box>
      ))}
      <input {...getInputProps()} />
    </div>
  )
}

export default UploadFiles
