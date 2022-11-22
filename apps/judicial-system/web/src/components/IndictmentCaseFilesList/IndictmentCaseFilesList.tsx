import React from 'react'
import { useIntl } from 'react-intl'

import {
  Case,
  CaseFile,
  CaseFileCategory,
} from '@island.is/judicial-system/types'
import { Box, Text } from '@island.is/island-ui/core'

import PdfButton from '../PdfButton/PdfButton'
import { caseFiles } from '../../routes/Prosecutor/Indictments/CaseFiles/CaseFiles.strings'
import { indictmentCaseFilesList as strings } from './IndictmentCaseFilesList.strings'
import { useFileList } from '../../utils/hooks'
import * as styles from './IndictmentCaseFilesList.css'

interface Props {
  workingCase: Case
}

const IndictmentCaseFilesList: React.FC<Props> = (props) => {
  const { workingCase } = props
  const { formatMessage } = useIntl()
  const { onOpen } = useFileList({ caseId: workingCase.id })

  const cf = workingCase.caseFiles

  if (!cf || cf.length <= 0) {
    return null
  }

  const coverLetters = cf.filter(
    (file) => file.category === CaseFileCategory.COVER_LETTER,
  )
  const indictments = cf.filter(
    (file) => file.category === CaseFileCategory.INDICTMENT,
  )
  const criminalRecords = cf.filter(
    (file) => file.category === CaseFileCategory.CRIMINAL_RECORD,
  )
  const costBreakdowns = cf.filter(
    (file) => file.category === CaseFileCategory.COST_BREAKDOWN,
  )
  const others = cf.filter(
    (file) =>
      file.category === CaseFileCategory.CASE_FILE &&
      !Boolean(file.policeCaseNumber),
  )

  const renderFiles = (caseFiles: CaseFile[]) => {
    return caseFiles.map((file) => (
      <Box key={file.id} marginBottom={2} className={styles.caseFileContainer}>
        <PdfButton
          caseId={workingCase.id}
          title={file.name}
          renderAs="row"
          handleClick={() => onOpen(file.id)}
        />
      </Box>
    ))
  }

  return (
    <Box marginBottom={10}>
      {coverLetters && coverLetters.length > 0 && (
        <Box marginBottom={5}>
          <Text variant="h3" marginBottom={1}>
            {formatMessage(caseFiles.sections.coverLetter)}
          </Text>
          {renderFiles(coverLetters)}
        </Box>
      )}
      {indictments && indictments.length > 0 && (
        <Box marginBottom={5}>
          <Text variant="h3" marginBottom={1}>
            {formatMessage(caseFiles.sections.indictment)}
          </Text>
          {renderFiles(indictments)}
        </Box>
      )}
      {criminalRecords && criminalRecords.length > 0 && (
        <Box marginBottom={5}>
          <Text variant="h3" marginBottom={1}>
            {formatMessage(caseFiles.sections.criminalRecord)}
          </Text>
          {renderFiles(criminalRecords)}
        </Box>
      )}
      {costBreakdowns && costBreakdowns.length > 0 && (
        <Box marginBottom={5}>
          <Text variant="h3" marginBottom={1}>
            {formatMessage(caseFiles.sections.costBreakdown)}
          </Text>
          {renderFiles(costBreakdowns)}
        </Box>
      )}
      {others && others.length > 0 && (
        <Box marginBottom={5}>
          <Text variant="h3" marginBottom={1}>
            {formatMessage(caseFiles.sections.otherDocuments)}
          </Text>
          {renderFiles(others)}
        </Box>
      )}
      <Text variant="h3" marginBottom={1}>
        {formatMessage(strings.caseFileTitle)}
      </Text>
      {workingCase.policeCaseNumbers.map((policeCaseNumber, index) => (
        <Box
          marginBottom={2}
          key={`${policeCaseNumber}-${index}`}
          className={styles.caseFileContainer}
        >
          <PdfButton
            caseId={workingCase.id}
            title={formatMessage(strings.caseFileButtonText, {
              policeCaseNumber,
            })}
            pdfType="caseFiles"
            policeCaseNumber={policeCaseNumber}
            renderAs="row"
          />
        </Box>
      ))}
    </Box>
  )
}

export default IndictmentCaseFilesList
