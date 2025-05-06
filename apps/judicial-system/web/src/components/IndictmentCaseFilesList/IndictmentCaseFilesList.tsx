import { FC, useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'

import { AlertMessage, Box } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  isCompletedCase,
  isDefenceUser,
  isDistrictCourtUser,
  isPrisonAdminUser,
  isProsecutionUser,
  isPublicProsecutionOfficeUser,
  isPublicProsecutionUser,
  isSuccessfulServiceStatus,
} from '@island.is/judicial-system/types'
import {
  FileNotFoundModal,
  PdfButton,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseFile,
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
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

interface FileSectionProps {
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

const FileSection: FC<React.PropsWithChildren<FileSectionProps>> = (props) => {
  const { title, files, onOpenFile, shouldRender = true, children } = props

  if ((!files?.length && !children) || !shouldRender) {
    return null
  }

  return (
    <Box marginBottom={5}>
      <SectionHeading
        title={title}
        marginBottom={1}
        heading="h4"
        variant="h4"
      />
      {files && <RenderFiles caseFiles={files} onOpenFile={onOpenFile} />}
      {children}
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
        CaseFileCategory.PROSECUTOR_CASE_FILE, // sækjandi
        CaseFileCategory.DEFENDANT_CASE_FILE, // verjandi
        CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE, // ákærði
        CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE, //réttargæslumaður
        CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE, // lögmaður
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
        isPublicProsecutionUser(user) ||
        isPublicProsecutionOfficeUser(user),
      canViewCivilClaims:
        Boolean(workingCase.hasCivilClaims) &&
        (isDistrictCourtUser(user) ||
          isProsecutionUser(user) ||
          isDefenceUser(user)),
      canViewSentToPrisonAdminFiles:
        isPrisonAdminUser(user) || isPublicProsecutionOfficeUser(user),
      canViewRulings:
        isDistrictCourtUser(user) || isCompletedCase(workingCase.state),
    }),
    [user, workingCase.hasCivilClaims, workingCase.state],
  )
}

export const useSentToPrisonAdminDate = (workingCase: Case) => {
  return useMemo(() => {
    // For now we return the newest date on any defendant that has been sent to prison admin
    // but we may need to change this in the future depending on how we want to handle
    // multiple defendants.
    const sentToPrisonAdminDate = workingCase.defendants
      ?.filter((defendant) => defendant.isSentToPrisonAdmin)
      .map((defendant) => defendant.sentToPrisonAdminDate)
      .filter((date): date is string => Boolean(date))
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]

    return sentToPrisonAdminDate ? new Date(sentToPrisonAdminDate) : undefined
  }, [workingCase.defendants])
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
  const showFiles = Object.values(filteredFiles).some((f) => f.length > 0)

  const sentToPrisonAdminDate = useSentToPrisonAdminDate(workingCase)
  const isCompletedWithRuling =
    workingCase.indictmentRulingDecision === CaseIndictmentRulingDecision.RULING
  const hasNoFiles = !showFiles && !displayGeneratedPDFs

  return (
    <>
      {displayHeading && (
        <SectionHeading title={formatMessage(strings.title)} />
      )}
      {displayGeneratedPDFs && (
        <Box marginBottom={5}>
          <SectionHeading
            title={formatMessage(caseFiles.indictmentSection)}
            marginBottom={1}
            heading="h4"
            variant="h4"
          />
          <Box marginBottom={2} key={`indictment-${workingCase.id}`}>
            <PdfButton
              caseId={workingCase.id}
              connectedCaseParentId={connectedCaseParentId}
              title={formatMessage(caseFiles.indictmentTitle)}
              pdfType="indictment"
              renderAs="row"
              elementId="Ákæra"
            />
          </Box>
        </Box>
      )}
      {showFiles && (
        <>
          <FileSection
            title={formatMessage(caseFiles.criminalRecordSection)}
            files={filteredFiles.criminalRecords}
            onOpenFile={onOpen}
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
        </>
      )}
      {displayGeneratedPDFs && (
        <>
          <Box marginBottom={5}>
            <SectionHeading
              title={formatMessage(strings.caseFileTitle)}
              marginBottom={1}
              heading="h4"
              variant="h4"
            />
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
          {showSubpoenaPdf && (
            <Box marginBottom={5}>
              <SectionHeading
                title={formatMessage(strings.subpoenaTitle)}
                marginBottom={1}
                heading="h4"
                variant="h4"
              />
              {workingCase.defendants?.map((defendant) =>
                defendant.subpoenas?.map((subpoena) => {
                  const subpoenaFileName = formatMessage(
                    strings.subpoenaButtonText,
                    {
                      name: defendant.name,
                      date: formatDate(subpoena.created),
                    },
                  )

                  return (
                    <Box key={`subpoena-${subpoena.id}`} marginBottom={2}>
                      <PdfButton
                        caseId={workingCase.id}
                        title={subpoenaFileName}
                        pdfType="subpoena"
                        elementId={[
                          defendant.id,
                          subpoena.id,
                          subpoenaFileName,
                        ]}
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
                  )
                }),
              )}
            </Box>
          )}
        </>
      )}
      {showFiles && (
        <>
          <FileSection
            title={formatMessage(strings.civilClaimsTitle)}
            files={filteredFiles.civilClaims}
            onOpenFile={onOpen}
            shouldRender={permissions.canViewCivilClaims}
          />
          {filteredFiles.courtRecords?.length ||
          filteredFiles.rulings?.length ? (
            <Box marginBottom={5}>
              <SectionHeading
                title={formatMessage(strings.rulingAndCourtRecordsTitle)}
                marginBottom={1}
                heading="h4"
                variant="h4"
              />
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
            title={formatMessage(caseFiles.criminalRecordUpdateSection)}
            files={filteredFiles.criminalRecordUpdate}
            onOpenFile={onOpen}
            shouldRender={permissions.canViewCriminalRecordUpdate}
          />
          <FileSection
            title={formatMessage(strings.sentToPrisonAdmin)}
            files={filteredFiles.sentToPrisonAdminFiles}
            onOpenFile={onOpen}
            shouldRender={permissions.canViewSentToPrisonAdminFiles}
          >
            {isCompletedWithRuling && sentToPrisonAdminDate && (
              <PdfButton
                caseId={workingCase.id}
                title={`Dómur til fullnustu ${formatDate(
                  sentToPrisonAdminDate,
                )}.pdf`}
                pdfType="rulingSentToPrisonAdmin"
                elementId="Dómur til fullnustu"
                renderAs="row"
              />
            )}
          </FileSection>
          {filteredFiles.uploadedCaseFiles &&
            filteredFiles.uploadedCaseFiles.length > 0 && (
              <Box marginBottom={5}>
                <SectionHeading
                  title={formatMessage(strings.uploadedCaseFiles)}
                  marginBottom={3}
                  heading="h4"
                  variant="h4"
                />
                <CaseFileTable
                  caseFiles={filteredFiles.uploadedCaseFiles}
                  onOpenFile={onOpen}
                />
              </Box>
            )}
          <AnimatePresence>
            {fileNotFound && (
              <FileNotFoundModal dismiss={dismissFileNotFound} />
            )}
          </AnimatePresence>
        </>
      )}
      {hasNoFiles && (
        <Box marginTop={3}>
          <AlertMessage type="info" message="Engin skjöl til að sýna" />
        </Box>
      )}
    </>
  )
}

export default IndictmentCaseFilesList
