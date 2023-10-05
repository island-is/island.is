import React, { useEffect, useMemo, useState } from 'react'
import InputMask from 'react-input-mask'
import { useIntl } from 'react-intl'
import { useMeasure } from 'react-use'
import isValid from 'date-fns/isValid'
import parseISO from 'date-fns/parseISO'
import {
  animate,
  AnimatePresence,
  motion,
  MotionValue,
  Reorder,
  useDragControls,
  useMotionValue,
} from 'framer-motion'
import { uuid } from 'uuidv4'

import {
  AccordionItem,
  AlertMessage,
  Box,
  Icon,
  Input,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseFile as TCaseFile,
  CrimeSceneMap,
  IndictmentSubtypeMap,
} from '@island.is/judicial-system/types'
import {
  FileNotFoundModal,
  IndictmentInfo,
} from '@island.is/judicial-system-web/src/components'
import {
  TUploadFile,
  useFileList,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { useUpdateFilesMutation } from './updateFiles.generated'
import { indictmentsCaseFilesAccordionItem as m } from './IndictmentsCaseFilesAccordionItem.strings'
import * as styles from './IndictmentsCaseFilesAccordionItem.css'

const DDMMYYYY = 'dd.MM.yyyy'

interface Props {
  policeCaseNumber: string
  caseFiles: TCaseFile[]
  caseId: string
  shouldStartExpanded: boolean
  subtypes?: IndictmentSubtypeMap
  crimeScenes?: CrimeSceneMap
}

interface CaseFileProps {
  caseFile: ReorderableItem
  onReorder: (id?: string) => void
  onOpen: (id: string) => void
  onRename: (id: string, name?: string, displayDate?: string) => void
  onDelete: (id: string) => void
}

export interface ReorderableItem {
  id: string
  displayText: string
  isDivider: boolean
  isHeading: boolean
  created?: string
  chapter?: number
  orderWithinChapter?: number
  userGeneratedFilename?: string
  displayDate?: string
  canOpen?: boolean
}

const useRaisedShadow = (value: MotionValue<number>) => {
  const inactiveShadow = '0px 0px 0px rgba(0,0,0,0.8)'
  const boxShadow = useMotionValue(inactiveShadow)

  useEffect(() => {
    let isActive = false
    value.onChange((latest) => {
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

export const getFilesToUpdate = (
  fileId: string,
  files: ReorderableItem[],
): [number | null, number | null, ReorderableItem[]] => {
  let index = files.findIndex((item) => item.id === fileId)
  if (index === -1) {
    // This should not happen
    return [null, null, []]
  }

  if (
    index > 0 &&
    (files[index - 1].chapter === undefined ||
      files[index - 1].chapter === null)
  ) {
    // The file is not in a chapter
    return [null, null, [files[index]]]
  }

  const chapter = files[index - 1]?.chapter ?? 0
  const orderWithinChapter = (files[index - 1]?.orderWithinChapter ?? -1) + 1

  const filesToUpdate: ReorderableItem[] = [files[index]]
  while (files[++index].chapter === chapter) {
    filesToUpdate.push(files[index])
  }

  return [chapter, orderWithinChapter, filesToUpdate]
}

export const sortedFilesInChapter = (
  chapter: number,
  files: TCaseFile[],
): ReorderableItem[] => {
  return files
    .filter((file) => file.chapter === chapter)
    .map((file) => {
      return {
        id: file.id,
        displayText: file.name,
        isDivider: false,
        isHeading: false,
        created: file.created,
        chapter: file.chapter,
        orderWithinChapter: file.orderWithinChapter,
        userGeneratedFilename: file.userGeneratedFilename,
        displayDate: file.displayDate,
        canOpen: Boolean(file.key),
      }
    })
    .sort((a, b) => {
      if (
        a.orderWithinChapter === undefined ||
        b.orderWithinChapter === undefined
      ) {
        return 0
      }

      return a.orderWithinChapter - b.orderWithinChapter
    })
}

const renderChapter = (chapter: number, name: string) => (
  <Box className={styles.chapterContainer} data-testid="chapter">
    <Box marginRight={3}>
      <Text variant="h4">{`${chapter + 1}.`}</Text>
    </Box>
    <Text variant="h4">{name}</Text>
  </Box>
)

const CaseFile: React.FC<React.PropsWithChildren<CaseFileProps>> = (props) => {
  const { caseFile, onReorder, onOpen, onRename, onDelete } = props
  const { formatMessage } = useIntl()
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const controls = useDragControls()
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editedFilename, setEditedFilename] = useState<string | undefined>(
    caseFile.userGeneratedFilename,
  )
  const [ref, { width }] = useMeasure<HTMLDivElement>()

  const [editedDisplayDate, setEditedDisplayDate] = useState<
    string | undefined
  >(formatDate(caseFile.displayDate, DDMMYYYY) ?? undefined)
  const displayName = caseFile.userGeneratedFilename ?? caseFile.displayText

  const handleEditFileButtonClick = () => {
    const trimmedFilename = editedFilename?.trim()
    const trimmedDisplayDate = editedDisplayDate?.trim()

    if (trimmedFilename || trimmedDisplayDate) {
      onRename(caseFile.id, trimmedFilename, trimmedDisplayDate)
      setIsEditing(false)
      setEditedDisplayDate(formatDate(caseFile.displayDate, DDMMYYYY) ?? '')
    }

    setIsEditing(false)
  }

  const displayDate = useMemo(() => {
    return formatDate(caseFile.displayDate ?? caseFile.created, DDMMYYYY)
  }, [caseFile.displayDate, caseFile.created])

  return (
    <Reorder.Item
      value={caseFile}
      id={caseFile.id}
      style={{
        y,
        boxShadow,
        // Prevents text selection when dragging
        userSelect: isDragging ? 'none' : 'auto',
      }}
      className={styles.reorderItem}
      dragListener={false}
      dragControls={controls}
    >
      {caseFile.isHeading && caseFile.chapter !== undefined ? (
        renderChapter(caseFile.chapter, caseFile.displayText)
      ) : caseFile.isDivider ? (
        <Box marginBottom={2}>
          <Box marginBottom={1}>
            <Text variant="h4">{caseFile.displayText.split('|')[0]}</Text>
          </Box>
          <Text>{caseFile.displayText.split('|')[1]}</Text>
        </Box>
      ) : (
        <div
          className={styles.caseFileWrapper}
          onPointerUp={() => {
            if (isDragging) {
              onReorder(caseFile.id)
            }
            setIsDragging(false)
          }}
        >
          <Box
            data-testid="caseFileDragHandle"
            display="flex"
            paddingX={3}
            paddingY={2}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            onPointerDown={(e) => {
              setIsDragging(true)
              controls.start(e)
            }}
          >
            <Icon icon="menu" color="blue400" />
          </Box>
          <Box width="full">
            <AnimatePresence initial={false} exitBeforeEnter>
              {isEditing ? (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  key={`${caseFile.id}-edit`}
                >
                  <Box display="flex">
                    <Box className={styles.editCaseFileInputContainer}>
                      <Box className={styles.editCaseFileName}>
                        <Input
                          name="fileName"
                          size="xs"
                          placeholder={formatMessage(m.simpleInputPlaceholder)}
                          defaultValue={displayName}
                          onChange={(evt) =>
                            setEditedFilename(evt.target.value)
                          }
                        />
                      </Box>
                      <Box className={styles.editCaseFileDisplayDate}>
                        <InputMask
                          mask={'99.99.9999'}
                          maskPlaceholder={null}
                          value={editedDisplayDate || ''}
                          onChange={(evt) => {
                            setEditedDisplayDate(evt.target.value)
                          }}
                        >
                          <Input
                            name="fileDisplayDate"
                            size="xs"
                            placeholder={formatDate(new Date(), DDMMYYYY)}
                            autoComplete="off"
                          />
                        </InputMask>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <button
                        onClick={handleEditFileButtonClick}
                        className={styles.editCaseFileButton}
                      >
                        <Icon icon="checkmark" color="blue400" />
                      </button>
                      <Box marginLeft={1}>
                        <button
                          onClick={() => onDelete(caseFile.id)}
                          className={styles.editCaseFileButton}
                        >
                          <Icon icon="trash" color="blue400" type="outline" />
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
                      <Box marginLeft={2}>
                        <Icon icon="open" type="outline" size="small" />
                      </Box>
                    )}
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box marginRight={1}>
                      <Text variant="small">{displayDate}</Text>
                    </Box>
                    <button
                      onClick={() => setIsEditing(true)}
                      className={styles.editCaseFileButton}
                    >
                      <Icon icon="pencil" color="blue400" />
                    </button>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </div>
      )}
    </Reorder.Item>
  )
}

const IndictmentsCaseFilesAccordionItem: React.FC<
  React.PropsWithChildren<Props>
> = (props) => {
  const {
    policeCaseNumber,
    caseFiles,
    caseId,
    shouldStartExpanded,
    subtypes,
    crimeScenes,
  } = props
  const { formatMessage } = useIntl()
  const [updateFilesMutation] = useUpdateFilesMutation()

  const { onOpen, fileNotFound, dismissFileNotFound } = useFileList({ caseId })
  const { handleRemove } = useS3Upload(caseId)

  const [reorderableItems, setReorderableItems] = useState<ReorderableItem[]>(
    [],
  )

  useEffect(() => {
    setReorderableItems([
      ...sortedFilesInChapter(0, caseFiles),
      {
        id: uuid(),
        displayText: formatMessage(m.chapterInvesitgationProcess),
        chapter: 1,
        isHeading: true,
        isDivider: false,
      },
      ...sortedFilesInChapter(1, caseFiles),
      {
        id: uuid(),
        displayText: formatMessage(m.chapterWitnesses),
        chapter: 2,
        isHeading: true,
        isDivider: false,
      },
      ...sortedFilesInChapter(2, caseFiles),
      {
        id: uuid(),
        displayText: formatMessage(m.chapterDefendant),
        chapter: 3,
        isHeading: true,
        isDivider: false,
      },
      ...sortedFilesInChapter(3, caseFiles),
      {
        id: uuid(),
        displayText: formatMessage(m.chapterCaseFiles),
        chapter: 4,
        isHeading: true,
        isDivider: false,
      },
      ...sortedFilesInChapter(4, caseFiles),
      {
        id: uuid(),
        displayText: formatMessage(m.chapterElectronicDocuments),
        chapter: 5,
        isHeading: true,
        isDivider: false,
      },
      ...sortedFilesInChapter(5, caseFiles),
      {
        id: uuid(),
        displayText: `${formatMessage(m.unorderedFilesTitle)}|${formatMessage(
          m.unorderedFilesExplanation,
        )}`,
        isHeading: false,
        isDivider: true,
      },
      ...caseFiles
        .filter(
          (caseFile) =>
            caseFile.chapter === null || caseFile.chapter === undefined,
        )
        .map((caseFile) => {
          return {
            id: caseFile.id,
            created: caseFile.created,
            displayText: caseFile.name,
            userGeneratedFilename: caseFile.userGeneratedFilename,
            isDivider: false,
            isHeading: false,
            canOpen: Boolean(caseFile.key),
            displayDate: caseFile.displayDate,
          }
        }),
    ])
  }, [caseFiles, formatMessage])

  const handleReorder = async (fileId?: string) => {
    if (!fileId) {
      return
    }

    const [chapter, orderWithinChapter, filesToUpdate] = getFilesToUpdate(
      fileId,
      reorderableItems,
    )

    const { errors } = await updateFilesMutation({
      variables: {
        input: {
          caseId,
          files: filesToUpdate.map((file, index) => {
            return {
              id: file.id,
              chapter,
              orderWithinChapter:
                orderWithinChapter === null ? null : orderWithinChapter + index,
            }
          }),
        },
      },
    })

    if (errors) {
      toast.error(formatMessage(m.reorderFailedErrorMessage))
    }
  }

  const handleRename = async (
    fileId: string,
    newName?: string,
    newDisplayDate?: string,
  ) => {
    let newDate: Date | null = null
    const fileInReorderableItems = reorderableItems.findIndex(
      (item) => item.id === fileId,
    )

    if (fileInReorderableItems === -1) {
      return
    }

    if (newDisplayDate) {
      const [day, month, year] = newDisplayDate.split('.')
      newDate = parseISO(`${year}-${month}-${day}`)

      if (!isValid(newDate)) {
        toast.error(formatMessage(m.invalidDateErrorMessage))
        return
      }
    }

    setReorderableItems((prev) => {
      const newReorderableItems = [...prev]
      newReorderableItems[fileInReorderableItems].userGeneratedFilename =
        newName
      newReorderableItems[fileInReorderableItems].displayDate = newDate
        ? newDate.toISOString()
        : newReorderableItems[fileInReorderableItems].displayDate

      return newReorderableItems
    })

    const { errors } = await updateFilesMutation({
      variables: {
        input: {
          caseId,
          files: [
            {
              id: fileId,
              userGeneratedFilename: newName,
              ...(newDate && { displayDate: newDate.toISOString() }),
            },
          ],
        },
      },
    })

    if (errors) {
      toast.error(formatMessage(m.renameFailedErrorMessage))
    }
  }

  const handleDelete = (fileId: string) => {
    handleRemove({ id: fileId } as TUploadFile, (file: TUploadFile) =>
      setReorderableItems((prev) => prev.filter((item) => item.id !== file.id)),
    )
  }

  return (
    <>
      <AccordionItem
        id="IndictmentsCaseFilesAccordionItem"
        label={formatMessage(m.title, {
          policeCaseNumber,
        })}
        labelVariant="h3"
        startExpanded={shouldStartExpanded}
      >
        <Box marginBottom={3}>
          <IndictmentInfo
            policeCaseNumber={policeCaseNumber}
            subtypes={subtypes}
            crimeScenes={crimeScenes}
          />
        </Box>
        <Box marginBottom={3}>
          <Text>{formatMessage(m.explanation)}</Text>
        </Box>
        {/* 
      Render the first chapter here, outside the reorder group because 
      you should not be able to put a file above the first chapter.
       */}
        <Box marginBottom={2}>
          {renderChapter(
            0,
            formatMessage(m.chapterIndictmentAndAccompanyingDocuments),
          )}
        </Box>
        <Reorder.Group
          axis="y"
          values={reorderableItems}
          onReorder={setReorderableItems}
          className={styles.reorderGroup}
        >
          {reorderableItems.map((item) => {
            return (
              <Box key={item.id} marginBottom={2}>
                <CaseFile
                  caseFile={item}
                  onReorder={handleReorder}
                  onOpen={onOpen}
                  onRename={handleRename}
                  onDelete={handleDelete}
                />
              </Box>
            )
          })}
        </Reorder.Group>
        <AnimatePresence>
          {reorderableItems.length > 0 &&
            reorderableItems[reorderableItems.length - 1].isDivider && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AlertMessage
                  type="success"
                  message={formatMessage(m.noCaseFiles)}
                />
              </motion.div>
            )}
        </AnimatePresence>
      </AccordionItem>
      <AnimatePresence>
        {fileNotFound && <FileNotFoundModal dismiss={dismissFileNotFound} />}
      </AnimatePresence>
    </>
  )
}

export default IndictmentsCaseFilesAccordionItem
