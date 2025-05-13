import { Dispatch, FC, SetStateAction, useCallback, useContext } from 'react'
import { useDropzone } from 'react-dropzone'
import { useIntl } from 'react-intl'

import { Box, Button, Text } from '@island.is/island-ui/core'

import { TUploadFile, useFileList } from '../../utils/hooks'
import EditableCaseFile from '../EditableCaseFile/EditableCaseFile'
import { FormContext } from '../FormProvider/FormProvider'
import { strings } from './UploadFiles.strings'
import * as styles from './UploadFiles.css'

interface Props {
  files: TUploadFile[]
  onChange: (files: File[]) => void
  onRetry?: (file: TUploadFile) => void
  onDelete: (file: TUploadFile) => void
  onRename: (fileId: string, newName: string, newDisplayDate: string) => void
  setEditCount: Dispatch<SetStateAction<number>>
  isBottomComponent?: boolean
}

const UploadFiles: FC<Props> = (props) => {
  const {
    files,
    onChange,
    onRetry,
    onDelete,
    onRename,
    setEditCount,
    isBottomComponent,
  } = props
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()

  const { onOpen } = useFileList({ caseId: workingCase.id })

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles)
    },
    [onChange],
  )

  const { getRootProps, getInputProps } = useDropzone({
    accept: ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'],
    onDrop,
  })

  return (
    <div
      className={`${styles.container} ${
        !isBottomComponent ? styles.bottomContainer : ''
      }`}
      {...getRootProps()}
    >
      <Box marginBottom={1}>
        <Text variant="h4" as="h4">
          {formatMessage(strings.heading)}
        </Text>
      </Box>
      <Box marginBottom={2}>
        <Text>Tekið er við skjölum með endingu: .pdf, .png, .jpg, .jpeg</Text>
      </Box>
      <Box marginBottom={3}>
        <Button variant="ghost" size="small" icon="attach">
          {formatMessage(strings.buttonText)}
        </Button>
      </Box>
      {files.map((file) => (
        <Box
          marginBottom={1}
          width="full"
          key={file.id}
          onClick={(event) => event.stopPropagation()}
        >
          <EditableCaseFile
            enableDrag={false}
            caseFile={{
              ...file,
              id: file.id ?? '',
              canEdit: file.percent === 0,
            }}
            onOpen={onOpen}
            onRename={onRename}
            onDelete={onDelete}
            onRetry={onRetry}
            onStartEditing={() => setEditCount((count) => count + 1)}
            onStopEditing={() => setEditCount((count) => count - 1)}
          />
        </Box>
      ))}
      <input {...getInputProps()} />
    </div>
  )
}

export default UploadFiles
