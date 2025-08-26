import cn from 'classnames'
import React, { FC, useMemo } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'

import { Colors, theme } from '@island.is/island-ui/theme'

import { Box } from '../Box/Box'
import { Button } from '../Button/Button'
import { Text } from '../Text/Text'
import { Icon } from '../IconRC/Icon'
import { Icon as IconTypes } from '../IconRC/iconMap'
import * as styles from './InputFileUpload.css'

export enum FileUploadStatus {
  'error',
  'done',
  'uploading',
}

export type StatusColor = {
  background: Colors
  border: Colors
  icon?: Colors
}

export interface UploadFile {
  name: string
  id?: string
  type?: string
  key?: string
  status?: FileUploadStatus
  percent?: number
  originalFileObj?: File | Blob
  error?: string
  size?: number
}

interface UploadingIndicatorProps {
  percent?: number
}

const UploadingIndicator: FC<UploadingIndicatorProps> = (props) => {
  const { percent } = props
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

interface Icons {
  remove: IconTypes
  retry: IconTypes
  uploading: IconTypes
  done: IconTypes
}

interface UploadedFileProps {
  file: UploadFile
  defaultBackgroundColor?: StatusColor
  icons?: Icons
  hideIcons?: boolean
  onRemoveClick?: (file: UploadFile) => void
  onRetryClick?: (file: UploadFile) => void
  onOpenFile?: (file: UploadFile) => void
}

export const UploadedFile: FC<UploadedFileProps> = (props) => {
  const {
    file,
    defaultBackgroundColor,
    hideIcons,
    onRemoveClick,
    onRetryClick,
    onOpenFile,
    icons = {
      remove: 'close',
      retry: 'reload',
      uploading: 'reload',
      done: 'checkmark',
    },
  } = props

  const handleClick = (
    evt: React.MouseEvent<HTMLElement, MouseEvent>,
    handler?: (file: UploadFile) => void,
  ) => {
    evt.stopPropagation()

    if (handler) handler(file)
  }

  const truncateMiddle = (fileName: string) => {
    const maxLength = 40
    if (fileName.length <= maxLength) return fileName

    const ellipsis = '...'
    const keepLength = maxLength - ellipsis.length
    const start = Math.ceil(keepLength / 2)
    const end = fileName.length - Math.floor(keepLength / 2)

    return `${fileName.slice(0, start)}${ellipsis}${fileName.slice(end)}`
  }

  const formatFileSize = (bytes: number) => {
    const kb = 1024
    const mb = kb * 1024
    const gb = mb * 1024

    if (bytes < kb) {
      return `${bytes}B`
    } else if (bytes < mb) {
      return `${(bytes / kb).toFixed(2)}KB`
    } else if (bytes < gb) {
      return `${(bytes / mb).toFixed(2)}MB`
    } else {
      return `${(bytes / gb).toFixed(2)}GB`
    }
  }

  const statusColor: StatusColor = useMemo<StatusColor>(() => {
    switch (file.status) {
      case FileUploadStatus.error:
        return { background: 'red100', border: 'red200', icon: 'red600' }
      case FileUploadStatus.done:
        // Display an error color if the file is empty
        if (file.size === 0) {
          return { background: 'red100', border: 'red200', icon: 'red600' }
        }

        return {
          background: 'blue100',
          border: 'blue200',
          icon: 'blue400',
        }
      default:
        return (
          defaultBackgroundColor ?? {
            background: 'transparent',
            border: 'blue200',
            icon: 'blue400',
          }
        )
    }
  }, [file.status, file.size, defaultBackgroundColor])

  const isUploading =
    file.percent !== undefined &&
    file.percent < 100 &&
    file.status === FileUploadStatus.uploading

  return (
    <Box
      width="full"
      position="relative"
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="spaceBetween"
      borderRadius="large"
      borderStyle="solid"
      borderWidth="standard"
      borderColor={statusColor.border}
      background={statusColor.background}
      paddingX={2}
      paddingY={1}
      className={cn(styles.uploadedFile, {
        [styles.canOpenFiles]: onOpenFile,
      })}
      onClick={(evt) => handleClick(evt, onOpenFile)}
      title={file.name}
      aria-label={onOpenFile ? `Opna ${file.name}` : undefined}
    >
      <Text fontWeight="semiBold">
        <Box component="span" className={{ [styles.fileName]: onOpenFile }}>
          {truncateMiddle(file.name)}
          {typeof file.size === 'number' && !isNaN(file.size) && (
            <Text as="span">{` ${formatFileSize(file.size)}`}</Text>
          )}
          {onOpenFile && (
            <Box component="span" marginLeft={1}>
              {' '}
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
              <Icon color="blue400" icon={icons.uploading} />
            </div>
          ) : file.status === FileUploadStatus.error ? (
            <button
              onClick={(evt) => handleClick(evt, onRetryClick)}
              aria-label="Reyna aftur"
            >
              <Icon color={statusColor.icon} icon={icons.retry} />
            </button>
          ) : (
            <button
              onClick={(evt) => handleClick(evt, onRemoveClick)}
              aria-label="Fjarlægja skrá"
            >
              <Icon color={statusColor.icon} icon={icons.remove} />
            </button>
          )}
        </Box>
      )}
      {file.percent !== undefined && (
        <UploadingIndicator percent={file.percent} />
      )}
    </Box>
  )
}

interface Props {
  name: string
  files: UploadFile[]
  title?: string
  description?: string
  buttonLabel?: string
  disabled?: boolean
  accept?: string | string[]
  // Enable upload of multiple files
  multiple?: boolean
  // Maximum file size in bytes
  maxSize?: number
  hideIcons?: boolean
  onRemove: (file: UploadFile) => void
  onRetry?: (file: UploadFile) => void
  onChange?: (files: File[], uploadCount?: number) => void
  onUploadRejection?: (files: FileRejection[]) => void
  onOpenFile?: (file: UploadFile) => void
  errorMessage?: string
  defaultFileBackgroundColor?: StatusColor
}

export const InputFileUpload: FC<Props> = (props) => {
  const {
    name,
    files = [],
    title,
    description,
    buttonLabel = 'Velja skjöl til að hlaða upp',
    disabled = false,
    accept,
    multiple = true,
    maxSize,
    hideIcons = false,
    onChange,
    onRemove,
    onRetry,
    onUploadRejection,
    onOpenFile,
    errorMessage,
    defaultFileBackgroundColor,
  } = props

  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length !== 0 && onUploadRejection) {
      onUploadRejection(fileRejections)
    }

    if (acceptedFiles.length === 0 || !onChange) return

    if (!multiple) {
      onChange(acceptedFiles.slice(0, 1), acceptedFiles.length)
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

  const getActiveStyle = useMemo(
    () => ({
      ...(isDragActive ? { borderColor: theme.color.blue400 } : {}),
    }),
    [isDragActive],
  )

  const ariaError = errorMessage
    ? {
        'aria-invalid': true,
        'aria-describedby': name,
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
      className={cn(styles.container, { [styles.containerDisabled]: disabled })}
      {...getRootProps({ style: getActiveStyle })}
    >
      {title && (
        <Text variant="h4" as="h4">
          {title}
        </Text>
      )}
      {description && <Text>{description}</Text>}
      <Box marginY={4}>
        {(multiple || (!multiple && files.length === 0)) && (
          <Button variant="ghost" icon="attach" disabled={disabled}>
            {buttonLabel}
          </Button>
        )}
      </Box>
      <Box width="full" paddingX={[2, 2, 2, 2, 12]}>
        {files.map((file, index) => (
          <Box marginBottom={2} key={file.id ?? `${file.name}_${index}`}>
            <UploadedFile
              file={file}
              defaultBackgroundColor={defaultFileBackgroundColor}
              hideIcons={hideIcons}
              onRemoveClick={onRemove}
              onRetryClick={onRetry}
              onOpenFile={onOpenFile}
            />
          </Box>
        ))}
      </Box>
      <input id={name} name={name} {...getInputProps()} {...ariaError} />
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
    </Box>
  )
}
