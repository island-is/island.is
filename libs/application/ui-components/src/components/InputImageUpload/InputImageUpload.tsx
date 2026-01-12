import React, { useMemo } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { useMeasure } from 'react-use'
import cn from 'classnames'
import * as styles from './InputImageUpload.css'

import {
  Box,
  Text,
  Button,
  Icon,
  ProgressMeter,
  IconMapType,
} from '@island.is/island-ui/core'
import { theme, Colors } from '@island.is/island-ui/theme'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

export type UploadImageStatus = 'error' | 'done' | 'uploading'

export interface UploadImage {
  name: string
  type?: string
  id?: string
  key?: string
  status?: UploadImageStatus
  percent?: number
  originalFileObj?: File | Blob
  error?: string
  size?: number
}

export const imageToObject = (
  file: File,
  status?: UploadImageStatus,
): UploadImage => {
  return {
    name: file.name,
    type: file.type,
    percent: 0,
    originalFileObj: file,
    status: status || 'done',
  }
}

interface UploadedImageProps {
  applicationId: string
  file: UploadImage
  showFileSize: boolean
  onRemoveClick: (file: UploadImage) => void
  onRetryClick?: (file: UploadImage) => void
  onOpenFile?: (file: UploadImage) => void
  defaultBackgroundColor?: Colors
  doneIcon?: IconMapType
  hideIcons?: boolean
}

export const PresignedUrlQuery = gql`
  query attachmentPresignedURL($input: AttachmentPresignedUrlInput!) {
    attachmentPresignedURL(input: $input) {
      url
    }
  }
`

export const UploadedImage = ({
  applicationId,
  file,
  showFileSize,
  defaultBackgroundColor,
  onRemoveClick,
  onRetryClick,
  onOpenFile,
}: UploadedImageProps) => {
  const { data: presignedUrl } = useQuery(PresignedUrlQuery, {
    variables: {
      input: {
        id: applicationId,
        attachmentKey: file.key,
      },
    },
    skip: !file.key,
  })

  const [ref, { width }] = useMeasure()

  const statusColor = (status?: UploadImageStatus): Colors => {
    switch (status) {
      case 'error':
        return 'red100'
      case 'done':
        return 'blue100'
      default:
        return defaultBackgroundColor ?? 'transparent'
    }
  }

  const statusColorDarker = (status?: UploadImageStatus): Colors => {
    switch (status) {
      case 'error':
        return 'red200'
      case 'done':
        return 'blue200'
      default:
        return 'blue200'
    }
  }

  const kb = (bytes?: number) => {
    return bytes ? Math.ceil(bytes / 1024) : ''
  }

  const truncateInMiddle = (str: string) => {
    if (str.length > 30) {
      const nrOfCharacters = width / 25
      return `${str.slice(0, nrOfCharacters)}...${str.slice(-nrOfCharacters)}`
    } else {
      return str
    }
  }

  const isUploading =
    file.percent && file.percent < 100 && file.status === 'uploading'

  return (
    <Box
      ref={ref}
      marginBottom={2}
      borderWidth="standard"
      background={statusColor(file.status)}
      borderColor={statusColorDarker(file.status)}
      borderRadius="large"
      aria-label={onOpenFile ? `Opna ${file.name}` : undefined}
      position="relative"
      title={file.name}
      onClick={(e) => {
        e.stopPropagation()

        if (onOpenFile) {
          onOpenFile(file)
        }
      }}
    >
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="spaceBetween"
        padding={1}
      >
        <Box display={'flex'} alignItems={'center'}>
          <Box
            className={styles.imageContainer}
            marginRight={1}
            borderRadius="standard"
            background={statusColorDarker(file.status)}
          >
            {presignedUrl && file.status === 'done' && (
              <img
                src={presignedUrl.attachmentPresignedURL?.url}
                alt="mynd"
                className={styles.image}
              />
            )}
          </Box>
          <Text truncate fontWeight="semiBold">
            <Box component="span" className={{ [styles.fileName]: onOpenFile }}>
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
        </Box>

        <Box display="flex">
          {file.status === 'error' && (
            <button
              type={'button'}
              onClick={(e) => {
                e.stopPropagation()
                if (!isUploading && onRetryClick) {
                  onRetryClick(file)
                }
              }}
              aria-label="Reyna aftur"
            >
              <Icon color="red600" icon="reload" />
            </button>
          )}
          {file.status === 'done' && (
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
              <Icon color="blue400" icon="close" />
            </button>
          )}
        </Box>
      </Box>

      {!!file.percent && file.percent < 100 && (
        <ProgressMeter progress={file.percent / 100} />
      )}
    </Box>
  )
}

export interface InputImageUploadProps {
  applicationId: string
  name?: string
  showFileSize?: boolean
  id?: string
  header?: string
  description?: string
  buttonLabel?: string
  disabled?: boolean
  accept?: string | string[]
  multiple?: boolean
  fileList: UploadImage[]
  maxSize?: number
  onRemove: (file: UploadImage) => void
  onRetry?: (file: UploadImage) => void
  onChange?: (files: File[], uploadCount?: number) => void
  onUploadRejection?: (files: FileRejection[]) => void
  errorMessage?: string
  defaultFileBackgroundColor?: Colors
  doneIcon?: IconMapType
  hideIcons?: boolean
}

export const InputImageUpload = ({
  applicationId,
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
}: InputImageUploadProps) => {
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
        <Button variant="ghost" icon="attach" disabled={disabled}>
          {buttonLabel}
        </Button>
      </Box>

      <Box width="full">
        {fileList.map((file, index) => {
          return (
            <UploadedImage
              applicationId={applicationId}
              key={index}
              file={file}
              showFileSize={showFileSize}
              defaultBackgroundColor={defaultFileBackgroundColor}
              doneIcon={doneIcon}
              onRemoveClick={onRemove}
              onRetryClick={onRetry}
              hideIcons={hideIcons}
            />
          )
        })}
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
