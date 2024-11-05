import { FC, useContext } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'

import { Box, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  isCompletedCase,
  isDefenceUser,
  isDistrictCourtUser,
  isProsecutionUser,
  isPublicProsecutor,
  isPublicProsecutorUser,
  isSuccessfulServiceStatus,
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

import { CaseFileTable } from '../Table'
import { caseFiles } from '../../routes/Prosecutor/Indictments/CaseFiles/CaseFiles.strings'
import { strings } from './IndictmentCaseFilesList.strings'

interface Props {
  workingCase: Case
  displayGeneratedPDFs?: boolean
  displayHeading?: boolean
  connectedCaseParentId?: string
}

interface RenderFilesProps {
  caseFiles: CaseFile[]
  onOpenFile: (fileId: string) => void
}

export const RenderFiles: FC<RenderFilesProps> = ({
  caseFiles,
  onOpenFile,
}) => {
  return (
    <>
      {caseFiles.map((file) => (
        <Box key={file.id} marginBottom={2}>
          <PdfButton
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
  displayGeneratedPDFs = true,
  displayHeading = true,
  connectedCaseParentId,
}) => {
  const { formatMessage } = useIntl()
  const { user, limitedAccess } = useContext(UserContext)
  const { onOpen, fileNotFound, dismissFileNotFound } = useFileList({
    caseId: workingCase.id,
    connectedCaseParentId,
  })

  const showTrafficViolationCaseFiles = isTrafficViolationCase(workingCase)
  const showSubpoenaPdf =
    displayGeneratedPDFs &&
    workingCase.defendants?.some(
      (defendant) => defendant.subpoenas && defendant.subpoenas.length > 0,
    )

  const cf = workingCase.caseFiles

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
    (file) => file.category === CaseFileCategory.CASE_FILE,
  )
  const rulings = cf?.filter(
    (file) => file.category === CaseFileCategory.RULING,
  )
  const courtRecords = cf?.filter(
    (file) => file.category === CaseFileCategory.COURT_RECORD,
  )
  const criminalRecordUpdate = cf?.filter(
    (file) => file.category === CaseFileCategory.CRIMINAL_RECORD_UPDATE,
  )
  const uploadedCaseFiles = cf?.filter(
    (file) =>
      file.category === CaseFileCategory.PROSECUTOR_CASE_FILE ||
      file.category === CaseFileCategory.DEFENDANT_CASE_FILE,
  )
  const civilClaims = cf?.filter(
    (file) => file.category === CaseFileCategory.CIVIL_CLAIM,
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
          <RenderFiles caseFiles={indictments} onOpenFile={onOpen} />
        </Box>
      )}
      {showTrafficViolationCaseFiles && displayGeneratedPDFs && (
        <Box marginBottom={5}>
          <Text variant="h4" as="h4" marginBottom={1}>
            {formatMessage(caseFiles.indictmentSection)}
          </Text>
          <Box marginBottom={2} key={`indictment-${workingCase.id}`}>
            <PdfButton
              caseId={workingCase.id}
              connectedCaseParentId={connectedCaseParentId}
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
          <RenderFiles caseFiles={criminalRecords} onOpenFile={onOpen} />
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
            <RenderFiles caseFiles={criminalRecordUpdate} onOpenFile={onOpen} />
          </Box>
        )}
      {costBreakdowns && costBreakdowns.length > 0 && (
        <Box marginBottom={5}>
          <Text variant="h4" as="h4" marginBottom={1}>
            {formatMessage(caseFiles.costBreakdownSection)}
          </Text>
          <RenderFiles caseFiles={costBreakdowns} onOpenFile={onOpen} />
        </Box>
      )}
      {others && others.length > 0 && (
        <Box marginBottom={5}>
          <Text variant="h4" as="h4" marginBottom={1}>
            {formatMessage(caseFiles.otherDocumentsSection)}
          </Text>
          <RenderFiles caseFiles={others} onOpenFile={onOpen} />
        </Box>
      )}
      {displayGeneratedPDFs && (
        <Box marginBottom={5}>
          <Text variant="h4" as="h4" marginBottom={1}>
            {formatMessage(strings.caseFileTitle)}
          </Text>
          {workingCase.policeCaseNumbers?.map((policeCaseNumber, index) => (
            <Box marginBottom={2} key={`${policeCaseNumber}-${index}`}>
              <PdfButton
                caseId={workingCase.id}
                connectedCaseParentId={connectedCaseParentId}
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
      )}
      {courtRecords?.length || rulings?.length ? (
        <Box marginBottom={5}>
          <Text variant="h4" as="h4" marginBottom={1}>
            {formatMessage(strings.rulingAndCourtRecordsTitle)}
          </Text>
          {courtRecords && courtRecords.length > 0 && (
            <RenderFiles caseFiles={courtRecords} onOpenFile={onOpen} />
          )}
          {(isDistrictCourtUser(user) || isCompletedCase(workingCase.state)) &&
            rulings &&
            rulings.length > 0 && (
              <RenderFiles caseFiles={rulings} onOpenFile={onOpen} />
            )}
        </Box>
      ) : null}
      {workingCase.hasCivilClaims &&
        civilClaims &&
        civilClaims.length > 0 &&
        (isDistrictCourtUser(user) ||
          isProsecutionUser(user) ||
          isDefenceUser(user)) && (
          <Box marginBottom={5}>
            <Text variant="h4" as="h4" marginBottom={1}>
              {formatMessage(strings.civilClaimsTitle)}
            </Text>
            <RenderFiles caseFiles={civilClaims} onOpenFile={onOpen} />
          </Box>
        )}
      {showSubpoenaPdf && (
        <Box marginBottom={5}>
          <Text variant="h4" as="h4" marginBottom={1}>
            {formatMessage(strings.subpoenaTitle)}
          </Text>
          {workingCase.defendants?.map((defendant) =>
            defendant.subpoenas?.map((subpoena) => (
              <Box key={`subpoena-${subpoena.id}`} marginBottom={2}>
                <PdfButton
                  caseId={workingCase.id}
                  title={formatMessage(strings.subpoenaButtonText, {
                    name: defendant.name,
                    date: formatDate(subpoena.created),
                  })}
                  pdfType="subpoena"
                  elementId={[defendant.id, subpoena.id]}
                  renderAs="row"
                />
                {!limitedAccess &&
                  isSuccessfulServiceStatus(subpoena.serviceStatus) && (
                    <PdfButton
                      caseId={workingCase.id}
                      title={formatMessage(
                        strings.serviceCertificateButtonText,
                        {
                          name: defendant.name,
                        },
                      )}
                      pdfType="serviceCertificate"
                      elementId={[defendant.id, subpoena.id]}
                      renderAs="row"
                    />
                  )}
              </Box>
            )),
          )}
        </Box>
      )}
      {uploadedCaseFiles && uploadedCaseFiles.length > 0 && (
        <Box marginBottom={5}>
          <Text variant="h4" as="h4" marginBottom={3}>
            {formatMessage(strings.uploadedCaseFiles)}
          </Text>
          <CaseFileTable caseFiles={uploadedCaseFiles} onOpenFile={onOpen} />
        </Box>
      )}
      <AnimatePresence>
        {fileNotFound && <FileNotFoundModal dismiss={dismissFileNotFound} />}
      </AnimatePresence>
    </>
  )
}

export default IndictmentCaseFilesList
