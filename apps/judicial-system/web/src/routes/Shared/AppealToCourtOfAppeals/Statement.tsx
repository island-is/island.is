import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Box,
  FileUploadStatus,
  InputFileUpload,
  Text,
} from '@island.is/island-ui/core'
import {
  DEFENDER_INDICTMENT_CASE_ROUTE,
  DEFENDER_REQUEST_CASE_ROUTE,
  PROSECUTION_INDICTMENT_CASE_CONFIRMING_ROUTE,
  PROSECUTION_INDICTMENT_CASE_OVERVIEW_ROUTE,
  SIGNED_VERDICT_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  isAppealFileDeletionLocked,
  isCompletedCase,
  isDefenceUser,
  isIndictmentCase,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  RequestAppealRulingNotToBePublishedCheckbox,
  RulingDateLabel,
  RulingFileLabel,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import DateLabel from '@island.is/judicial-system-web/src/components/DateLabel/DateLabel'
import {
  AppealEventType,
  CaseFileCategory,
} from '@island.is/judicial-system-web/src/graphql/schema'
import type { TUploadFile } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  useAppealCase,
  useFileList,
  useS3Upload,
  useTargetAppealCaseByRulingFileId,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'
import {
  type DefenceUserPartyIds,
  getAppealActorText,
  getDefenceUserAppealConfirmedPartyIds,
  getDefenceUserPartyIds,
  getVerdictAppealStatementParty,
  isMatchingAppealCaseFile,
} from '@island.is/judicial-system-web/src/utils/utils'

interface Props {
  /**
   * When true, target the case's verdictAppealCase and use verdict-appeal
   * statement categories instead of the kæra appeal-case row.
   */
  isVerdictAppeal?: boolean
}

const resolveVerdictAppealParty = (
  workingCase: Parameters<typeof getVerdictAppealStatementParty>[0],
  user: Parameters<typeof getVerdictAppealStatementParty>[1],
  query: { defendantId?: string | string[]; civilClaimantId?: string | string[] },
): DefenceUserPartyIds => {
  const queryDefendantId = Array.isArray(query.defendantId)
    ? query.defendantId[0]
    : query.defendantId
  const queryCivilClaimantId = Array.isArray(query.civilClaimantId)
    ? query.civilClaimantId[0]
    : query.civilClaimantId

  const appealParties = getDefenceUserAppealConfirmedPartyIds(workingCase, user)

  if (queryDefendantId) {
    const match = appealParties.find(
      (party) => party.defendantId === queryDefendantId,
    )

    if (match) {
      return match
    }
  }

  if (queryCivilClaimantId) {
    const match = appealParties.find(
      (party) => party.civilClaimantId === queryCivilClaimantId,
    )

    if (match) {
      return match
    }
  }

  // Stay on appeal-confirmed parties only. Do not fall back to
  // getDefenceUserPartyIds (district-or-appeal, first match) — that can
  // pick the wrong client when the route is opened without query params.
  return getVerdictAppealStatementParty(workingCase, user) ?? {}
}

const Statement = ({ isVerdictAppeal = false }: Props) => {
  const { workingCase, refreshCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { createAppealEventLog, isCreatingAppealEventLog } = useAppealCase()
  const { formatMessage } = useIntl()
  const router = useRouter()
  const [visibleModal, setVisibleModal] = useState<'STATEMENT_SENT'>()
  const { defendantId, civilClaimantId } = isVerdictAppeal
    ? resolveVerdictAppealParty(workingCase, user, router.query)
    : getDefenceUserPartyIds(workingCase, user)
  const {
    uploadFiles,
    allFilesDoneOrError,
    someFilesError,
    addUploadFiles,
    updateUploadFile,
    removeUploadFile,
  } = useUploadFiles(workingCase.caseFiles)

  const { onOpenFile } = useFileList({
    caseId: workingCase.id,
  })

  // Statement events target the specific appeal-case row. Verdict appeals
  // have no rulingFileId — use the case-level verdictAppealCase instead.
  const rulingFileAppealCase = useTargetAppealCaseByRulingFileId()
  const targetAppealCase = isVerdictAppeal
    ? workingCase.verdictAppealCase
    : rulingFileAppealCase
  const targetAppealCaseId = targetAppealCase?.id

  const { handleUpload, handleRemove } = useS3Upload(
    workingCase.id,
    defendantId,
    civilClaimantId,
    targetAppealCase?.rulingFileId,
  )

  const appealStatementType = isVerdictAppeal
    ? isDefenceUser(user)
      ? CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT
      : CaseFileCategory.PROSECUTOR_VERDICT_APPEAL_STATEMENT
    : isDefenceUser(user)
    ? CaseFileCategory.DEFENDANT_APPEAL_STATEMENT
    : CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT

  const appealCaseFilesType = isVerdictAppeal
    ? isDefenceUser(user)
      ? CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT_CASE_FILE
      : CaseFileCategory.PROSECUTOR_VERDICT_APPEAL_STATEMENT_CASE_FILE
    : isDefenceUser(user)
    ? CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE
    : CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE

  const previousUrl = `${
    isDefenceUser(user)
      ? isIndictmentCase(workingCase.type)
        ? DEFENDER_INDICTMENT_CASE_ROUTE
        : DEFENDER_REQUEST_CASE_ROUTE
      : isIndictmentCase(workingCase.type)
      ? isCompletedCase(workingCase.state)
        ? PROSECUTION_INDICTMENT_CASE_OVERVIEW_ROUTE
        : PROSECUTION_INDICTMENT_CASE_CONFIRMING_ROUTE
      : SIGNED_VERDICT_OVERVIEW_ROUTE
  }/${workingCase.id}`

  const handleNextButtonClick = useCallback(async () => {
    const uploadResult = await handleUpload(
      uploadFiles.filter((file) => file.percent === 0),
      updateUploadFile,
    )

    if (uploadResult !== 'ALL_SUCCEEDED') {
      return
    }

    if (!targetAppealCaseId) {
      return
    }

    if (isVerdictAppeal && !defendantId && !civilClaimantId) {
      return
    }

    const sent = await createAppealEventLog(
      workingCase.id,
      targetAppealCaseId,
      AppealEventType.APPEAL_STATEMENT_SENT,
      isVerdictAppeal
        ? { defendantId, civilClaimantId }
        : undefined,
    )

    if (sent) {
      setVisibleModal('STATEMENT_SENT')
    }
  }, [
    handleUpload,
    uploadFiles,
    updateUploadFile,
    targetAppealCaseId,
    createAppealEventLog,
    workingCase.id,
    isVerdictAppeal,
    defendantId,
    civilClaimantId,
  ])

  const handleRemoveFile = (file: TUploadFile) => {
    if (file.key) {
      // Files that have been sent to the court of appeals can no longer be
      // deleted once it has registered its case number
      if (isAppealFileDeletionLocked(file.category, targetAppealCase)) {
        toast.error(
          'Ekki er hægt að eyða gögnum eftir að Landsréttur hefur skráð málsnúmer',
        )

        return
      }

      handleRemove(file, removeUploadFile)
    } else {
      removeUploadFile(file)
    }
  }

  const handleChange = (files: File[], category: CaseFileCategory) => {
    addUploadFiles(files, {
      category,
      status: FileUploadStatus.done,
      defendantId,
      civilClaimantId,
      rulingFileId: targetAppealCase?.rulingFileId,
    })
  }

  const filter = (file: TUploadFile, category: CaseFileCategory): boolean => {
    return isMatchingAppealCaseFile(
      workingCase,
      [category],
      file,
      user,
      targetAppealCase?.rulingFileId,
    )
  }
  const appealStatementFiles = uploadFiles.filter((file) =>
    filter(file, appealStatementType),
  )

  return (
    <PageLayout workingCase={workingCase} isLoading={false} notFound={false}>
      <PageHeader
        title={
          isVerdictAppeal
            ? 'Greinargerð - Réttarvörslugátt'
            : titles.shared.appealToCourtOfAppeals
        }
      />
      <FormContentContainer>
        <PageTitle>Greinargerð</PageTitle>
        <Box marginBottom={7}>
          {workingCase.courtCaseNumber && (
            <Text as="h2" variant="h2" fontWeight="semiBold" marginBottom={1}>
              Mál nr. {workingCase.courtCaseNumber}
            </Text>
          )}
          {isVerdictAppeal ? (
            workingCase.rulingDate && (
              <DateLabel
                text="Máli lokið"
                date={workingCase.rulingDate}
                hideTime
                as="h3"
              />
            )
          ) : (
            <>
              {workingCase.rulingDate && (
                <RulingDateLabel rulingDate={workingCase.rulingDate} />
              )}
              <RulingFileLabel
                caseFiles={workingCase.caseFiles}
                rulingFileId={targetAppealCase?.rulingFileId}
              />
              <Text variant="h5" as="h5">
                {getAppealActorText(workingCase, targetAppealCase)}
              </Text>
            </>
          )}
        </Box>
        {user && (
          <>
            <Box component="section" marginBottom={5}>
              <SectionHeading title="Greinargerð" required />

              <InputFileUpload
                name="appealStatement"
                files={appealStatementFiles}
                accept={'application/pdf'}
                title={core.uploadBoxTitle}
                description={formatMessage(
                  {
                    id: core.uploadBoxDescription,
                    defaultMessage: core.uploadBoxDescription,
                  },
                  {
                    fileEndings: '.pdf',
                  },
                )}
                buttonLabel={core.uploadBoxButtonLabel}
                onChange={(files) => handleChange(files, appealStatementType)}
                onRemove={(file) => handleRemoveFile(file)}
                onOpenFile={(file) => onOpenFile(file)}
                hideIcons={!allFilesDoneOrError}
                disabled={!allFilesDoneOrError}
              />
            </Box>
            <Box
              component="section"
              marginBottom={isProsecutionUser(user) ? 5 : 10}
            >
              <SectionHeading title="Gögn" marginBottom={1} />
              <Text marginBottom={3} whiteSpace="preWrap">
                Ef ný gögn eiga að fylgja greinargerðinni er hægt að hlaða þeim
                upp hér að neðan.
                {'\n'}
                {!isIndictmentCase(workingCase.type) &&
                  !isDefenceUser(user) &&
                  'Athugið að gögn sem hér er hlaðið upp verða einungis sýnileg Landsrétti.'}
              </Text>
              <InputFileUpload
                name="appealCaseFiles"
                files={uploadFiles.filter((file) =>
                  filter(file, appealCaseFilesType),
                )}
                accept={'application/pdf'}
                title={core.uploadBoxTitle}
                description={formatMessage(
                  {
                    id: core.uploadBoxDescription,
                    defaultMessage: core.uploadBoxDescription,
                  },
                  {
                    fileEndings: '.pdf',
                  },
                )}
                buttonLabel={core.uploadBoxButtonLabel}
                onChange={(files) => handleChange(files, appealCaseFilesType)}
                onRemove={(file) => handleRemoveFile(file)}
                onOpenFile={(file) => onOpenFile(file)}
                hideIcons={!allFilesDoneOrError}
                disabled={!allFilesDoneOrError}
              />
            </Box>
            {!isIndictmentCase(workingCase.type) && isProsecutionUser(user) && (
              <Box component="section">
                <RequestAppealRulingNotToBePublishedCheckbox />
              </Box>
            )}
          </>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={previousUrl}
          actions={[
            {
              text: someFilesError ? 'Reyna aftur' : 'Senda greinargerð',
              colorScheme: someFilesError ? 'destructive' : 'default',
              onClick: handleNextButtonClick,
              disabled:
                !targetAppealCaseId ||
                appealStatementFiles.length === 0 ||
                isCreatingAppealEventLog ||
                (isVerdictAppeal && !defendantId && !civilClaimantId),
              loading: !allFilesDoneOrError || isCreatingAppealEventLog,
              testId: 'continueButton',
            },
          ]}
        />
      </FormContentContainer>
      {visibleModal === 'STATEMENT_SENT' && (
        <Modal
          title="Greinargerð hefur verið send Landsrétti"
          text="Tilkynning um greinargerð hefur verið send Landsrétti og aðilum máls."
          buttons={[
            {
              text: core.closeModal,
              onClick: () => {
                refreshCase()
                router.push(previousUrl)
              },
              variant: 'ghost',
            },
          ]}
        />
      )}
    </PageLayout>
  )
}

export default Statement
