import React, { useMemo } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { useMeasure } from 'react-use'
import cn from 'classnames'

import * as styles from './InputFileUpload.css'

import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { Button } from '../Button/Button'
import { theme, Colors } from '@island.is/island-ui/theme'
import { Icon } from '../IconRC/Icon'
import { Icon as IconTypes } from '../IconRC/iconMap'

import { useDeprecatedComponent } from '../private/useDeprecatedComponent'

export type UploadFileStatusDeprecated = 'error' | 'done' | 'uploading'

export interface UploadFileDeprecated {
  name: string
  type?: string
  id?: string
  key?: string
  status?: UploadFileStatusDeprecated
  percent?: number
  originalFileObj?: File | Blob
  error?: string
  size?: number
}

export const fileToObjectDeprecated = (
  file: File,
  status?: UploadFileStatusDeprecated,
): UploadFileDeprecated => {
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

export type StatusColorDeprecated = {
  background: Colors
  border: Colors
  icon?: Colors
}

interface UploadedFileProps {
  file: UploadFileDeprecated
  showFileSize: boolean
  onRemoveClick?: (file: UploadFileDeprecated) => void
  onRetryClick?: (file: UploadFileDeprecated) => void
  onOpenFile?: (file: UploadFileDeprecated) => void
  defaultBackgroundColor?: StatusColorDeprecated
  doneIcon?: IconTypes
  hideIcons?: boolean
}

export const UploadedFileDeprecated = ({
  file,
  showFileSize,
  defaultBackgroundColor,
  doneIcon,
  onRemoveClick,
  onRetryClick,
  onOpenFile,
  hideIcons = false,
}: UploadedFileProps) => {
  useDeprecatedComponent('UploadedFile', 'UploadedFileV2')
  const [ref, { width }] = useMeasure()

  const statusColor: StatusColorDeprecated =
    useMemo<StatusColorDeprecated>(() => {
      switch (file.status) {
        case 'error':
          return { background: 'red100', border: 'red200', icon: 'red600' }
        case 'done':
          // Display an error color if the file is empty
          if (file.size && file.size === 0) {
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

  const statusIcon = (status?: UploadFileStatusDeprecated): IconTypes => {
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
    if (str.length > 40) {
      const nrOfCharacters = width / 25
      return `${str.slice(0, nrOfCharacters)}...${str.slice(-nrOfCharacters)}`
    } else {
      return str
    }
  }

  const isUploading =
    file.percent !== undefined &&
    file.percent < 100 &&
    file.status === 'uploading'

  return (
    <Box
      ref={ref}
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="spaceBetween"
      borderRadius="large"
      borderStyle={'solid'}
      borderWidth={'standard'}
      borderColor={statusColor.border}
      background={statusColor.background}
      paddingX={2}
      paddingY={1}
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
        <Box component="span" className={{ [styles.fileName]: onOpenFile }}>
          {truncateInMiddle(file.name)}
          {showFileSize && (
            <Text as="span">{` (${file.size ? kb(file.size) : 0}KB)`}</Text>
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
              <Icon color={statusColor.icon} icon="reload" />
            </button>
          ) : (
            <button
              type={'button'}
              onClick={(e) => {
                e.stopPropagation()
                if (!isUploading && onRemoveClick) {
                  onRemoveClick(file)
                }
              }}
              aria-label="Fjarlægja skrá"
            >
              <Icon color={statusColor.icon} icon={statusIcon(file.status)} />
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

export interface InputFileUploadPropsDeprecated {
  applicationId?: string
  name?: string
  showFileSize?: boolean
  id?: string
  header?: string
  description?: string
  buttonLabel?: string
  disabled?: boolean
  accept?: string | string[]
  multiple?: boolean
  fileList: UploadFileDeprecated[]
  maxSize?: number
  onRemove: (file: UploadFileDeprecated) => void
  onRetry?: (file: UploadFileDeprecated) => void
  onChange?: (files: File[], uploadCount?: number) => void
  onUploadRejection?: (files: FileRejection[]) => void
  errorMessage?: string
  defaultFileBackgroundColor?: StatusColorDeprecated
  doneIcon?: IconTypes
  hideIcons?: boolean
}

export const InputFileUploadDeprecated = ({
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
  onUploadRejection,
  errorMessage,
  defaultFileBackgroundColor,
  doneIcon,
  hideIcons = false,
}: InputFileUploadPropsDeprecated) => {
  useDeprecatedComponent('InputFileUpload', 'InputFileUploadV2')

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
      className={cn(styles.container, { [styles.containerDisabled]: disabled })}
      {...getRootProps({ style })}
    >
      <Text variant="h4">{header}</Text>
      <Text>{description}</Text>
      <Box marginY={4}>
        {(multiple || (!multiple && fileList.length === 0)) && (
          <Button variant="ghost" icon="attach" disabled={disabled}>
            {buttonLabel}
          </Button>
        )}
      </Box>

      <Box width="full" paddingX={[2, 2, 2, 2, 12]}>
        {fileList.map((file, index) => (
          <Box marginBottom={2} key={file.id ?? `${file.name}_${index}`}>
            <UploadedFileDeprecated
              file={file}
              showFileSize={showFileSize}
              defaultBackgroundColor={defaultFileBackgroundColor}
              doneIcon={doneIcon}
              onRemoveClick={onRemove}
              onRetryClick={onRetry}
              hideIcons={hideIcons}
            />
          </Box>
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
