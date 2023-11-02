import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'

import { Box, Text } from '@island.is/island-ui/core'
import {
  CaseFile,
  CaseFileCategory,
  completedCaseStates,
  isExtendedCourtRole,
} from '@island.is/judicial-system/types'
import {
  FileNotFoundModal,
  PdfButton,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import { useFileList } from '@island.is/judicial-system-web/src/utils/hooks'
import { isTrafficViolationCase } from '@island.is/judicial-system-web/src/utils/stepHelper'

import { courtRecord } from '../../routes/Court/Indictments/CourtRecord/CourtRecord.strings'
import { caseFiles } from '../../routes/Prosecutor/Indictments/CaseFiles/CaseFiles.strings'
import { indictmentCaseFilesList as strings } from './IndictmentCaseFilesList.strings'
import * as styles from './IndictmentCaseFilesList.css'

interface Props {
  workingCase: Case
}

interface RenderFilesProps {
  caseFiles: CaseFile[]
  onOpenFile: (fileId: string) => void
}

const RenderFiles: React.FC<
  React.PropsWithChildren<Props & RenderFilesProps>
> = (props) => {
  const { caseFiles, onOpenFile, workingCase } = props

  return (
    <>
      {caseFiles.map((file) => (
        <Box
          key={file.id}
          marginBottom={2}
          className={styles.caseFileContainer}
        >
          <PdfButton
            caseId={workingCase.id}
            title={file.name}
            renderAs="row"
            disabled={!file.key}
            handleClick={() => onOpenFile(file.id)}
          />
        </Box>
      ))}
    </>
  )
}

const IndictmentCaseFilesList: React.FC<React.PropsWithChildren<Props>> = (
  props,
) => {
  const { workingCase } = props
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { onOpen, fileNotFound, dismissFileNotFound } = useFileList({
    caseId: workingCase.id,
  })

  const showTrafficViolationCaseFiles = isTrafficViolationCase(workingCase)

  const cf = workingCase.caseFiles

  const coverLetters = cf?.filter(
    (file) => file.category === CaseFileCategory.COVER_LETTER,
  )
  const indictments = cf?.filter(
    (file) => file.category === CaseFileCategory.INDICTMENT,
  )
  const criminalRecords = cf?.filter(
    (file) => file.category === CaseFileCategory.CRIMINAL_RECORD,
  )
  const costBreakdowns = cf?.filter(
    (file) => file.category === CaseFileCategory.COST_BREAKDOWN,
  )
  const others = cf?.filter(
    (file) =>
      file.category === CaseFileCategory.CASE_FILE && !file.policeCaseNumber,
  )
  const rulings = cf?.filter(
    (file) => file.category === CaseFileCategory.RULING,
  )
  const courtRecords = cf?.filter(
    (file) => file.category === CaseFileCategory.COURT_RECORD,
  )

  return (
    <>
      <Box marginBottom={10}>
        <SectionHeading title={formatMessage(strings.title)} />
        {coverLetters && coverLetters.length > 0 && (
          <Box marginBottom={5}>
            <Text variant="h4" as="h4" marginBottom={1}>
              {formatMessage(caseFiles.coverLetterSection)}
            </Text>
            <RenderFiles
              caseFiles={coverLetters}
              onOpenFile={onOpen}
              workingCase={workingCase}
            />
          </Box>
        )}
        {indictments && indictments.length > 0 && (
          <Box marginBottom={5}>
            <Text variant="h4" as="h4" marginBottom={1}>
              {formatMessage(caseFiles.indictmentSection)}
            </Text>
            <RenderFiles
              caseFiles={indictments}
              onOpenFile={onOpen}
              workingCase={workingCase}
            />
          </Box>
        )}
        {showTrafficViolationCaseFiles && (
          <Box marginBottom={5}>
            <Text variant="h4" as="h4" marginBottom={1}>
              {formatMessage(caseFiles.indictmentSection)}
            </Text>
            <Box
              marginBottom={2}
              key={`indictment-${workingCase.id}`}
              className={styles.caseFileContainer}
            >
              <PdfButton
                caseId={workingCase.id}
                title={formatMessage(caseFiles.trafficViolationIndictmentTitle)}
                pdfType={'indictment'}
                renderAs="row"
              />
            </Box>
          </Box>
        )}
        {criminalRecords && criminalRecords.length > 0 && (
          <Box marginBottom={5}>
            <Text variant="h4" as="h4" marginBottom={1}>
              {formatMessage(caseFiles.criminalRecordSection)}
            </Text>
            <RenderFiles
              caseFiles={criminalRecords}
              onOpenFile={onOpen}
              workingCase={workingCase}
            />
          </Box>
        )}
        {costBreakdowns && costBreakdowns.length > 0 && (
          <Box marginBottom={5}>
            <Text variant="h4" as="h4" marginBottom={1}>
              {formatMessage(caseFiles.costBreakdownSection)}
            </Text>
            <RenderFiles
              caseFiles={costBreakdowns}
              onOpenFile={onOpen}
              workingCase={workingCase}
            />
          </Box>
        )}
        {others && others.length > 0 && (
          <Box marginBottom={5}>
            <Text variant="h4" as="h4" marginBottom={1}>
              {formatMessage(caseFiles.otherDocumentsSection)}
            </Text>
            <RenderFiles
              caseFiles={others}
              onOpenFile={onOpen}
              workingCase={workingCase}
            />
          </Box>
        )}

        <Box marginBottom={5}>
          <Text variant="h4" as="h4" marginBottom={1}>
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
                pdfType={'caseFilesRecord'}
                policeCaseNumber={policeCaseNumber}
                renderAs="row"
              />
            </Box>
          ))}
        </Box>

        {(user && isExtendedCourtRole(user.role)) ||
        completedCaseStates.includes(workingCase.state) ? (
          <>
            {courtRecords && courtRecords.length > 0 && (
              <Box marginBottom={5}>
                <Text variant="h4" as="h4" marginBottom={1}>
                  {formatMessage(courtRecord.courtRecordTitle)}
                </Text>
                <RenderFiles
                  caseFiles={courtRecords}
                  onOpenFile={onOpen}
                  workingCase={workingCase}
                />
              </Box>
            )}
            {rulings && rulings.length > 0 && (
              <Box marginBottom={5}>
                <Text variant="h4" as="h4" marginBottom={1}>
                  {formatMessage(courtRecord.rulingTitle)}
                </Text>
                <RenderFiles
                  caseFiles={rulings}
                  onOpenFile={onOpen}
                  workingCase={workingCase}
                />
              </Box>
            )}
          </>
        ) : null}
      </Box>
      <AnimatePresence>
        {fileNotFound && <FileNotFoundModal dismiss={dismissFileNotFound} />}
      </AnimatePresence>
    </>
  )
}

export default IndictmentCaseFilesList
