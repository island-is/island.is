import { FC, PropsWithChildren, useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'motion/react'

import {
  Accordion,
  AlertMessage,
  Box,
  Icon,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import {
  formatDate,
  normalizeAndFormatNationalId,
} from '@island.is/judicial-system/formatters'
import {
  Feature,
  hasGeneratedCourtRecordPdf,
  isCompletedCase,
  isCourtOfAppealsUser,
  isDefenceUser,
  isDistrictCourtUser,
  isPrisonAdminUser,
  isProsecutionUser,
  isPublicProsecutionOfficeUser,
  isPublicProsecutionUser,
  isSuccessfulServiceStatus,
} from '@island.is/judicial-system/types'
import {
  FeatureContext,
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
  usePoliceDigitalCaseFile,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { isNonEmptyArray } from '../../utils/arrayHelpers'
import { CaseFileTable } from '../Table'
import RulingOrderAppealFilesAccordion from './RulingOrderAppealFilesAccordion'
import RulingOrderFileRow from './RulingOrderFileRow'
import { caseFiles } from '../../routes/Prosecutor/Indictments/CaseFiles/CaseFiles.strings'
import { strings } from './IndictmentCaseFilesList.strings'
import { grid } from '../../utils/styles/recipes.css'
import * as styles from './IndictmentCaseFilesList.css'

const getDefenderVisiblePoliceCaseNumbers = (
  userNationalId: string | undefined,
  defendants: Case['defendants'] | undefined | null,
  allPoliceCaseNumbers: string[] | null | undefined,
) => {
  if (!userNationalId || !allPoliceCaseNumbers) {
    return []
  }

  const allAssigned = new Set(
    (defendants ?? []).flatMap(
      (defendant) => defendant.policeCaseNumbers ?? [],
    ),
  )

  if (allAssigned.size === 0) {
    return allPoliceCaseNumbers
  }

  const normalizedUserNationalId = normalizeAndFormatNationalId(userNationalId)
  const myDefendants = (defendants ?? []).filter(
    (defendant) =>
      defendant.isDefenderChoiceConfirmed &&
      defendant.defenderNationalId &&
      normalizedUserNationalId.includes(defendant.defenderNationalId),
  )

  const assignedToMe = new Set(
    myDefendants.flatMap((defendant) => defendant.policeCaseNumbers ?? []),
  )

  return allPoliceCaseNumbers.filter(
    (policeCaseNumber) =>
      assignedToMe.has(policeCaseNumber) || !allAssigned.has(policeCaseNumber),
  )
}

interface Props {
  workingCase: Case
  displayGeneratedPDFs?: boolean
  displayHeading?: boolean
  forceDisplayAdditionalFiles?: boolean
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

const FileSection: FC<PropsWithChildren<FileSectionProps>> = (props) => {
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

const useFilteredCaseFiles = (
  caseFiles?: CaseFile[] | null,
  splitCases?: Case[] | null,
) => {
  return useMemo(() => {
    const splitCaseFiles =
      splitCases?.flatMap((splitCase) => splitCase.caseFiles ?? []) ?? []

    const allFiles = [...(caseFiles ?? []), ...splitCaseFiles]

    const filterByCategories = (
      categories: CaseFileCategory | CaseFileCategory[],
    ) => {
      const categoryArray = Array.isArray(categories)
        ? categories
        : [categories]

      return allFiles.filter(
        (file) => file.category && categoryArray.includes(file.category),
      )
    }

    return {
      criminalRecords: filterByCategories(CaseFileCategory.CRIMINAL_RECORD),
      costBreakdowns: filterByCategories(CaseFileCategory.COST_BREAKDOWN),
      others: filterByCategories(CaseFileCategory.CASE_FILE),
      rulings: filterByCategories(CaseFileCategory.RULING),
      defendantRulings: filterByCategories(CaseFileCategory.DEFENDANT_RULING),
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
  }, [caseFiles, splitCases])
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
      canViewDefendantRulings: !isDefenceUser(user),
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
  forceDisplayAdditionalFiles = false,
  connectedCaseParentId,
}) => {
  const { formatMessage } = useIntl()
  const { user, limitedAccess } = useContext(UserContext)
  const { features } = useContext(FeatureContext)
  const showRulingOrderAppealMenu = features.includes(
    Feature.APPEAL_RULING_ORDER,
  )
  const { onOpen, fileNotFound, dismissFileNotFound } = useFileList({
    caseId: workingCase.id,
    connectedCaseParentId,
  })
  const { prefixGeneratedDocumentNameWithDocumentOrder } =
    useFiledCourtDocuments()

  const allSubpoenas = useMemo(
    () => [
      ...(workingCase.defendants?.flatMap((defendant) =>
        (defendant.subpoenas ?? []).map((subpoena) => ({
          defendant,
          subpoena,
          caseId: workingCase.id,
        })),
      ) ?? []),
      ...(workingCase.splitCases?.flatMap((splitCase) =>
        (splitCase.defendants ?? []).flatMap((defendant) =>
          (defendant.subpoenas ?? []).map((subpoena) => ({
            defendant,
            subpoena,
            caseId: workingCase.id,
          })),
        ),
      ) ?? []),
    ],
    [workingCase],
  )

  const showSubpoenaPdf = displayGeneratedPDFs && allSubpoenas.length > 0

  const filteredFiles = useFilteredCaseFiles(
    workingCase.caseFiles,
    workingCase.splitCases,
  )
  const permissions = useFilePermissions(workingCase, user)
  const showFiles =
    forceDisplayAdditionalFiles ||
    Object.values(filteredFiles).some((f) => f.length > 0)
  const hasGeneratedCourtRecord = hasGeneratedCourtRecordPdf(
    workingCase.state,
    workingCase.indictmentRulingDecision,
    workingCase.withCourtSessions,
    workingCase.courtSessions,
    user,
  )

  const sentToPrisonAdminDate = useSentToPrisonAdminDate(workingCase)
  const visiblePoliceCaseNumbers = useMemo(
    () =>
      isDefenceUser(user)
        ? getDefenderVisiblePoliceCaseNumbers(
            user?.nationalId ?? undefined,
            workingCase.defendants,
            workingCase.policeCaseNumbers,
          )
        : workingCase.policeCaseNumbers ?? [],
    [user, workingCase.defendants, workingCase.policeCaseNumbers],
  )

  const defendantsForCurrentDefender = isDefenceUser(user)
    ? workingCase.defendants?.filter(
        (d) =>
          d.defenderNationalId === user?.nationalId &&
          d.isDefenderChoiceConfirmed,
      )
    : undefined

  const hideCourtRecord =
    isDefenceUser(user) &&
    Boolean(
      defendantsForCurrentDefender?.length &&
        defendantsForCurrentDefender.every(
          (d) => d.indictmentCancelledOrDismissedState !== null,
        ),
    )

  const { pdfTitle, isCompletedWithRulingOrFine } =
    getIdAndTitleForPdfButtonForRulingSentToPrisonPdf(
      workingCase.indictmentRulingDecision,
      sentToPrisonAdminDate,
    )

  const { digitalCaseFiles, digitalCaseFilesLoading, openDigitalCaseFileUrl } =
    usePoliceDigitalCaseFile(workingCase.id, workingCase.origin)

  const showDigitalCaseFilesSection =
    (isDistrictCourtUser(user) || isCourtOfAppealsUser(user)) &&
    (digitalCaseFilesLoading || isNonEmptyArray(digitalCaseFiles))

  const hasNoFiles =
    !showFiles && !displayGeneratedPDFs && !showDigitalCaseFilesSection

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
          </>
        )}
        {displayGeneratedPDFs && (
          <Box>
            <SectionHeading
              title={formatMessage(strings.caseFileTitle)}
              marginBottom={1}
              heading="h4"
              variant="h4"
            />
            {visiblePoliceCaseNumbers.map((policeCaseNumber, index) => {
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
        )}
        {showFiles && (
          <FileSection
            title={formatMessage(caseFiles.otherDocumentsSection)}
            files={filteredFiles.others}
            onOpenFile={onOpen}
          />
        )}
        {displayGeneratedPDFs && showSubpoenaPdf && (
          <Box>
            <SectionHeading
              title={formatMessage(strings.subpoenaTitle)}
              marginBottom={1}
              heading="h4"
              variant="h4"
            />
            {allSubpoenas.map(({ defendant, subpoena, caseId }) => {
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
                    caseId={caseId}
                    title={prefixGeneratedDocumentNameWithDocumentOrder(
                      `subpoena/${defendant.id}/${subpoena.id}`,
                      subpoenaFileName,
                      caseId,
                    )}
                    pdfType="subpoena"
                    elementId={[defendant.id, subpoena.id, subpoenaFileName]}
                    renderAs="row"
                  />
                  {!limitedAccess &&
                    isSuccessfulServiceStatus(subpoena.serviceStatus) && (
                      <PdfButton
                        caseId={caseId}
                        title={prefixGeneratedDocumentNameWithDocumentOrder(
                          `subpoenaServiceCertificate/${defendant.id}/${subpoena.id}`,
                          serviceCertificateFileName,
                          caseId,
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
            })}
          </Box>
        )}
        {(showFiles ||
          hasGeneratedCourtRecord ||
          showDigitalCaseFilesSection) && (
          <>
            <FileSection
              title={formatMessage(strings.civilClaimsTitle)}
              files={filteredFiles.civilClaims}
              onOpenFile={onOpen}
              shouldRender={permissions.canViewCivilClaims}
            />
            {showDigitalCaseFilesSection && (
              <Box marginBottom={3}>
                <SectionHeading
                  title="Rafræn gögn"
                  marginBottom={1}
                  heading="h4"
                  variant="h4"
                />
                <AnimatePresence mode="wait" initial={false}>
                  {digitalCaseFilesLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Box display="flex" justifyContent="center">
                        <LoadingDots />
                      </Box>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="files"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Text marginBottom={2}>
                        Tenglarnir færa þig yfir á öruggt gagnasvæði
                        lögreglunnar. Allar heimsóknir á þann vef eru skráðar og
                        rekjanlegar.
                      </Text>
                      {digitalCaseFiles?.map((file, index) => (
                        <Box
                          key={index}
                          component="button"
                          type="button"
                          className={styles.electronicFileRow}
                          onClick={() =>
                            openDigitalCaseFileUrl(file.policeDigitalFileId)
                          }
                          cursor="pointer"
                          background="transparent"
                          width="full"
                          textAlign="left"
                        >
                          <Text
                            as="span"
                            color="blue400"
                            variant="h4"
                            className={styles.electronicFileLinkContainer}
                          >
                            {file.name}
                          </Text>
                          <Icon
                            icon="open"
                            type="outline"
                            size="small"
                            color="blue400"
                          />
                        </Box>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            )}
            {(filteredFiles.courtRecords.length > 0 ||
              hasGeneratedCourtRecord ||
              (permissions.canViewRulings &&
                filteredFiles.rulings.length > 0) ||
              (permissions.canViewDefendantRulings &&
                filteredFiles.defendantRulings.length > 0) ||
              permissions.canViewVerdictServiceCertificate ||
              filteredFiles.rulingOrders.length > 0) && (
              <div>
                <SectionHeading
                  title={formatMessage(strings.rulingAndCourtRecordsTitle)}
                  marginBottom={1}
                  heading="h4"
                  variant="h4"
                />
                {hideCourtRecord ? (
                  <AlertMessage
                    type="info"
                    message="Hægt er að nálgast þingbók og dómsúrlausn hjá héraðsdómi"
                  />
                ) : (
                  <>
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
                  </>
                )}
                {permissions.canViewRulings && (
                  <RenderFiles
                    caseFiles={filteredFiles.rulings}
                    onOpenFile={onOpen}
                  />
                )}
                {permissions.canViewDefendantRulings && (
                  <RenderFiles
                    caseFiles={filteredFiles.defendantRulings}
                    onOpenFile={onOpen}
                  />
                )}
                {showRulingOrderAppealMenu ? (
                  filteredFiles.rulingOrders.map((file) => (
                    <RulingOrderFileRow
                      key={file.id}
                      file={file}
                      onOpenFile={onOpen}
                    />
                  ))
                ) : (
                  <RenderFiles
                    caseFiles={filteredFiles.rulingOrders}
                    onOpenFile={onOpen}
                  />
                )}
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
            {showRulingOrderAppealMenu &&
              (workingCase.rulingOrderAppealCases?.length ?? 0) > 0 && (
                <Box>
                  <Accordion dividerOnBottom={false} dividerOnTop={false}>
                    {workingCase.rulingOrderAppealCases?.map((appealCase) => {
                      const rulingFile = workingCase.caseFiles?.find(
                        (f) => f.id === appealCase.rulingFileId,
                      )
                      if (!rulingFile) {
                        return null
                      }
                      return (
                        <RulingOrderAppealFilesAccordion
                          key={appealCase.id}
                          appealCase={appealCase}
                          rulingFile={rulingFile}
                          onOpenFile={onOpen}
                        />
                      )
                    })}
                  </Accordion>
                </Box>
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
