import { FC, useMemo, useState } from 'react'
import InputMask from 'react-input-mask'
import { useIntl } from 'react-intl'
import { useMeasure } from 'react-use'
import cn from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'

import {
  Box,
  Icon,
  Input,
  LoadingDots,
  Text,
  UploadFile,
  UploadFileStatus,
} from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'

import { CaseFileCategory } from '../../graphql/schema'
import { TUploadFile } from '../../utils/hooks'
import { strings } from './EditableCaseFile.strings'
import * as styles from './EditableCaseFile.css'

export interface TEditableCaseFile {
  id: string
  category?: CaseFileCategory | null
  created?: string | null
  displayText?: string | null
  userGeneratedFilename?: string | null
  displayDate?: string | null
  canOpen?: boolean
  canEdit?: boolean
  status?: UploadFileStatus
}

interface Props {
  enableDrag: boolean
  caseFile: TEditableCaseFile
  onOpen: (id: string) => void
  onRename: (id: string, name?: string, displayDate?: string) => void
  onDelete: (file: TUploadFile) => void
  onRetry?: (file: TUploadFile) => void
}

const EditableCaseFile: FC<Props> = (props) => {
  const { caseFile, enableDrag, onOpen, onRename, onDelete, onRetry } = props
  const { formatMessage } = useIntl()
  const [ref, { width }] = useMeasure<HTMLDivElement>()
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const [editedFilename, setEditedFilename] = useState<
    string | undefined | null
  >(caseFile.userGeneratedFilename)

  const [editedDisplayDate, setEditedDisplayDate] = useState<
    string | undefined
  >(formatDate(caseFile.displayDate) ?? undefined)
  const displayName = caseFile.userGeneratedFilename ?? caseFile.displayText

  const handleEditFileButtonClick = () => {
    const trimmedFilename = editedFilename?.trim()
    const trimmedDisplayDate = editedDisplayDate?.trim()

    if (trimmedFilename || trimmedDisplayDate) {
      onRename(caseFile.id, trimmedFilename, trimmedDisplayDate)
      setIsEditing(false)
      setEditedDisplayDate(formatDate(caseFile.displayDate) ?? '')

      return
    } else {
      setIsEditing(false)
    }
  }

  const displayDate = useMemo(() => {
    return formatDate(caseFile.displayDate ?? caseFile.created)
  }, [caseFile.displayDate, caseFile.created])

  return (
    <div
      className={cn(
        styles.caseFileWrapper,
        styles.caseFileWrapperStates[caseFile.status || 'uploading'],
      )}
    >
      {enableDrag && (
        <Box
          data-testid="caseFileDragHandle"
          display="flex"
          paddingX={3}
          paddingY={2}
        >
          <Icon icon="menu" color="blue400" />
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
                  <Box className={styles.editCaseFileDisplayDate}>
                    <InputMask
                      mask="99.99.9999"
                      maskPlaceholder={null}
                      value={editedDisplayDate || ''}
                      onChange={(evt) => {
                        setEditedDisplayDate(evt.target.value)
                      }}
                    >
                      <Input
                        name="fileDisplayDate"
                        size="xs"
                        placeholder={formatDate(new Date())}
                        autoComplete="off"
                      />
                    </InputMask>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center">
                  <button
                    onClick={handleEditFileButtonClick}
                    className={cn(styles.editCaseFileButton, {
                      [styles.background.primary]: caseFile.status !== 'error',
                      [styles.background.secondary]:
                        caseFile.status === 'error',
                    })}
                    aria-label="Vista breytingar"
                  >
                    <Icon
                      icon="checkmark"
                      color={caseFile.status === 'error' ? 'red400' : 'blue400'}
                    />
                  </button>
                  <Box marginLeft={1}>
                    <button
                      onClick={() => onDelete(caseFile as TUploadFile)}
                      className={cn(styles.editCaseFileButton, {
                        [styles.background.primary]:
                          caseFile.status !== 'error',
                        [styles.background.secondary]:
                          caseFile.status === 'error',
                      })}
                      aria-label="Eyða skrá"
                    >
                      <Icon
                        icon="trash"
                        color={
                          caseFile.status === 'error' ? 'red400' : 'blue400'
                        }
                        type="outline"
                      />
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
                    onOpen(caseFile.id)
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

                {caseFile.status === 'uploading' ? (
                  <Box className={styles.editCaseFileButton}>
                    <LoadingDots single />
                  </Box>
                ) : caseFile.status === 'error' && onRetry ? (
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
                    onClick={() => setIsEditing(true)}
                    className={cn(styles.editCaseFileButton, {
                      [styles.background.primary]:
                        caseFile.canEdit && caseFile.status !== 'error',
                      [styles.background.secondary]:
                        caseFile.status === 'error',
                    })}
                    disabled={!caseFile.canEdit}
                    aria-label="Breyta skrá"
                  >
                    <Icon
                      icon="pencil"
                      color={caseFile.status === 'error' ? 'red400' : 'blue400'}
                    />
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