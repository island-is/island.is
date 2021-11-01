import React, { useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import cn from 'classnames'

import * as styles from './InputFileUpload.css'

import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { Button } from '../Button/Button'
import { theme, Colors } from '@island.is/island-ui/theme'
import { Icon } from '../IconRC/Icon'
import { Icon as IconTypes } from '../IconRC/iconMap'
import { useMeasure } from 'react-use'

export type UploadFileStatus = 'error' | 'done' | 'uploading'

export interface UploadFile {
  name: string
  type?: string
  id?: string
  key?: string
  status?: UploadFileStatus
  percent?: number
  originalFileObj?: File | Blob
  error?: string
  size?: number
}

export const fileToObject = (
  file: File,
  status?: UploadFileStatus,
): UploadFile => {
  return {
    name: file.name,
    type: file.type,
    percent: 0,
    originalFileObj: file,
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
  showFileSize: boolean
  onRemoveClick: (file: UploadFile) => void
  onRetryClick?: (file: UploadFile) => void
  onOpenFile?: (file: UploadFile) => void
  defaultBackgroundColor?: Colors
  doneIcon?: IconTypes
  hideIcons?: boolean
}

export const UploadedFile = ({
  file,
  showFileSize,
  defaultBackgroundColor,
  doneIcon,
  onRemoveClick,
  onRetryClick,
  onOpenFile,
  hideIcons = false,
}: UploadedFileProps) => {
  const [ref, { width }] = useMeasure()

  const statusColor = (status?: UploadFileStatus): Colors => {
    switch (status) {
      case 'error':
        return 'red100'
      case 'done':
        return 'blue100'
      default:
        return defaultBackgroundColor ?? 'transparent'
    }
  }

  const statusIcon = (status?: UploadFileStatus): IconTypes => {
    switch (status) {
      case 'error':
        return 'close'
      case 'done':
        return doneIcon ?? 'close'
      default:
        return 'reload'
    }
  }

  const kb = (bytes?: number) => {
    return bytes ? Math.ceil(bytes / 1024) : ''
  }

  const truncateInMiddle = (str: string) => {
    if (str.length > 70) {
      const nrOfCharacters = width / 25
      return `${str.slice(0, nrOfCharacters)}...${str.slice(-nrOfCharacters)}`
    } else {
      return str
    }
  }

  const isUploading =
    file.percent && file.percent < 100 && file.status === 'uploading'

  console.log(file)
  return (
    <Box
      ref={ref}
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
      title={file.name}
      aria-label={onOpenFile ? `Opna ${file.name}` : undefined}
      className={cn(styles.uploadedFile, {
        [styles.canOpenFiles]: onOpenFile,
      })}
      onClick={(e) => {
        e.stopPropagation()

        if (onOpenFile) {
          onOpenFile(file)
        }
      }}
    >
      <Text truncate fontWeight="semiBold">
        <Box className={{ [styles.fileName]: onOpenFile }}>
          {truncateInMiddle(file.name)}
          {showFileSize && file.size && (
            <Text as="span">{` (${kb(file.size)}KB)`}</Text>
          )}
          {onOpenFile && (
            <Box component="span" marginLeft={1}>
              <Icon icon="open" type="outline" size="small" />
            </Box>
          )}
        </Box>
      </Text>
      {!hideIcons && (
        <Box display="flex">
          {isUploading ? (
            <div
              className={styles.progressIconAnimation}
              aria-label="Hleð upp skrá"
            >
              <Icon color="blue400" icon={statusIcon(file.status)} />
            </div>
          ) : file.status === 'error' && onRetryClick ? (
            <button
              type={'button'}
              onClick={(e) => {
                e.stopPropagation()
                if (!isUploading) {
                  onRetryClick(file)
                }
              }}
              aria-label="Reyna aftur"
            >
              <Icon color="blue400" icon="reload" />
            </button>
          ) : (
            <button
              type={'button'}
              onClick={(e) => {
                e.stopPropagation()
                if (!isUploading) {
                  onRemoveClick(file)
                }
              }}
              aria-label="Fjarlægja skrá"
            >
              <Icon color="blue400" icon={statusIcon(file.status)} />
            </button>
          )}
        </Box>
      )}
      {file.percent && <UploadingIndicator percent={file.percent} />}
    </Box>
  )
}

export interface InputFileUploadProps {
  name?: string
  showFileSize?: boolean
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
  onRetry?: (file: UploadFile) => void
  onChange?: (files: File[]) => void
  errorMessage?: string
  defaultFileBackgroundColor?: Colors
  doneIcon?: IconTypes
  hideIcons?: boolean
}

export const InputFileUpload = ({
  name,
  showFileSize = false,
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
  onRetry,
  errorMessage,
  defaultFileBackgroundColor,
  doneIcon,
  hideIcons = false,
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
          <UploadedFile
            key={index}
            file={file}
            showFileSize={showFileSize}
            defaultBackgroundColor={defaultFileBackgroundColor}
            doneIcon={doneIcon}
            onRemoveClick={onRemove}
            onRetryClick={onRetry}
            hideIcons={hideIcons}
          />
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
