import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import {
  animate,
  MotionValue,
  Reorder,
  useDragControls,
  useMotionValue,
} from 'framer-motion'

import { AccordionItem, Text, Box, Icon } from '@island.is/island-ui/core'
import { CaseFile as TCaseFile } from '@island.is/judicial-system/types'
import { formatDate } from '@island.is/judicial-system/formatters'

import { indictmentsCaseFilesAccordionItem as m } from './IndictmentsCaseFilesAccordionItem.strings'
import * as styles from './Chapter.css'

interface Props {
  policeCaseNumber: string
  caseFiles: TCaseFile[]
}

interface CaseFileProps {
  caseFile: [string, boolean, boolean]
}

const inactiveShadow = '0px 0px 0px rgba(0,0,0,0.8)'

export function useRaisedShadow(value: MotionValue<number>) {
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
  const { caseFile } = props
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const controls = useDragControls()
  const [isDragging, setIsDragging] = useState(false)

  return (
    <Reorder.Item
      value={caseFile}
      id={caseFile[0]}
      style={{ y, boxShadow, userSelect: isDragging ? 'none' : 'auto' }}
      className={styles.reorderItem}
      dragListener={false}
      dragControls={controls}
    >
      {caseFile[1] === true ? (
        <Box className={styles.chapterContainer}>
          <Box marginRight={3}>
            <Text variant="h4">{`${1}.`}</Text>
          </Box>
          <Text variant="h4">{caseFile[0]}</Text>
        </Box>
      ) : caseFile[2] === true ? (
        <Box marginBottom={2}>
          <Box marginBottom={1}>
            <Text variant="h4">{caseFile[0].split('|')[0]}</Text>
          </Box>
          <Text>{caseFile[0].split('|')[1]}</Text>
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
            >
              <Icon icon="menu" color="blue400" />
            </Box>
            <Text variant="h5">{caseFile[0]}</Text>
          </Box>
          <Box display="flex" alignItems="center">
            <Box display="flex" marginRight={3}>
              <Text variant="small">{formatDate(new Date(), 'P')}</Text>
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
  const { policeCaseNumber, caseFiles } = props
  const { formatMessage } = useIntl()

  const [items, setItems] = useState<[string, boolean, boolean][]>([
    [formatMessage(m.chapterIndictmentAndAccompanyingDocuments), true, false],
    [formatMessage(m.chapterInvesitgationProcess), true, false],
    [formatMessage(m.chapterWitnesses), true, false],
    [formatMessage(m.chapterDefendant), true, false],
    [formatMessage(m.chapterCaseFiles), true, false],
    [formatMessage(m.chapterElectronicDocuments), true, false],
    [
      `${formatMessage(m.unorderedFilesTitle)}|${formatMessage(
        m.unorderedFilesExplanation,
      )}`,
      false,
      true,
    ],
    ...caseFiles.map((caseFile) => {
      return [caseFile.id, false, false] as [string, boolean, boolean]
    }),
  ])

  return (
    <AccordionItem
      id="IndictmentsCaseFilesAccordionItem"
      label={formatMessage(m.title, {
        policeCaseNumber,
      })}
      labelVariant="h3"
      startExpanded
    >
      {caseFiles.length === 0 ? (
        <Text>{formatMessage(m.noCaseFiles)}</Text>
      ) : (
        <>
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
              <Box
                key={`${item[0]}-${policeCaseNumber}`}
                marginBottom={index === caseFiles.length - 1 ? 0 : 2}
              >
                <CaseFile caseFile={item} />
              </Box>
            ))}
          </Reorder.Group>
        </>
      )}
    </AccordionItem>
  )
}

export default IndictmentsCaseFilesAccordionItem
