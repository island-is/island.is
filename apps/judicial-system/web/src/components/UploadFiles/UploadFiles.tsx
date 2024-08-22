import { FC, useCallback, useContext } from 'react'
import { useDropzone } from 'react-dropzone'
import { useIntl } from 'react-intl'

import { Box, Button, Text, UploadFile } from '@island.is/island-ui/core'

import { TUploadFile, useFileList } from '../../utils/hooks'
import EditableCaseFile, {
  TEditableCaseFile,
} from '../EditableCaseFile/EditableCaseFile'
import { FormContext } from '../FormProvider/FormProvider'
import { strings } from './UploadFiles.strings'
import * as styles from './UploadFiles.css'

interface Props {
  files: UploadFile[]
  onChange: (files: File[]) => void
  onRetry: (file: TUploadFile) => void
  onDelete: (file: TUploadFile) => void
  onRename: (fileId: string, newName?: string, newDisplayDate?: string) => void
}

const UploadFiles: FC<Props> = (props) => {
  const { files, onChange, onRetry, onDelete, onRename } = props
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()

  const { onOpen } = useFileList({ caseId: workingCase.id })

  const mapUpdateFileToEditableCaseFile = (
    file: UploadFile,
  ): TEditableCaseFile => ({
    ...file,
    displayText: file.name,
    displayDate: new Date().toISOString(),
  })

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
            onRename={onRename}
            onDelete={onDelete}
            onRetry={onRetry}
          />
        </Box>
      ))}
      <input {...getInputProps()} />
    </div>
  )
}

export default UploadFiles
