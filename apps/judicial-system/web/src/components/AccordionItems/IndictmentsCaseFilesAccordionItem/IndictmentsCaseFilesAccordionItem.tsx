import {
  Dispatch,
  FC,
  PointerEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { useIntl } from 'react-intl'
import {
  animate,
  AnimatePresence,
  motion,
  MotionValue,
  Reorder,
  useDragControls,
  useMotionValue,
} from 'motion/react'
import { v4 as uuid } from 'uuid'

import {
  AccordionItem,
  AlertMessage,
  Box,
  FileUploadStatus,
  Text,
  toast,
} from '@island.is/island-ui/core'
import {
  CrimeSceneMap,
  IndictmentSubtypeMap,
} from '@island.is/judicial-system/types'
import {
  FileNotFoundModal,
  IndictmentInfo,
} from '@island.is/judicial-system-web/src/components'
import { CaseFile as TCaseFile } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  TUploadFile,
  useFileList,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'

import EditableCaseFile, {
  TEditableCaseFile,
} from '../../EditableCaseFile/EditableCaseFile'
import { useUpdateFilesMutation } from './updateFiles.generated'
import { strings } from './IndictmentsCaseFilesAccordionItem.strings'
import * as styles from './IndictmentsCaseFilesAccordionItem.css'

interface Props {
  policeCaseNumber: string
  caseFiles: TCaseFile[]
  caseId: string
  shouldStartExpanded: boolean
  subtypes?: IndictmentSubtypeMap
  crimeScenes?: CrimeSceneMap
  setEditCount: Dispatch<SetStateAction<number>>
}

interface CaseFileProps {
  caseFile: ReorderableItem
  onReorder: (id?: string) => void
  onOpen: (id: string) => void
  onRename: (id: string, name: string, displayDate: string) => void
  onDelete: (file: TUploadFile) => void
  setEditCount: Dispatch<SetStateAction<number>>
}

export interface ReorderableItem extends TEditableCaseFile {
  isDivider: boolean
  isHeading: boolean
  chapter?: number | null
  orderWithinChapter?: number | null
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
    return [
      null,
      null,
      files[index].chapter === undefined || files[index].chapter === null
        ? []
        : [files[index]],
    ]
  }

  const chapter = files[index - 1]?.chapter ?? 0
  const orderWithinChapter = (files[index - 1]?.orderWithinChapter ?? -1) + 1

  if (
    files[index].chapter === chapter &&
    files[index].orderWithinChapter === orderWithinChapter
  ) {
    return [chapter, orderWithinChapter, []]
  }

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
        isDivider: false,
        isHeading: false,
        chapter: file.chapter,
        orderWithinChapter: file.orderWithinChapter,
        id: file.id,
        category: file.category,
        created: file.created,
        displayText: file.name,
        userGeneratedFilename: file.userGeneratedFilename,
        displayDate: file.displayDate,
        canOpen: file.isKeyAccessible ?? false,
        status: FileUploadStatus.done,
        canEdit: ['fileName', 'displayDate'] as const,
        size: file.size,
      }
    })
    .sort((a, b) => {
      if (
        a.orderWithinChapter === undefined ||
        a.orderWithinChapter === null ||
        b.orderWithinChapter === undefined ||
        b.orderWithinChapter === null
      ) {
        return 0
      }

      return a.orderWithinChapter - b.orderWithinChapter
    })
}

const renderChapter = (chapter: number, name?: string | null) => (
  <Box className={styles.chapterContainer} data-testid="chapter">
    <Box marginRight={3}>
      <Text variant="h4">{`${chapter + 1}.`}</Text>
    </Box>
    <Text variant="h4">{name}</Text>
  </Box>
)

const CaseFile: FC<CaseFileProps> = (props) => {
  const { caseFile, onReorder, onOpen, onRename, onDelete, setEditCount } =
    props
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const controls = useDragControls()
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const getCursorStyle = () => {
    if (caseFile.isDivider || caseFile.isHeading) {
      return 'default'
    }

    return isDragging ? 'grabbing' : 'grab'
  }

  const handlePointerDown = (evt: PointerEvent) => {
    if (caseFile.isDivider || caseFile.isHeading) {
      return
    }

    const target = evt.target as HTMLElement
    const tag = target.tagName.toLowerCase()

    if (tag !== 'input') {
      // Prevents text selection when dragging
      evt.preventDefault()
    }

    setIsDragging(true)
    controls.start(evt)
  }

  const handlePointerUp = () => {
    if (isDragging) {
      onReorder(caseFile.id)
    }
    setIsDragging(false)
  }

  return (
    <Reorder.Item
      value={caseFile}
      id={caseFile.id}
      style={{
        y,
        boxShadow,
        cursor: getCursorStyle(),
      }}
      className={styles.reorderItem}
      dragListener={false}
      dragControls={controls}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      drag
    >
      {caseFile.isHeading &&
      caseFile.chapter !== undefined &&
      caseFile.chapter !== null ? (
        renderChapter(caseFile.chapter, caseFile.displayText)
      ) : caseFile.isDivider ? (
        <Box marginBottom={2}>
          <Box marginBottom={1}>
            <Text variant="h4">{caseFile.displayText?.split('|')[0]}</Text>
          </Box>
          <Text>{caseFile.displayText?.split('|')[1]}</Text>
        </Box>
      ) : (
        <EditableCaseFile
          caseFile={caseFile}
          enableDrag
          onDelete={onDelete}
          onOpen={onOpen}
          onRename={onRename}
          onStartEditing={() => setEditCount((count) => count + 1)}
          onStopEditing={() => setEditCount((count) => count - 1)}
        />
      )}
    </Reorder.Item>
  )
}

const IndictmentsCaseFilesAccordionItem: FC<Props> = (props) => {
  const {
    policeCaseNumber,
    caseFiles,
    caseId,
    shouldStartExpanded,
    subtypes,
    crimeScenes,
    setEditCount,
  } = props
  const { formatMessage } = useIntl()
  const [updateFilesMutation] = useUpdateFilesMutation()
  const { onOpen, fileNotFound, dismissFileNotFound } = useFileList({
    caseId,
  })
  const { handleRemove } = useS3Upload(caseId)
  const [reorderableItems, setReorderableItems] = useState<ReorderableItem[]>(
    [],
  )

  useEffect(() => {
    setReorderableItems([
      ...sortedFilesInChapter(0, caseFiles),
      {
        id: uuid(),
        displayText: formatMessage(strings.chapterInvesitgationProcess),
        chapter: 1,
        isHeading: true,
        isDivider: false,
      },
      ...sortedFilesInChapter(1, caseFiles),
      {
        id: uuid(),
        displayText: formatMessage(strings.chapterWitnesses),
        chapter: 2,
        isHeading: true,
        isDivider: false,
      },
      ...sortedFilesInChapter(2, caseFiles),
      {
        id: uuid(),
        displayText: formatMessage(strings.chapterDefendant),
        chapter: 3,
        isHeading: true,
        isDivider: false,
      },
      ...sortedFilesInChapter(3, caseFiles),
      {
        id: uuid(),
        displayText: formatMessage(strings.chapterCaseFiles),
        chapter: 4,
        isHeading: true,
        isDivider: false,
      },
      ...sortedFilesInChapter(4, caseFiles),
      {
        id: uuid(),
        displayText: formatMessage(strings.chapterElectronicDocuments),
        chapter: 5,
        isHeading: true,
        isDivider: false,
      },
      ...sortedFilesInChapter(5, caseFiles),
      {
        id: uuid(),
        displayText: `${formatMessage(
          strings.unorderedFilesTitle,
        )}|${formatMessage(strings.unorderedFilesExplanation)}`,
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
            isDivider: false,
            isHeading: false,
            id: caseFile.id,
            category: caseFile.category,
            created: caseFile.created,
            displayText: caseFile.name,
            userGeneratedFilename: caseFile.userGeneratedFilename,
            displayDate: caseFile.displayDate,
            canOpen: caseFile.isKeyAccessible ?? false,
            status: FileUploadStatus.done,
            size: caseFile.size,
            canEdit: ['fileName', 'displayDate'] as const,
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

    if (filesToUpdate.length === 0) {
      return
    }

    const { errors } = await updateFilesMutation({
      variables: {
        input: {
          caseId,
          files: filesToUpdate.map((file, index) => {
            // This nasty update-in-place is needed to keep local data current
            file.chapter = chapter ?? undefined
            file.orderWithinChapter =
              orderWithinChapter === null
                ? undefined
                : orderWithinChapter + index
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
      toast.error(formatMessage(strings.reorderFailedErrorMessage))
    }
  }

  const handleRename = async (
    fileId: string,
    newName: string,
    newDisplayDate: string,
  ) => {
    setReorderableItems((prev) =>
      prev.map((item) =>
        item.id === fileId
          ? {
              ...item,
              userGeneratedFilename: newName,
              displayDate: newDisplayDate,
            }
          : item,
      ),
    )

    const { errors } = await updateFilesMutation({
      variables: {
        input: {
          caseId,
          files: [
            {
              id: fileId,
              userGeneratedFilename: newName,
              displayDate: newDisplayDate,
            },
          ],
        },
      },
    })

    if (errors) {
      toast.error(formatMessage(strings.renameFailedErrorMessage))
    }
  }

  const handleDelete = (file: TUploadFile) => {
    handleRemove({ id: file.id } as TUploadFile, (file) =>
      setReorderableItems((prev) => prev.filter((item) => item.id !== file.id)),
    )
  }

  return (
    <>
      <AccordionItem
        id="IndictmentsCaseFilesAccordionItem"
        label={formatMessage(strings.title, {
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
          <Text>{formatMessage(strings.explanation)}</Text>
        </Box>
        {/* 
      Render the first chapter here, outside the reorder group because 
      you should not be able to put a file above the first chapter.
       */}
        <Box marginBottom={2}>
          {renderChapter(
            0,
            formatMessage(strings.chapterIndictmentAndAccompanyingDocuments),
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
                  setEditCount={setEditCount}
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
                  message={formatMessage(strings.noCaseFiles)}
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
