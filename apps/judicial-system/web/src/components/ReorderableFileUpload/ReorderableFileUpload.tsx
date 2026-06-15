import {
  Dispatch,
  FC,
  PointerEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useDropzone } from 'react-dropzone'
import {
  animate,
  MotionValue,
  Reorder,
  useDragControls,
  useMotionValue,
} from 'motion/react'

import { Box, Button, FileUploadStatus, Text } from '@island.is/island-ui/core'
import { fileExtensionWhitelist } from '@island.is/island-ui/core/types'

import { TUploadFile } from '../../utils/hooks'
import EditableCaseFile from '../EditableCaseFile/EditableCaseFile'
import * as styles from './ReorderableFileUpload.css'

interface ReorderableFileUploadProps {
  files: TUploadFile[]
  disabled?: boolean
  errorMessage?: string
  dropzoneTitle: string
  dropzoneButtonLabel: string
  accept?: string[]
  onFilesChange: (files: File[]) => void
  onRemove: (file: TUploadFile) => void
  onRetry?: (file: TUploadFile) => void
  onOpenFile: (file: TUploadFile) => void
  onReorder: (
    files: { id: string; orderWithinChapter: number }[],
  ) => Promise<void>
  onRename: (fileId: string, userGeneratedFilename: string) => Promise<void>
  setEditCount?: Dispatch<SetStateAction<number>>
}

const useRaisedShadow = (value: MotionValue<number>) => {
  const inactiveShadow = '0px 0px 0px rgba(0,0,0,0.8)'
  const boxShadow = useMotionValue(inactiveShadow)

  useEffect(() => {
    let isActive = false
    value.on('change', (latest) => {
      const wasActive = isActive
      if (latest !== 0) {
        isActive = true
        if (isActive !== wasActive) {
          animate(boxShadow, '5px 5px 10px rgba(0,0,0,0.3)')
        }
      } else {
        isActive = false
        if (isActive !== wasActive) {
          animate(boxShadow, inactiveShadow)
        }
      }
    })
  }, [value, boxShadow])

  return boxShadow
}

interface DraggableFileRowProps {
  file: TUploadFile
  onDragStart: () => void
  onReorder: () => void
  onOpen: (id: string) => void
  onRename: (id: string, name: string, displayDate: string) => void
  onDelete: (file: TUploadFile) => void
  onRetry?: (file: TUploadFile) => void
  setEditCount?: Dispatch<SetStateAction<number>>
}

const DraggableFileRow: FC<DraggableFileRowProps> = (props) => {
  const {
    file,
    onDragStart,
    onReorder,
    onOpen,
    onRename,
    onDelete,
    onRetry,
    setEditCount,
  } = props
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const controls = useDragControls()
  const [isDragging, setIsDragging] = useState(false)

  const handlePointerDown = (evt: PointerEvent) => {
    const target = evt.target as HTMLElement
    if (target.closest('button') || target.tagName.toLowerCase() === 'input') {
      return
    }

    onDragStart()

    if (target.tagName.toLowerCase() !== 'input') {
      evt.preventDefault()
    }
    setIsDragging(true)
    controls.start(evt)
  }

  const handlePointerUp = () => {
    if (isDragging) {
      onReorder()
    }
    setIsDragging(false)
  }

  return (
    <Reorder.Item
      value={file}
      id={file.id}
      style={{ y, boxShadow, cursor: isDragging ? 'grabbing' : 'grab' }}
      className={styles.reorderItem}
      dragListener={false}
      dragControls={controls}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      drag
    >
      <EditableCaseFile
        caseFile={{
          ...file,
          id: file.id ?? '',
          displayText:
            file.userGeneratedFilename ??
            file.name?.replace(/\.pdf$/i, '') ??
            file.name,
          canEdit: ['fileName'],
          canOpen:
            file.status === FileUploadStatus.done &&
            file.isKeyAccessible !== false,
        }}
        enableDrag
        onOpen={(id) => onOpen(id)}
        onRename={onRename}
        onDelete={onDelete}
        onRetry={onRetry}
        onStartEditing={() => setEditCount?.((c) => c + 1)}
        onStopEditing={() => setEditCount?.((c) => c - 1)}
      />
    </Reorder.Item>
  )
}

const ReorderableFileUpload: FC<ReorderableFileUploadProps> = (props) => {
  const {
    files,
    disabled = false,
    errorMessage,
    dropzoneTitle,
    dropzoneButtonLabel,
    accept = Object.values(fileExtensionWhitelist),
    onFilesChange,
    onRemove,
    onRetry,
    onOpenFile,
    onReorder,
    onRename,
    setEditCount,
  } = props

  const [reorderableFiles, setReorderableFiles] = useState<TUploadFile[]>(files)
  const reorderableFilesRef = useRef(reorderableFiles)
  const orderBeforeDragRef = useRef<string>('')

  useEffect(() => {
    const sorted = [...files].sort((a, b) => {
      if (a.orderWithinChapter === null && b.orderWithinChapter === null)
        return 0
      if (a.orderWithinChapter === null) return 1
      if (b.orderWithinChapter === null) return -1
      return (a.orderWithinChapter ?? 0) - (b.orderWithinChapter ?? 0)
    })
    reorderableFilesRef.current = sorted
    setReorderableFiles(sorted)
  }, [files])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        onFilesChange(accepted)
      }
    },
    accept,
    disabled,
  })

  const handleGroupReorder = (newOrder: TUploadFile[]) => {
    reorderableFilesRef.current = newOrder
    setReorderableFiles(newOrder)
  }

  const fileOrderKey = (orderedFiles: TUploadFile[]) =>
    orderedFiles.map((file) => file.id).join(',')

  const handleReorder = async (orderedFiles: TUploadFile[]) => {
    const newOrderKey = fileOrderKey(orderedFiles)
    if (newOrderKey === orderBeforeDragRef.current) {
      return
    }

    const updates = orderedFiles.map((file, index) => ({
      id: file.id ?? '',
      orderWithinChapter: index,
    }))
    await onReorder(updates)
  }

  const handleRename = async (
    fileId: string,
    newName: string,
    _displayDate: string,
  ) => {
    await onRename(fileId, newName)
  }

  return (
    <Box>
      <Box className={styles.dropzone} {...getRootProps()}>
        <Text variant="h4" as="h4">
          {dropzoneTitle}
        </Text>
        <Box marginY={3}>
          <Button variant="ghost" icon="attach" disabled={disabled}>
            {dropzoneButtonLabel}
          </Button>
        </Box>
        <input {...getInputProps()} />
        {reorderableFiles.length > 0 && (
          <Box
            className={styles.fileListContainer}
            onClick={(event) => event.stopPropagation()}
          >
            <Reorder.Group
              axis="y"
              values={reorderableFiles}
              onReorder={handleGroupReorder}
              className={styles.reorderGroup}
            >
              {reorderableFiles.map((file) => (
                <Box key={file.id} marginBottom={1} width="full">
                  <DraggableFileRow
                    file={file}
                    onDragStart={() => {
                      orderBeforeDragRef.current = fileOrderKey(
                        reorderableFilesRef.current,
                      )
                    }}
                    onReorder={() => handleReorder(reorderableFilesRef.current)}
                    onOpen={(id) =>
                      onOpenFile(
                        reorderableFiles.find((f) => f.id === id) ?? file,
                      )
                    }
                    onRename={handleRename}
                    onDelete={onRemove}
                    onRetry={onRetry}
                    setEditCount={setEditCount}
                  />
                </Box>
              ))}
            </Reorder.Group>
          </Box>
        )}
      </Box>
      {errorMessage && (
        <Box marginTop={2}>
          <Text color="red600" variant="eyebrow">
            {errorMessage}
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default ReorderableFileUpload
