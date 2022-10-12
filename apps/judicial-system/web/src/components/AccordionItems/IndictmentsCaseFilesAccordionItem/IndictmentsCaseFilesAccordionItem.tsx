import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { Reorder, useDragControls, useMotionValue } from 'framer-motion'

import { AccordionItem, Text, Box, Icon } from '@island.is/island-ui/core'
import { CaseFile as TCaseFile } from '@island.is/judicial-system/types'
import { formatDate } from '@island.is/judicial-system/formatters'

import { indictmentsCaseFilesAccordionItem as m } from './IndictmentsCaseFilesAccordionItem.strings'
import * as styles from './Chapter.css'

interface Props {
  policeCaseNumber: string
  caseFiles: TCaseFile[]
}

interface ChapterProps {
  name: string
  index: number
}

interface CaseFileProps {
  caseFile: TCaseFile
}

const Chapter: React.FC<ChapterProps> = (props) => (
  <li className={styles.chapterContainer}>
    <Box marginRight={3}>
      <Text variant="h4">{`${props.index + 1}.`}</Text>
    </Box>
    <Text variant="h4">{props.name}</Text>
  </li>
)

const CaseFile: React.FC<CaseFileProps> = (props) => {
  const { caseFile } = props
  const y = useMotionValue(0)
  const controls = useDragControls()

  return (
    <Reorder.Item
      key={caseFile.id}
      value={caseFile}
      id={caseFile.id}
      style={{ y }}
      dragListener={false}
      dragControls={controls}
    >
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        background="blue100"
        padding={2}
        borderRadius="large"
      >
        <Box display="flex" alignItems="center">
          <Box
            display="flex"
            marginRight={3}
            onPointerDown={(e) => controls.start(e)}
          >
            <Icon icon="menu" color="blue400" />
          </Box>
          <Text variant="h5">{caseFile.name}</Text>
        </Box>
        <Box display="flex" alignItems="center">
          <Box display="flex" marginRight={3}>
            <Text variant="small">{formatDate(caseFile.modified, 'P')}</Text>
          </Box>
          <button onClick={() => alert('not implemented')}>
            <Icon icon="pencil" color="blue400" />
          </button>
        </Box>
      </Box>
    </Reorder.Item>
  )
}

const IndictmentsCaseFilesAccordionItem: React.FC<Props> = (props) => {
  const { policeCaseNumber, caseFiles } = props
  const { formatMessage } = useIntl()

  const renderChapters = () => {
    return [
      formatMessage(m.chapterIndictmentAndAccompanyingDocuments),
      formatMessage(m.chapterInvesitgationProcess),
      formatMessage(m.chapterWitnesses),
      formatMessage(m.chapterDefendant),
      formatMessage(m.chapterCaseFiles),
      formatMessage(m.chapterElectronicDocuments),
    ].map((chapter, index) => {
      return <Chapter key={index} name={chapter} index={index} />
    })
  }

  const [items, setItems] = useState<TCaseFile[]>(caseFiles)

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
            values={[...renderChapters(), ...items]}
            onReorder={setItems}
          >
            {renderChapters()}
            <Box marginBottom={2}>
              <Box marginBottom={1}>
                <Text variant="h4">{formatMessage(m.unorderedFilesTitle)}</Text>
              </Box>
              <Text>{formatMessage(m.unorderedFilesExplanation)}</Text>
            </Box>
            {items
              .filter((i) => i.id)
              .map((item, index) => (
                <Box
                  key={item.id}
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
