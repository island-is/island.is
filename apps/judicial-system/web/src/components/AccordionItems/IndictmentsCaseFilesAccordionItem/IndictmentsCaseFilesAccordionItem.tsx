import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import {
  animate,
  AnimatePresence,
  motion,
  MotionValue,
  Reorder,
  useDragControls,
  useMotionValue,
} from 'framer-motion'
import { useMutation } from '@apollo/client'

import {
  AccordionItem,
  Text,
  Box,
  Icon,
  AlertMessage,
} from '@island.is/island-ui/core'
import { CaseFile as TCaseFile } from '@island.is/judicial-system/types'
import { formatDate } from '@island.is/judicial-system/formatters'

import { indictmentsCaseFilesAccordionItem as m } from './IndictmentsCaseFilesAccordionItem.strings'
import * as styles from './Chapter.css'
import { UpdateFileMutation } from './IndictmentsCaseFilesAccordionItem.gql'

interface Props {
  policeCaseNumber: string
  caseFiles: TCaseFile[]
  caseId: string
}

interface CaseFileProps {
  caseFile: ReorderableItem
  index: number
  caseId: string
  onReorder: (id?: string) => void
}
interface ReorderableItem {
  displayText: string
  isChapter: boolean
  isDivider: boolean
  id?: string
  created?: string
}

interface UpdateFilesMutationResponse {
  caseFiles: TCaseFile[]
}

export function useRaisedShadow(value: MotionValue<number>) {
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

const CaseFile: React.FC<CaseFileProps> = (props) => {
  const { caseFile, index, caseId, onReorder } = props
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const controls = useDragControls()
  const [isDragging, setIsDragging] = useState(false)
  const [updateFilesMutation] = useMutation<UpdateFilesMutationResponse>(
    UpdateFileMutation,
  )

  return (
    <Reorder.Item
      value={caseFile}
      id={caseFile.displayText}
      style={{ y, boxShadow, userSelect: isDragging ? 'none' : 'auto' }}
      className={styles.reorderItem}
      dragListener={false}
      dragControls={controls}
    >
      {caseFile.isChapter ? (
        <Box className={styles.chapterContainer}>
          <Box marginRight={3} as="span">
            <Text variant="h4">{`${index + 1}.`}</Text>
          </Box>
          <Text variant="h4">{caseFile.displayText}</Text>
        </Box>
      ) : caseFile.isDivider ? (
        <Box marginBottom={2}>
          <Box marginBottom={1}>
            <Text variant="h4">{caseFile.displayText.split('|')[0]}</Text>
          </Box>
          <Text>{caseFile.displayText.split('|')[1]}</Text>
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          background="blue100"
          padding={2}
        >
          <Box display="flex" alignItems="center">
            <Box
              display="flex"
              marginRight={3}
              onPointerDown={(e) => {
                setIsDragging(true)
                controls.start(e)
              }}
              onPointerUp={() => {
                setIsDragging(false)
                onReorder(caseFile.id)
                // updateFilesMutation({
                //   variables: {
                //     input: {
                //       caseId,
                //       files: [
                //         {
                //           id: 'ba8859ec-88f4-463a-9a6c-9781a477dff3',
                //           chapter: 1,
                //           orderWithinChapter: 1,
                //         },
                //       ],
                //     },
                //   },
                // })
              }}
            >
              <Icon icon="menu" color="blue400" />
            </Box>
            <Text variant="h5">{caseFile.displayText}</Text>
          </Box>
          <Box display="flex" alignItems="center">
            <Box display="flex" marginRight={3}>
              <Text variant="small">{formatDate(caseFile.created, 'P')}</Text>
            </Box>
            <button onClick={() => alert('not implemented')}>
              <Icon icon="pencil" color="blue400" />
            </button>
          </Box>
        </Box>
      )}
    </Reorder.Item>
  )
}

const IndictmentsCaseFilesAccordionItem: React.FC<Props> = (props) => {
  const { policeCaseNumber, caseFiles, caseId } = props
  const { formatMessage } = useIntl()

  const [items, setItems] = useState<ReorderableItem[]>([
    {
      displayText: formatMessage(m.chapterIndictmentAndAccompanyingDocuments),
      isChapter: true,
      isDivider: false,
    },
    {
      displayText: formatMessage(m.chapterInvesitgationProcess),
      isChapter: true,
      isDivider: false,
    },
    {
      displayText: formatMessage(m.chapterWitnesses),
      isChapter: true,
      isDivider: false,
    },
    {
      displayText: formatMessage(m.chapterDefendant),
      isChapter: true,
      isDivider: false,
    },
    {
      displayText: formatMessage(m.chapterCaseFiles),
      isChapter: true,
      isDivider: false,
    },
    {
      displayText: formatMessage(m.chapterElectronicDocuments),
      isChapter: true,
      isDivider: false,
    },
    {
      displayText: `${formatMessage(m.unorderedFilesTitle)}|${formatMessage(
        m.unorderedFilesExplanation,
      )}`,
      isChapter: false,
      isDivider: true,
    },
    ...caseFiles.map((caseFile) => {
      return {
        displayText: caseFile.name,
        isChapter: false,
        isDivider: false,
        created: caseFile.created,
        id: caseFile.id,
      }
    }),
  ])

  const handleReorder = (fileId?: string) => {
    if (!fileId) {
      return
    }

    const chapters = (item: ReorderableItem) => {
      let counter = -1 // -1 because we don't want to count current document

      while (!item.isChapter) {
        counter++
        item = items[items.indexOf(item) - 1]
        chapters(item)
      }

      return [items.indexOf(item), counter]
    }

    const a = chapters(items[items.findIndex((item) => item.id === fileId)])

    console.log('reorder', a)
  }

  return (
    <AccordionItem
      id="IndictmentsCaseFilesAccordionItem"
      label={formatMessage(m.title, {
        policeCaseNumber,
      })}
      labelVariant="h3"
      startExpanded
    >
      <Box marginBottom={3}>
        <Text>{formatMessage(m.explanation)}</Text>
      </Box>
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className={styles.reorderGroup}
      >
        {items.map((item, index) => (
          <Box key={`${item.displayText}-${policeCaseNumber}`} marginBottom={2}>
            <CaseFile
              caseFile={item}
              index={index}
              caseId={caseId}
              onReorder={handleReorder}
            />
          </Box>
        ))}
      </Reorder.Group>
      <AnimatePresence>
        {items[items.length - 1].isDivider && (
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
  )
}

export default IndictmentsCaseFilesAccordionItem
