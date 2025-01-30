import { FC, useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'

import { Box, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  isCompletedCase,
  isDefenceUser,
  isDistrictCourtUser,
  isPrisonAdminUser,
  isProsecutionUser,
  isPublicProsecutor,
  isPublicProsecutorUser,
  isSuccessfulServiceStatus,
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
  User,
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

interface FileSection {
  title: string
  onOpenFile: (fileId: string) => void
  files?: CaseFile[]
  shouldRender?: boolean
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

const FileSection: FC<FileSection> = (props: FileSection) => {
  const { title, files, onOpenFile, shouldRender = true } = props

  if (!files?.length || !shouldRender) {
    return null
  }

  return (
    <Box marginBottom={5}>
      <Text variant="h4" as="h4" marginBottom={1}>
        {title}
      </Text>
      <RenderFiles caseFiles={files} onOpenFile={onOpenFile} />
    </Box>
  )
}

const useFilteredCaseFiles = (caseFiles?: CaseFile[] | null) => {
  return useMemo(() => {
    const filterByCategories = (
      categories: CaseFileCategory | CaseFileCategory[],
    ) => {
      const categoryArray = Array.isArray(categories)
        ? categories
        : [categories]

      return (
        caseFiles?.filter(
          (file) => file.category && categoryArray.includes(file.category),
        ) ?? []
      )
    }

    return {
      criminalRecords: filterByCategories(CaseFileCategory.CRIMINAL_RECORD),
      costBreakdowns: filterByCategories(CaseFileCategory.COST_BREAKDOWN),
      others: filterByCategories(CaseFileCategory.CASE_FILE),
      rulings: filterByCategories(CaseFileCategory.RULING),
      courtRecords: filterByCategories(CaseFileCategory.COURT_RECORD),
      criminalRecordUpdate: filterByCategories(
        CaseFileCategory.CRIMINAL_RECORD_UPDATE,
      ),
      uploadedCaseFiles: filterByCategories([
        CaseFileCategory.PROSECUTOR_CASE_FILE,
        CaseFileCategory.DEFENDANT_CASE_FILE,
      ]),
      civilClaims: filterByCategories(CaseFileCategory.CIVIL_CLAIM),
      sentToPrisonAdminFiles: filterByCategories(
        CaseFileCategory.SENT_TO_PRISON_ADMIN_FILE,
      ),
    }
  }, [caseFiles])
}

const useFilePermissions = (workingCase: Case, user?: User) => {
  return useMemo(
    () => ({
      canViewCriminalRecordUpdate:
        isDistrictCourtUser(user) ||
        isPublicProsecutor(user) ||
        isPublicProsecutorUser(user),
      canViewCivilClaims:
        Boolean(workingCase.hasCivilClaims) &&
        (isDistrictCourtUser(user) ||
          isProsecutionUser(user) ||
          isDefenceUser(user)),
      canViewSentToPrisonAdminFiles:
        isPrisonAdminUser(user) || isPublicProsecutorUser(user),
      canViewRulings:
        isDistrictCourtUser(user) || isCompletedCase(workingCase.state),
    }),
    [user, workingCase.hasCivilClaims, workingCase.state],
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

  const showSubpoenaPdf =
    displayGeneratedPDFs &&
    workingCase.defendants?.some(
      (defendant) => defendant.subpoenas && defendant.subpoenas.length > 0,
    )

  const filteredFiles = useFilteredCaseFiles(workingCase.caseFiles)
  const permissions = useFilePermissions(workingCase, user)

  return (
    <>
      {displayHeading && (
        <SectionHeading title={formatMessage(strings.title)} />
      )}
      {displayGeneratedPDFs && (
        <Box marginBottom={5}>
          <Text variant="h4" as="h4" marginBottom={1}>
            {formatMessage(caseFiles.indictmentSection)}
          </Text>
          <Box marginBottom={2} key={`indictment-${workingCase.id}`}>
            <PdfButton
              caseId={workingCase.id}
              connectedCaseParentId={connectedCaseParentId}
              title={formatMessage(caseFiles.indictmentTitle)}
              pdfType="indictment"
              renderAs="row"
            />
          </Box>
        </Box>
      )}
      <FileSection
        title={formatMessage(caseFiles.criminalRecordSection)}
        files={filteredFiles.criminalRecords}
        onOpenFile={onOpen}
      />
      <FileSection
        title={formatMessage(caseFiles.criminalRecordUpdateSection)}
        files={filteredFiles.criminalRecordUpdate}
        onOpenFile={onOpen}
        shouldRender={permissions.canViewCriminalRecordUpdate}
      />
      <FileSection
        title={formatMessage(caseFiles.costBreakdownSection)}
        files={filteredFiles.costBreakdowns}
        onOpenFile={onOpen}
      />
      <FileSection
        title={formatMessage(caseFiles.otherDocumentsSection)}
        files={filteredFiles.others}
        onOpenFile={onOpen}
      />
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
      {filteredFiles.courtRecords?.length || filteredFiles.rulings?.length ? (
        <Box marginBottom={5}>
          <Text variant="h4" as="h4" marginBottom={1}>
            {formatMessage(strings.rulingAndCourtRecordsTitle)}
          </Text>
          {filteredFiles.courtRecords &&
            filteredFiles.courtRecords.length > 0 && (
              <RenderFiles
                caseFiles={filteredFiles.courtRecords}
                onOpenFile={onOpen}
              />
            )}
          {permissions.canViewRulings &&
            filteredFiles.rulings &&
            filteredFiles.rulings.length > 0 && (
              <RenderFiles
                caseFiles={filteredFiles.rulings}
                onOpenFile={onOpen}
              />
            )}
        </Box>
      ) : null}
      <FileSection
        title={formatMessage(strings.civilClaimsTitle)}
        files={filteredFiles.civilClaims}
        onOpenFile={onOpen}
        shouldRender={permissions.canViewCivilClaims}
      />
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
      {filteredFiles.uploadedCaseFiles &&
        filteredFiles.uploadedCaseFiles.length > 0 && (
          <Box marginBottom={5}>
            <Text variant="h4" as="h4" marginBottom={3}>
              {formatMessage(strings.uploadedCaseFiles)}
            </Text>
            <CaseFileTable
              caseFiles={filteredFiles.uploadedCaseFiles}
              onOpenFile={onOpen}
            />
          </Box>
        )}
      <FileSection
        title={formatMessage(strings.sentToPrisonAdmin)}
        files={filteredFiles.sentToPrisonAdminFiles}
        onOpenFile={onOpen}
        shouldRender={permissions.canViewSentToPrisonAdminFiles}
      />
      <AnimatePresence>
        {fileNotFound && <FileNotFoundModal dismiss={dismissFileNotFound} />}
      </AnimatePresence>
    </>
  )
}

export default IndictmentCaseFilesList
