import React, { useMemo } from 'react'
import { useDropzone } from 'react-dropzone'

import * as styles from './InputFileUpload.treat'

import { Box } from '../Box'
import Typography from '../Typography/Typography'
import { Button } from '../Button/Button'
import { theme, Colors } from '@island.is/island-ui/theme'
import Icon, { IconTypes } from '../Icon/Icon'

export type UploadFileStatus = 'error' | 'done' | 'uploading'

export interface UploadFile {
  name: string
  url?: string
  key?: string
  status?: UploadFileStatus
  percent?: number
  originalFileObj?: File | Blob
  error?: string
}

export const fileToObject = (
  file: File,
  status?: UploadFileStatus,
): UploadFile => {
  return {
    name: file.name,
    percent: 0,
    originalFileObj: file,
    url: '',
    status: status || 'done',
  }
}

interface UploadingIndicatorProps {
  percent?: number
}

const UploadingIndicator = (
  { percent }: UploadingIndicatorProps = { percent: 0 },
) => {
  const isDoneUploading = percent === 100
  return (
    <Box
      position="absolute"
      left={0}
      borderRadius="large"
      display={isDoneUploading ? 'none' : 'block'}
      marginX={1}
      className={styles.uploadingIndicator}
      style={{ width: `${percent}%` }}
    />
  )
}

interface UploadedFileProps {
  file: UploadFile
  onRemoveClick: (file: UploadFile) => void
}

const UploadedFile = ({ file, onRemoveClick }: UploadedFileProps) => {
  const statusColor = (status?: UploadFileStatus): Colors => {
    switch (status) {
      case 'error':
        return 'red100'
      case 'done':
        return 'white'
      default:
        return 'transparent'
    }
  }

  const statusIcon = (status?: UploadFileStatus): IconTypes => {
    switch (status) {
      case 'error':
        return 'close'
      case 'done':
        return 'close'
      default:
        return 'loading'
    }
  }

  const isUploading =
    file.percent && file.percent < 100 && file.status === 'uploading'

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="spaceBetween"
      borderRadius="large"
      background={statusColor(file.status)}
      paddingX={2}
      paddingY={1}
      marginBottom={2}
      width="full"
      position="relative"
      className={styles.uploadedFile}
      onClick={(e) => e.stopPropagation()}
    >
      <Typography variant="pSmall">{file.name}</Typography>
      <Box
        cursor={!isUploading ? 'pointer' : undefined}
        onClick={(e) => {
          e.stopPropagation()
          if (!isUploading) onRemoveClick(file)
        }}
      >
        <Box className={isUploading ? styles.progressIconAnimation : undefined}>
          <Icon type={statusIcon(file.status)} />
        </Box>
      </Box>
      <UploadingIndicator percent={file.percent} />
    </Box>
  )
}

export interface InputFileUploadProps {
  name?: string
  id?: string
  header?: string
  description?: string
  buttonLabel?: string
  disabled?: boolean
  accept?: string | string[]
  multiple?: boolean
  fileList: UploadFile[]
  maxSize?: number
  onRemove: (file: any) => void
  onChange?: (files: File[]) => void
  errorMessage?: string
}

export const InputFileUpload = ({
  name,
  id,
  header = 'Dragðu skjöl hingað til að hlaða upp',
  description = 'Tekið er við skjölum með endingu: .pdf, .docx, .rtf',
  buttonLabel = 'Velja skjöl til að hlaða upp',
  disabled = false,
  accept,
  multiple = true,
  fileList,
  maxSize,
  onChange,
  onRemove,
  errorMessage,
}: InputFileUploadProps) => {
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0 || !onChange) return

    if (!multiple) {
      onChange(acceptedFiles.slice(0, 1))
      return
    }

    onChange(acceptedFiles)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    disabled,
    maxSize,
  })

  const style = useMemo(
    () => ({
      ...(isDragActive ? { borderColor: theme.color.blue400 } : {}),
    }),
    [isDragActive],
  )

  const ariaError = errorMessage
    ? {
        'aria-invalid': true,
        'aria-describedby': id,
      }
    : {}

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      borderRadius="standard"
      textAlign="center"
      padding={4}
      className={styles.container}
      {...getRootProps({ style })}
    >
      <Typography variant="h4">{header}</Typography>
      <Typography variant="p">{description}</Typography>
      <Box marginY={4}>
        <Button variant="blueGhost" icon="file">
          {buttonLabel}
        </Button>
      </Box>

      <Box width="full" paddingX={[2, 2, 12]}>
        {fileList.map((file, index) => (
          <UploadedFile key={index} file={file} onRemoveClick={onRemove} />
        ))}
      </Box>

      <input id={id} name={name} {...getInputProps()} {...ariaError} />

      {errorMessage && (
        <div className={styles.errorMessage} id={id}>
          {errorMessage}
        </div>
      )}
    </Box>
  )
}

export default InputFileUpload
