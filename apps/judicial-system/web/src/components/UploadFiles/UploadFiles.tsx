import { FC, useCallback, useContext, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useIntl } from 'react-intl'
import isValid from 'date-fns/isValid'
import parseISO from 'date-fns/parseISO'

import { Box, Button, Text, toast } from '@island.is/island-ui/core'

import { TUploadFile, useFileList, useS3Upload } from '../../utils/hooks'
import { useUpdateFilesMutation } from '../AccordionItems/IndictmentsCaseFilesAccordionItem/updateFiles.generated'
import EditableCaseFile from '../EditableCaseFile/EditableCaseFile'
import { FormContext } from '../FormProvider/FormProvider'
import { strings } from './UploadFiles.strings'
import * as styles from './UploadFiles.css'

export interface UploadFile {
  id: string
  created?: string | null
  displayText?: string | null
  userGeneratedFilename?: string | null
  displayDate?: string | null
  canOpen?: boolean
}
interface Props {
  files: UploadFile[]
}

const UploadFiles: FC<Props> = (props) => {
  const { files } = props
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()

  const { onOpen } = useFileList({ caseId: workingCase.id })
  const { handleRemove, update } = useS3Upload(workingCase.id)
  const [updateFilesMutation] = useUpdateFilesMutation()

  useEffect(() => {
    setFileList(files)
  }, [files])

  const mapFileToUploadFile = (files: File[]): UploadFile[] => {
    return files.map((file) => ({
      id: file.name,
      displayText: file.name,
      created: new Date().toISOString(),
    }))
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      update(acceptedFiles)
      setFileList((prev) => [...prev, ...mapFileToUploadFile(acceptedFiles)])
    },
    [update],
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

  console.log(fileList)
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
      {fileList.map((file) => (
        <Box key={file.id} marginBottom={1} width="full">
          <EditableCaseFile
            enableDrag={false}
            caseFile={file}
            onOpen={onOpen}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        </Box>
      ))}
      <input {...getInputProps()} />
    </div>
  )
}

export default UploadFiles
