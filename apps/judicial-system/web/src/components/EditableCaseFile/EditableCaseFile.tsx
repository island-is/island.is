import { FC, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useMeasure } from 'react-use'
import cn from 'classnames'
import isValid from 'date-fns/isValid'
import { AnimatePresence, motion } from 'motion/react'
import { InputMask } from '@react-input/mask'

import {
  Box,
  FileUploadStatus,
  Icon,
  Input,
  LoadingDots,
  Text,
  toast,
  UploadFile,
} from '@island.is/island-ui/core'
import { EDITABLE_DATE } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'

import { CaseFileCategory } from '../../graphql/schema'
import { TUploadFile } from '../../utils/hooks'
import { strings } from './EditableCaseFile.strings'
import * as styles from './EditableCaseFile.css'

export const editableFields = ['fileName', 'displayDate'] as const
export type EditableFields = typeof editableFields[number]

export interface TEditableCaseFile {
  id: string
  category?: CaseFileCategory | null
  created?: string | null
  name?: string | null
  displayText?: string | null
  userGeneratedFilename?: string | null
  displayDate?: string | null
  canOpen?: boolean
  canEdit?: readonly EditableFields[]
  status?: FileUploadStatus
  size?: number | null
  submissionDate?: string | null
}

interface Props {
  enableDrag: boolean
  caseFile: TEditableCaseFile
  // Overwrites the default background color based on file status
  backgroundColor?: 'white'
  disabled?: boolean
  onRename: (id: string, name: string, displayDate: string) => void
  onDelete: (file: TUploadFile) => void
  onOpen?: (id: string) => void
  onRetry?: (file: TUploadFile) => void
  onStartEditing?: () => void
  onStopEditing?: () => void
}

const EditableCaseFile: FC<Props> = (props) => {
  const {
    enableDrag,
    caseFile,
    backgroundColor,
    onOpen,
    disabled,
    onRename,
    onDelete,
    onRetry,
    onStartEditing,
    onStopEditing,
  } = props
  const { formatMessage } = useIntl()
  const [ref, { width }] = useMeasure<HTMLDivElement>()

  const initialDate =
    caseFile.displayDate || caseFile.submissionDate || caseFile.created
  const displayName = caseFile.userGeneratedFilename ?? caseFile.displayText

  const [editedDisplayDate, setEditedDisplayDate] = useState<
    string | undefined
  >(formatDate(initialDate))

  const [isEditing, setIsEditing] = useState<boolean>(false)

  const [editedFilename, setEditedFilename] = useState<
    string | undefined | null
  >(caseFile.userGeneratedFilename)

  const canEditName = caseFile.canEdit?.includes('fileName') ?? false
  const canEditDate = caseFile.canEdit?.includes('displayDate') ?? false

  const handleEditFileButtonClick = () => {
    const trimmedFilename = editedFilename?.trim()
    const trimmedDisplayDate = editedDisplayDate?.trim()

    if (canEditName) {
      if (trimmedFilename !== undefined && trimmedFilename.length === 0) {
        toast.error(formatMessage(strings.invalidFilenameErrorMessage))
        return
      }
    }

    let isoDate: string | undefined

    if (canEditDate) {
      if (!trimmedDisplayDate) {
        toast.error(formatMessage(strings.invalidDateErrorMessage))
        return
      }

      const [day, month, year] = trimmedDisplayDate.split('.')
      const y = Number(year)
      const m = Number(month)
      const d = Number(day)
      // Construct date at 00:00:00Z to avoid local timezone shifts
      const parsedDateUtc = new Date(Date.UTC(y, m - 1, d))

      if (!isValid(parsedDateUtc)) {
        toast.error(formatMessage(strings.invalidDateErrorMessage))
        return
      }

      isoDate = parsedDateUtc.toISOString()
    }

    onRename(
      caseFile.id,
      trimmedFilename ?? displayName ?? caseFile.userGeneratedFilename ?? '',
      isoDate ?? caseFile.displayDate ?? '',
    )

    setIsEditing(false)
    onStopEditing?.()
  }

  const displayDate = useMemo(() => {
    return formatDate(caseFile.displayDate ?? caseFile.created)
  }, [caseFile.displayDate, caseFile.created])

  const isEmpty = caseFile.size === 0
  const hasError = caseFile.status === FileUploadStatus.error || isEmpty
  const color = hasError ? 'red400' : 'blue400'
  const styleIndex =
    caseFile.status === FileUploadStatus.done && isEmpty
      ? FileUploadStatus.error
      : caseFile.status || FileUploadStatus.uploading

  return (
    <div
      className={cn(styles.caseFileWrapper, {
        [styles.caseFileWrapperBackground['white']]:
          backgroundColor === 'white',
        [styles.error]:
          !backgroundColor && styleIndex === FileUploadStatus.error,
        [styles.done]: !backgroundColor && styleIndex === FileUploadStatus.done,
        [styles.uploading]:
          !backgroundColor && styleIndex === FileUploadStatus.uploading,
      })}
    >
      {enableDrag && (
        <Box
          data-testid="caseFileDragHandle"
          display="flex"
          paddingX={3}
          paddingY={2}
        >
          <Icon icon="menu" color={color} />
        </Box>
      )}
      <Box width="full" paddingLeft={enableDrag ? 0 : 2}>
        <AnimatePresence initial={false} mode="wait">
          {isEditing ? (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              key={`${caseFile.id}-edit`}
              aria-live="polite"
            >
              <Box display="flex">
                <Box className={styles.editCaseFileInputContainer}>
                  {canEditName && (
                    <Box className={styles.editCaseFileName}>
                      <Input
                        name="fileName"
                        size="xs"
                        placeholder={formatMessage(
                          strings.simpleInputPlaceholder,
                        )}
                        defaultValue={displayName ?? undefined}
                        onChange={(evt) => setEditedFilename(evt.target.value)}
                      />
                    </Box>
                  )}
                  {canEditDate && (
                    <Box className={styles.editCaseFileDisplayDate}>
                      <InputMask
                        component={Input}
                        mask={EDITABLE_DATE}
                        replacement={{ _: /\d/ }}
                        value={editedDisplayDate || ''}
                        onChange={(evt) => {
                          setEditedDisplayDate(evt.target.value)
                        }}
                        name="fileDisplayDate"
                        size="xs"
                        placeholder={formatDate(new Date())}
                        autoComplete="off"
                      />
                    </Box>
                  )}
                </Box>
                <Box display="flex" alignItems="center">
                  <button
                    onClick={handleEditFileButtonClick}
                    className={cn(styles.editCaseFileButton, {
                      [styles.background.primary]:
                        caseFile.status !== FileUploadStatus.error,
                      [styles.background.secondary]:
                        caseFile.status === FileUploadStatus.error || isEmpty,
                    })}
                    aria-label="Vista breytingar"
                  >
                    <Icon icon="checkmark" color={color} />
                  </button>
                  <Box marginLeft={1}>
                    <button
                      onClick={() => {
                        onDelete(caseFile as TUploadFile)
                        onStopEditing?.()
                      }}
                      className={cn(styles.editCaseFileButton, {
                        [styles.background.primary]:
                          caseFile.status !== FileUploadStatus.error,
                        [styles.background.secondary]:
                          caseFile.status === FileUploadStatus.error || isEmpty,
                      })}
                      aria-label="Eyða skrá"
                    >
                      <Icon icon="trash" color={color} type="outline" />
                    </button>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              key={`${caseFile.id}-view`}
              ref={ref}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
              aria-live="polite"
            >
              <Box
                display="flex"
                alignItems="center"
                component={caseFile.canOpen ? 'button' : undefined}
                onClick={() => {
                  if (caseFile.canOpen && caseFile.id) {
                    onOpen?.(caseFile.id)
                  }
                }}
              >
                <Text variant="h5">
                  <span
                    style={{
                      display: 'block',
                      maxWidth: `${width - 180}px`,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {displayName}
                  </span>
                </Text>
                {caseFile.canOpen && (
                  <Box marginLeft={1}>
                    <Icon icon="open" type="outline" size="small" />
                  </Box>
                )}
              </Box>
              <Box display="flex" alignItems="center">
                <Box marginRight={1}>
                  <Text variant="small">{displayDate}</Text>
                </Box>

                {caseFile.status === FileUploadStatus.uploading ? (
                  <Box className={styles.editCaseFileButton}>
                    <LoadingDots single />
                  </Box>
                ) : (caseFile.status === FileUploadStatus.error || isEmpty) &&
                  onRetry ? (
                  <button
                    onClick={() => onRetry(caseFile as UploadFile)}
                    className={cn(
                      styles.editCaseFileButton,
                      styles.background.secondary,
                    )}
                    aria-label="Reyna aftur að hlaða upp skrá"
                  >
                    <Icon icon="reload" color="red400" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditing(true)
                      onStartEditing?.()
                    }}
                    className={cn(styles.editCaseFileButton, {
                      [styles.background.primary]:
                        !!caseFile.canEdit?.length &&
                        caseFile.status !== FileUploadStatus.error,
                      [styles.background.secondary]:
                        caseFile.status === FileUploadStatus.error || isEmpty,
                    })}
                    disabled={!caseFile.canEdit?.length || disabled}
                    aria-label="Breyta skrá"
                  >
                    <Icon icon="pencil" color={color} />
                  </button>
                )}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </div>
  )
}

export default EditableCaseFile
