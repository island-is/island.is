import React, { useMemo } from 'react'
import { useDropzone } from 'react-dropzone'

import * as styles from './InputFileUpload.treat'

import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { Button } from '../Button/Button'
import { theme, Colors } from '@island.is/island-ui/theme'
import { Icon } from '../IconRC/Icon'
import { Icon as IconTypes } from '../IconRC/iconMap'

export type UploadFileStatus = 'error' | 'done' | 'uploading'

export interface UploadFile {
  name: string
  url?: string
  uploadKey?: string
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
        return 'reload'
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
      <Text variant="small">{file.name}</Text>
      <Box
        cursor={!isUploading ? 'pointer' : undefined}
        onClick={(e) => {
          e.stopPropagation()
          if (!isUploading) onRemoveClick(file)
        }}
      >
        <Box className={isUploading ? styles.progressIconAnimation : undefined}>
          <Icon color="blue400" icon={statusIcon(file.status)} />
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
  onRemove: (file: UploadFile) => void
  onChange?: (files: File[]) => void
  errorMessage?: string
}

export const InputFileUpload = ({
  name,
  id,
  header,
  description,
  buttonLabel,
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
      <Text variant="h4">{header}</Text>
      <Text>{description}</Text>
      <Box marginY={4}>
        <Button variant="ghost" icon="attach">
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
