import React from 'react'
import { useIntl } from 'react-intl'

import {
  AccordionItem,
  Text,
  Box,
  Icon,
  Button,
} from '@island.is/island-ui/core'
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
  name: string
  date: string
}

const Chapter: React.FC<ChapterProps> = (props) => (
  <li className={styles.chapterContainer}>
    <Box marginRight={3}>
      <Text variant="h4">{`${props.index + 1}.`}</Text>
    </Box>
    <Text variant="h4">{props.name}</Text>
  </li>
)

const CaseFile: React.FC<CaseFileProps> = (props) => (
  <Box
    display="flex"
    justifyContent="spaceBetween"
    alignItems="center"
    background="blue100"
    padding={2}
    borderRadius="large"
  >
    <Box display="flex" alignItems="center">
      <Box display="flex" marginRight={3}>
        <Icon icon="menu" color="blue400" />
      </Box>
      <Text variant="h5">{props.name}</Text>
    </Box>
    <Box display="flex" alignItems="center">
      <Box display="flex" marginRight={3}>
        <Text variant="small">{formatDate(props.date, 'P')}</Text>
      </Box>
      <button onClick={() => alert('not implemented')}>
        <Icon icon="pencil" color="blue400" />
      </button>
    </Box>
  </Box>
)

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
          <ol>{renderChapters()}</ol>
          <Box marginBottom={2}>
            <Box marginBottom={1}>
              <Text variant="h4">{formatMessage(m.unorderedFilesTitle)}</Text>
            </Box>
            <Text>{formatMessage(m.unorderedFilesExplanation)}</Text>
          </Box>
          {caseFiles.map((caseFile) => (
            <CaseFile name={caseFile.name} date={caseFile.modified} />
          ))}
        </>
      )}
    </AccordionItem>
  )
}

export default IndictmentsCaseFilesAccordionItem
