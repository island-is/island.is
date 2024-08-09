import React, { FC, useContext } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'

import { Box, Text } from '@island.is/island-ui/core'
import {
  isCompletedCase,
  isDistrictCourtUser,
  isPublicProsecutor,
  isPublicProsecutorUser,
  isTrafficViolationCase,
} from '@island.is/judicial-system/types'
import {
  FileNotFoundModal,
  PdfButton,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseFile,
  CaseFileCategory,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import { useFileList } from '@island.is/judicial-system-web/src/utils/hooks'

import { caseFiles } from '../../routes/Prosecutor/Indictments/CaseFiles/CaseFiles.strings'
import { strings } from './IndictmentCaseFilesList.strings'

interface Props {
  workingCase: Case
  displayHeading?: boolean
}

interface RenderFilesProps {
  caseFiles: CaseFile[]
  onOpenFile: (fileId: string) => void
}

export const filterCaseFilesByCategory = (
  categories: CaseFileCategory[],
  caseFiles?: CaseFile[] | null,
) => {
  if (!caseFiles) {
    return []
  }

  return caseFiles.filter((c) => c.category && categories.includes(c.category))
}

export const RenderFiles: FC<Props & RenderFilesProps> = ({
  caseFiles,
  onOpenFile,
  workingCase,
}) => {
  return (
    <>
      {caseFiles.map((file) => (
        <Box key={file.id} marginBottom={2}>
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

const IndictmentCaseFilesList: FC<Props> = ({
  workingCase,
  displayHeading = true,
}) => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { onOpen, fileNotFound, dismissFileNotFound } = useFileList({
    caseId: workingCase.id,
  })

  const showTrafficViolationCaseFiles = isTrafficViolationCase(workingCase)
  const cf = workingCase.caseFiles
  const indictments = filterCaseFilesByCategory(
    [CaseFileCategory.INDICTMENT],
    cf,
  )
  const rulings = filterCaseFilesByCategory([CaseFileCategory.RULING], cf)

  const criminalRecords = filterCaseFilesByCategory(
    [CaseFileCategory.CRIMINAL_RECORD],
    cf,
  )

  const costBreakdowns = filterCaseFilesByCategory(
    [CaseFileCategory.COST_BREAKDOWN],
    cf,
  )

  const courtRecords = filterCaseFilesByCategory(
    [CaseFileCategory.COURT_RECORD],
    cf,
  )

  const criminalRecordUpdate = filterCaseFilesByCategory(
    [CaseFileCategory.CRIMINAL_RECORD_UPDATE],
    cf,
  )

  const others = cf?.filter(
    (file) =>
      file.category === CaseFileCategory.INVOICE ||
      (file.category === CaseFileCategory.CASE_FILE && !file.policeCaseNumber),
  )

  return (
    <>
      {displayHeading && (
        <SectionHeading title={formatMessage(strings.title)} />
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
          <Box marginBottom={2} key={`indictment-${workingCase.id}`}>
            <PdfButton
              caseId={workingCase.id}
              title={formatMessage(caseFiles.trafficViolationIndictmentTitle)}
              pdfType="indictment"
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
      {criminalRecordUpdate &&
        criminalRecordUpdate.length > 0 &&
        (isDistrictCourtUser(user) ||
          isPublicProsecutor(user) ||
          isPublicProsecutorUser(user)) && (
          <Box marginBottom={5}>
            <Text variant="h4" as="h4" marginBottom={1}>
              {formatMessage(caseFiles.criminalRecordUpdateSection)}
            </Text>
            <RenderFiles
              caseFiles={criminalRecordUpdate}
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
        {workingCase.policeCaseNumbers?.map((policeCaseNumber, index) => (
          <Box marginBottom={2} key={`${policeCaseNumber}-${index}`}>
            <PdfButton
              caseId={workingCase.id}
              title={formatMessage(strings.caseFileButtonText, {
                policeCaseNumber,
              })}
              pdfType="caseFilesRecord"
              elementId={policeCaseNumber}
              renderAs="row"
            />
          </Box>
        ))}
      </Box>
      {(isDistrictCourtUser(user) || isCompletedCase(workingCase.state)) &&
      (courtRecords?.length || rulings?.length) ? (
        <Box marginBottom={5}>
          <Text variant="h4" as="h4" marginBottom={1}>
            {formatMessage(strings.rulingAndCourtRecordsTitle)}
          </Text>
          {courtRecords && courtRecords.length > 0 && (
            <RenderFiles
              caseFiles={courtRecords}
              onOpenFile={onOpen}
              workingCase={workingCase}
            />
          )}
          {rulings && rulings.length > 0 && (
            <RenderFiles
              caseFiles={rulings}
              onOpenFile={onOpen}
              workingCase={workingCase}
            />
          )}
        </Box>
      ) : null}

      <AnimatePresence>
        {fileNotFound && <FileNotFoundModal dismiss={dismissFileNotFound} />}
      </AnimatePresence>
    </>
  )
}

export default IndictmentCaseFilesList
