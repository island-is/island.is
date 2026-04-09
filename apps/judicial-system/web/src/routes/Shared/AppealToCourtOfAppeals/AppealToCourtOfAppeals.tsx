import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Box,
  FileUploadStatus,
  InputFileUpload,
  Text,
  UploadFile,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
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
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseFileCategory,
  CaseTransition,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useFileList,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { getDefenceUserPartyIds } from '@island.is/judicial-system-web/src/utils/utils'

const AppealToCourtOfAppeals = () => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { id } = router.query
  const [visibleModal, setVisibleModal] = useState<'APPEAL_SENT'>()
  const { defendantId, civilClaimantId } = getDefenceUserPartyIds(
    user,
    workingCase,
  )
  const {
    uploadFiles,
    allFilesDoneOrError,
    someFilesError,
    addUploadFiles,
    removeUploadFile,
    updateUploadFile,
  } = useUploadFiles(workingCase.caseFiles)
  const { handleUpload, handleRemove } = useS3Upload(
    workingCase.id,
    defendantId,
    civilClaimantId,
  )
  const { onOpenFile } = useFileList({
    caseId: workingCase.id,
  })
  const { transitionCase, isTransitioningCase } = useCase()

  const appealBriefType = !isDefenceUser(user)
    ? CaseFileCategory.PROSECUTOR_APPEAL_BRIEF
    : CaseFileCategory.DEFENDANT_APPEAL_BRIEF
  const appealCaseFilesType = !isDefenceUser(user)
    ? CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE
    : CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE
  const previousUrl = `${
    isDefenceUser(user)
      ? isIndictmentCase(workingCase.type)
        ? constants.DEFENDER_INDICTMENT_ROUTE
        : constants.DEFENDER_ROUTE
      : isIndictmentCase(workingCase.type)
      ? constants.CLOSED_INDICTMENT_OVERVIEW_ROUTE
      : constants.SIGNED_VERDICT_OVERVIEW_ROUTE
  }/${id}`

  const handleNextButtonClick = useCallback(async () => {
    const uploadResult = await handleUpload(
      uploadFiles.filter((file) => file.percent === 0),
      updateUploadFile,
    )

    if (uploadResult !== 'ALL_SUCCEEDED') {
      return
    }

    const caseTransitioned = await transitionCase(
      workingCase.id,
      CaseTransition.APPEAL,
    )

    if (caseTransitioned) {
      setVisibleModal('APPEAL_SENT')
    }
  }, [
    handleUpload,
    transitionCase,
    updateUploadFile,
    uploadFiles,
    workingCase.id,
  ])

  const handleRemoveFile = (file: UploadFile) => {
    if (file.key) {
      handleRemove(file, removeUploadFile)
    } else {
      removeUploadFile(file)
    }
  }

  const handleChange = (files: File[], category: CaseFileCategory) => {
    addUploadFiles(files, { category, status: FileUploadStatus.done })
  }

  return (
    <PageLayout workingCase={workingCase} isLoading={false} notFound={false}>
      <PageHeader title={formatMessage(titles.shared.appealToCourtOfAppeals)} />
      <FormContentContainer>
        <PageTitle previousUrl={previousUrl}>Kæra til Landsréttar</PageTitle>
        <Box component="section" marginBottom={5}>
          <Text variant="h2" as="h2">
            {`Mál nr. ${workingCase.courtCaseNumber}`}
          </Text>
          {workingCase.rulingDate && (
            <RulingDateLabel rulingDate={workingCase.rulingDate} as="h3" />
          )}
        </Box>
        <Box component="section" marginBottom={5}>
          <SectionHeading title="Kæra" required />
          <InputFileUpload
            name="appealBrief"
            files={uploadFiles.filter(
              (file) => file.category === appealBriefType,
            )}
            accept={'application/pdf'}
            title={formatMessage(core.uploadBoxTitle)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
            onChange={(files) => handleChange(files, appealBriefType)}
            onRemove={(file) => {
              handleRemoveFile(file)
            }}
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
          <Text marginBottom={3} whiteSpace="pre">
            {
              'Ef ný gögn eiga að fylgja kærunni er hægt að hlaða þeim upp hér að neðan.'
            }
            {'\n'}
            {!isDefenceUser(user) &&
              'Athugið að gögn sem hér er hlaðið upp verða einungis sýnileg Landsrétti.'}
          </Text>
          <InputFileUpload
            name="appealCaseFiles"
            files={uploadFiles.filter(
              (file) => file.category === appealCaseFilesType,
            )}
            accept={'application/pdf'}
            title={formatMessage(core.uploadBoxTitle)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
            onChange={(files) => handleChange(files, appealCaseFilesType)}
            onRemove={(file) => handleRemoveFile(file)}
            onOpenFile={(file) => onOpenFile(file)}
            hideIcons={!allFilesDoneOrError}
            disabled={!allFilesDoneOrError}
          />
        </Box>
        {!isIndictmentCase(workingCase.type) && isProsecutionUser(user) && (
          <Box component="section" marginBottom={10}>
            <RequestAppealRulingNotToBePublishedCheckbox />
          </Box>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={previousUrl}
          onNextButtonClick={handleNextButtonClick}
          nextButtonText={someFilesError ? 'Reyna aftur' : 'Senda kæru'}
          nextIsDisabled={
            !uploadFiles.find((file) => file.category === appealBriefType) ||
            isTransitioningCase
          }
          nextIsLoading={!allFilesDoneOrError || isTransitioningCase}
          nextButtonIcon={undefined}
          nextButtonColorScheme={someFilesError ? 'destructive' : 'default'}
        />
      </FormContentContainer>
      {visibleModal === 'APPEAL_SENT' && (
        <Modal
          title="Kæra hefur verið send viðkomandi héraðsdómstól"
          text="Tilkynning um móttöku kæru verður send á aðila máls."
          secondaryButton={{
            text: formatMessage(core.closeModal),
            onClick: () => router.push(previousUrl),
          }}
        />
      )}
    </PageLayout>
  )
}

export default AppealToCourtOfAppeals
