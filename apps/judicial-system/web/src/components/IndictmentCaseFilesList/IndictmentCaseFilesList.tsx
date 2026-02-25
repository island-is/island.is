import { FC, useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'

import { AlertMessage, Box, Button, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  hasGeneratedCourtRecordPdf,
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
  CaseState,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useFiledCourtDocuments,
  useFileList,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { CaseFileTable } from '../Table'
import { caseFiles } from '../../routes/Prosecutor/Indictments/CaseFiles/CaseFiles.strings'
import { strings } from './IndictmentCaseFilesList.strings'
import { grid } from '../../utils/styles/recipes.css'

/** Temporary until we know the url to open as well as get the access token */
type WorkingCaseWithIdesUrl = Case & {
  idesUrl?: string | null
}

interface Props {
  workingCase: WorkingCaseWithIdesUrl
  displayGeneratedPDFs?: boolean
  displayHeading?: boolean
  connectedCaseParentId?: string
}

interface RenderFilesProps {
  caseFiles: CaseFile[]
  onOpenFile: (fileId: string) => void
  showFiledDocumentNumber?: boolean
}

interface FileSectionProps {
  title: string
  onOpenFile: (fileId: string) => void
  files: CaseFile[]
  shouldRender?: boolean
}

export const RenderFiles: FC<RenderFilesProps> = ({
  caseFiles,
  onOpenFile,
  showFiledDocumentNumber = false,
}) => {
  const { prefixUploadedDocumentNameWithDocumentOrder } =
    useFiledCourtDocuments()

  const getFileName = (file: CaseFile) => {
    const fileName = file.userGeneratedFilename ?? file.name
    if (!showFiledDocumentNumber) {
      return fileName
    }

    return prefixUploadedDocumentNameWithDocumentOrder(file.id, fileName ?? '')
  }

  return (
    <>
      {caseFiles.map((file) => (
        <Box key={file.id}>
          <PdfButton
            title={getFileName(file)}
            renderAs="row"
            disabled={!file.isKeyAccessible}
            handleClick={() => onOpenFile(file.id)}
          />
        </Box>
      ))}
    </>
  )
}

const FileSection: FC<React.PropsWithChildren<FileSectionProps>> = (props) => {
  const { title, files, onOpenFile, shouldRender = true, children } = props

  if ((files.length === 0 && !children) || !shouldRender) {
    return null
  }

  return (
    <Box>
      <SectionHeading
        title={title}
        marginBottom={1}
        heading="h4"
        variant="h4"
      />
      <RenderFiles
        caseFiles={files}
        onOpenFile={onOpenFile}
        showFiledDocumentNumber
      />
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
      rulingOrders: filterByCategories(
        CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
      ),
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
      canViewVerdictServiceCertificate:
        isPublicProsecutionOfficeUser(user) || isPrisonAdminUser(user),
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

export const getIdAndTitleForPdfButtonForRulingSentToPrisonPdf = (
  indictmentRulingDecision?: CaseIndictmentRulingDecision | null,
  sentToPrisonAdminDate?: Date,
) => {
  const baseTitle =
    indictmentRulingDecision === CaseIndictmentRulingDecision.FINE
      ? 'Viðurlagaákvörðun til fullnustu'
      : 'Dómur til fullnustu'

  return {
    pdfTitle: `${baseTitle} ${formatDate(sentToPrisonAdminDate)}.pdf`,
    isCompletedWithRulingOrFine:
      indictmentRulingDecision === CaseIndictmentRulingDecision.RULING ||
      indictmentRulingDecision === CaseIndictmentRulingDecision.FINE,
  }
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
  const { prefixGeneratedDocumentNameWithDocumentOrder } =
    useFiledCourtDocuments()

  const showSubpoenaPdf =
    displayGeneratedPDFs &&
    workingCase.defendants?.some(
      (defendant) => defendant.subpoenas && defendant.subpoenas.length > 0,
    )

  const filteredFiles = useFilteredCaseFiles(workingCase.caseFiles)
  const permissions = useFilePermissions(workingCase, user)
  const showFiles = Object.values(filteredFiles).some((f) => f.length > 0)
  const hasGeneratedCourtRecord = hasGeneratedCourtRecordPdf(
    workingCase.state,
    workingCase.indictmentRulingDecision,
    workingCase.withCourtSessions,
    workingCase.courtSessions,
    user,
  )

  const sentToPrisonAdminDate = useSentToPrisonAdminDate(workingCase)

  const { pdfTitle, isCompletedWithRulingOrFine } =
    getIdAndTitleForPdfButtonForRulingSentToPrisonPdf(
      workingCase.indictmentRulingDecision,
      sentToPrisonAdminDate,
    )

  const hasNoFiles = !showFiles && !displayGeneratedPDFs

  return (
    <>
      {displayHeading && (
        <SectionHeading title={formatMessage(strings.title)} />
      )}
      <div className={grid({ gap: 5 })}>
        {displayGeneratedPDFs && (
          <Box>
            <SectionHeading
              title={formatMessage(caseFiles.indictmentSection)}
              marginBottom={1}
              heading="h4"
              variant="h4"
            />
            <Box key={`indictment-${workingCase.id}`}>
              <PdfButton
                caseId={workingCase.id}
                connectedCaseParentId={connectedCaseParentId}
                title={prefixGeneratedDocumentNameWithDocumentOrder(
                  'indictment',
                  `Ákæra${
                    workingCase.caseSentToCourtDate
                      ? ` ${formatDate(workingCase.caseSentToCourtDate)}`
                      : ''
                  }.pdf`,
                  workingCase.id,
                )}
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
            <Box>
              <SectionHeading
                title={formatMessage(strings.caseFileTitle)}
                marginBottom={1}
                heading="h4"
                variant="h4"
              />
              {workingCase.policeCaseNumbers?.map((policeCaseNumber, index) => {
                const caseFilesRecordFileName = formatMessage(
                  strings.caseFileButtonText,
                  {
                    policeCaseNumber,
                  },
                )
                return (
                  <Box key={`${policeCaseNumber}-${index}`}>
                    <PdfButton
                      caseId={workingCase.id}
                      connectedCaseParentId={connectedCaseParentId}
                      title={prefixGeneratedDocumentNameWithDocumentOrder(
                        `caseFilesRecord/${policeCaseNumber}`,
                        caseFilesRecordFileName,
                        workingCase.id,
                      )}
                      pdfType="caseFilesRecord"
                      elementId={[policeCaseNumber, caseFilesRecordFileName]}
                      renderAs="row"
                    />
                  </Box>
                )
              })}
            </Box>
            {showSubpoenaPdf && (
              <Box>
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
                    const serviceCertificateFileName = formatMessage(
                      strings.serviceCertificateButtonText,
                      { name: defendant.name },
                    )

                    return (
                      <Box key={`subpoena-${subpoena.id}`}>
                        <PdfButton
                          caseId={workingCase.id}
                          title={prefixGeneratedDocumentNameWithDocumentOrder(
                            `subpoena/${defendant.id}/${subpoena.id}`,
                            subpoenaFileName,
                            workingCase.id,
                          )}
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
                              title={prefixGeneratedDocumentNameWithDocumentOrder(
                                `subpoenaServiceCertificate/${defendant.id}/${subpoena.id}`,
                                serviceCertificateFileName,
                                workingCase.id,
                              )}
                              pdfType="subpoenaServiceCertificate"
                              elementId={[
                                defendant.id,
                                subpoena.id,
                                serviceCertificateFileName,
                              ]}
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
        {(showFiles || hasGeneratedCourtRecord) && (
          <>
            <FileSection
              title={formatMessage(strings.civilClaimsTitle)}
              files={filteredFiles.civilClaims}
              onOpenFile={onOpen}
              shouldRender={permissions.canViewCivilClaims}
            />
            {isDistrictCourtUser(user) && (
              <Box marginBottom={3}>
                <SectionHeading
                  title="Rafræn gögn"
                  marginBottom={1}
                  heading="h4"
                  variant="h4"
                />
                <Text marginBottom={2}>
                  Hnappurinn færir þig yfir á öruggt gagnasvæði lögreglunnar.
                  Allar heimsóknir á þann vef eru skráðar og rekjanlegar.
                </Text>
                <Button
                  variant="primary"
                  size="small"
                  icon="open"
                  iconType="outline"
                  disabled={!workingCase.idesUrl}
                  onClick={() => {
                    if (workingCase.idesUrl) {
                      window.open(workingCase.idesUrl, '_blank')
                    }
                  }}
                >
                  Hljóð og myndupptökur
                </Button>
              </Box>
            )}
            {(filteredFiles.courtRecords.length > 0 ||
              hasGeneratedCourtRecord ||
              (permissions.canViewRulings &&
                filteredFiles.rulings.length > 0) ||
              permissions.canViewVerdictServiceCertificate ||
              filteredFiles.rulingOrders.length > 0) && (
              <div>
                <SectionHeading
                  title={formatMessage(strings.rulingAndCourtRecordsTitle)}
                  marginBottom={1}
                  heading="h4"
                  variant="h4"
                />
                {hasGeneratedCourtRecord && (
                  <PdfButton
                    caseId={workingCase.id}
                    connectedCaseParentId={connectedCaseParentId}
                    title={`Þingbók ${workingCase.courtCaseNumber}.pdf`}
                    pdfType="courtRecord"
                    renderAs="row"
                    elementId="Þingbók"
                  />
                )}
                <RenderFiles
                  caseFiles={filteredFiles.courtRecords}
                  onOpenFile={onOpen}
                />
                {permissions.canViewRulings && (
                  <RenderFiles
                    caseFiles={filteredFiles.rulings}
                    onOpenFile={onOpen}
                  />
                )}
                <RenderFiles
                  caseFiles={filteredFiles.rulingOrders}
                  onOpenFile={onOpen}
                />
                {permissions.canViewVerdictServiceCertificate &&
                  workingCase.defendants?.map((defendant) => {
                    if (
                      !defendant.verdict?.serviceDate ||
                      !defendant.verdict?.externalPoliceDocumentId
                    ) {
                      return null
                    }

                    const serviceCertificateFileName = formatMessage(
                      strings.serviceCertificateButtonText,
                      {
                        name: defendant.name,
                      },
                    )

                    return (
                      <PdfButton
                        key={defendant.id}
                        caseId={workingCase.id}
                        title={serviceCertificateFileName}
                        pdfType="verdictServiceCertificate"
                        elementId={[defendant.id, serviceCertificateFileName]}
                        renderAs="row"
                      />
                    )
                  })}
              </div>
            )}
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
              {isCompletedWithRulingOrFine && sentToPrisonAdminDate && (
                <PdfButton
                  caseId={workingCase.id}
                  title={pdfTitle}
                  pdfType="rulingSentToPrisonAdmin"
                  elementId={[pdfTitle]}
                  renderAs="row"
                />
              )}
            </FileSection>
            {filteredFiles.uploadedCaseFiles.length > 0 && (
              <Box>
                <SectionHeading
                  title={formatMessage(strings.uploadedCaseFiles)}
                  marginBottom={3}
                  heading="h4"
                  variant="h4"
                />
                <CaseFileTable
                  caseFiles={filteredFiles.uploadedCaseFiles}
                  onOpenFile={onOpen}
                  canRejectFiles={
                    isDistrictCourtUser(user) &&
                    !connectedCaseParentId &&
                    workingCase.state !== CaseState.CORRECTING
                  }
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
      </div>
    </>
  )
}

export default IndictmentCaseFilesList
