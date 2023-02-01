import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'

import {
  CaseFile,
  CaseFileCategory,
  completedCaseStates,
  isExtendedCourtRole,
} from '@island.is/judicial-system/types'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import { Box, Text } from '@island.is/island-ui/core'
import { core, errors } from '@island.is/judicial-system-web/messages'
import { UserRole } from '@island.is/judicial-system-web/src/graphql/schema'

import PdfButton from '../PdfButton/PdfButton'
import { caseFiles } from '../../routes/Prosecutor/Indictments/CaseFiles/CaseFiles.strings'
import { indictmentCaseFilesList as strings } from './IndictmentCaseFilesList.strings'
import { useFileList } from '../../utils/hooks'
import { UserContext } from '../UserProvider/UserProvider'
import SectionHeading from '../SectionHeading/SectionHeading'
import * as styles from './IndictmentCaseFilesList.css'
import { courtRecord } from '../../routes/Court/Indictments/CourtRecord/CourtRecord.strings'
import Modal from '../Modal/Modal'

interface Props {
  workingCase: Case
}

interface RenderFilesProps {
  caseFiles: CaseFile[]
  onOpenFile: (fileId: string) => void
}

const RenderFiles: React.FC<Props & RenderFilesProps> = (props) => {
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
            handleClick={() => onOpenFile(file.id)}
          />
        </Box>
      ))}
    </>
  )
}

const IndictmentCaseFilesList: React.FC<Props> = (props) => {
  const { workingCase } = props
  const { formatMessage } = useIntl()
  const { onOpen, fileNotFound, dismissFileNotFound } = useFileList({
    caseId: workingCase.id,
  })
  const { user } = useContext(UserContext)

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
      file.category === CaseFileCategory.CASE_FILE && !file.policeCaseNumber,
  )
  const rulings = cf.filter((file) => file.category === CaseFileCategory.RULING)
  const courtRecords = cf.filter(
    (file) => file.category === CaseFileCategory.COURT_RECORD,
  )

  return (
    <>
      <Box marginBottom={10}>
        <SectionHeading title={formatMessage(strings.title)} />
        {coverLetters && coverLetters.length > 0 && (
          <Box marginBottom={5}>
            <Text variant="h4" as="h4" marginBottom={1}>
              {formatMessage(caseFiles.sections.coverLetter)}
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
              {formatMessage(caseFiles.sections.indictment)}
            </Text>
            <RenderFiles
              caseFiles={indictments}
              onOpenFile={onOpen}
              workingCase={workingCase}
            />
          </Box>
        )}
        {criminalRecords && criminalRecords.length > 0 && (
          <Box marginBottom={5}>
            <Text variant="h4" as="h4" marginBottom={1}>
              {formatMessage(caseFiles.sections.criminalRecord)}
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
              {formatMessage(caseFiles.sections.costBreakdown)}
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
              {formatMessage(caseFiles.sections.otherDocuments)}
            </Text>
            <RenderFiles
              caseFiles={others}
              onOpenFile={onOpen}
              workingCase={workingCase}
            />
          </Box>
        )}
        {user?.role !== UserRole.Defender && (
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
                  pdfType="caseFiles"
                  policeCaseNumber={policeCaseNumber}
                  renderAs="row"
                />
              </Box>
            ))}
          </Box>
        )}
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
        {fileNotFound && (
          <Modal
            title={formatMessage(errors.fileNotFoundModalTitle)}
            onClose={() => dismissFileNotFound()}
            onPrimaryButtonClick={() => dismissFileNotFound()}
            primaryButtonText={formatMessage(core.closeModal)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default IndictmentCaseFilesList
