import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  Box,
  Button,
  InputFileUpload,
  Text,
  UploadFile,
} from '@island.is/island-ui/core'
import { core, titles } from '@island.is/judicial-system-web/messages'
import RulingDateLabel from '@island.is/judicial-system-web/src/components/RulingDateLabel/RulingDateLabel'
import {
  CaseFileCategory,
  isProsecutionRole,
} from '@island.is/judicial-system/types'
import {
  TUploadFile,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'
import * as constants from '@island.is/judicial-system/consts'

import { appealToCourtOfAppeals as strings } from './AppealToCourtOfAppeals.strings'
import { isAppealStepValid } from '@island.is/judicial-system-web/src/utils/validate'

const AppealToCourtOfAppeals = () => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const [displayFiles, setDisplayFiles] = useState<TUploadFile[]>([])
  const {
    handleChange,
    handleRemove,
    handleRetry,
    generateSingleFileUpdate,
  } = useS3Upload(workingCase.id)
  const { pid } = router.query
  const appealBriefType = isProsecutionRole(user?.role)
    ? CaseFileCategory.PROSECUTOR_APPEAL_BRIEF
    : CaseFileCategory.DEFENDANT_APPEAL_BRIEF
  const appealCaseFilesType = isProsecutionRole(user?.role)
    ? CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE
    : CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE
  const previousUrl = `${constants.SIGNED_VERDICT_OVERVIEW_ROUTE}/${pid}`
  const isStepValid = isAppealStepValid(workingCase, user?.role)

  const removeFileCB = useCallback((file: UploadFile) => {
    setDisplayFiles((previous) =>
      previous.filter((caseFile) => caseFile.id !== file.id),
    )
  }, [])

  const handleUIUpdate = useCallback(
    (displayFile: TUploadFile, newId?: string) => {
      setDisplayFiles((previous) =>
        generateSingleFileUpdate(previous, displayFile, newId),
      )
    },
    [generateSingleFileUpdate],
  )

  return (
    <PageLayout workingCase={workingCase} isLoading={false} notFound={false}>
      <PageHeader title={formatMessage(titles.shared.appealToCourtOfAppeals)} />
      <FormContentContainer>
        <Box marginBottom={2}>
          <Button
            variant="text"
            preTextIcon="arrowBack"
            onClick={() => router.push(previousUrl)}
          >
            {formatMessage(core.back)}
          </Button>
        </Box>
        <Box marginBottom={1}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.title)}
          </Text>
        </Box>
        {workingCase.courtEndTime && (
          <Box marginBottom={7}>
            <RulingDateLabel courtEndTime={workingCase.courtEndTime} />
          </Box>
        )}
        {user && (
          <>
            <Box component="section" marginBottom={5}>
              <SectionHeading
                title={formatMessage(strings.appealBriefTitle)}
                required
              />
              <InputFileUpload
                fileList={displayFiles.filter(
                  (file) => file.category === appealBriefType,
                )}
                accept={'application/pdf'}
                header={formatMessage(core.uploadBoxTitle)}
                description={formatMessage(core.uploadBoxDescription, {
                  fileEndings: '.pdf',
                })}
                buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
                multiple={false}
                onChange={(files) =>
                  handleChange(
                    files,
                    appealBriefType,
                    setDisplayFiles,
                    handleUIUpdate,
                  )
                }
                onRemove={(file) => handleRemove(file, removeFileCB)}
                onRetry={(file) => handleRetry(file, handleUIUpdate)}
              />
            </Box>
            <Box component="section" marginBottom={5}>
              <SectionHeading
                title={formatMessage(strings.appealCaseFilesTitle)}
                marginBottom={1}
              />
              <Text marginBottom={3}>
                {formatMessage(strings.appealCaseFilesSubtitle)}
              </Text>
              <InputFileUpload
                fileList={displayFiles.filter(
                  (file) => file.category === appealCaseFilesType,
                )}
                accept={'application/pdf'}
                header={formatMessage(core.uploadBoxTitle)}
                description={formatMessage(core.uploadBoxDescription, {
                  fileEndings: '.pdf',
                })}
                buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
                multiple={false}
                onChange={(files) =>
                  handleChange(
                    files,
                    appealCaseFilesType,
                    setDisplayFiles,
                    handleUIUpdate,
                  )
                }
                onRemove={(file) => handleRemove(file, removeFileCB)}
                onRetry={(file) => handleRetry(file, handleUIUpdate)}
              />
            </Box>
          </>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={previousUrl}
          // onNextButtonClick={() =>
          //   handleNavigationTo(
          //     constants.INDICTMENTS_PROSECUTOR_AND_DEFENDER_ROUTE,
          //   )
          // }
          nextButtonText={formatMessage(strings.nextButtonText)}
          nextIsDisabled={!isStepValid}
          nextButtonIcon={undefined}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default AppealToCourtOfAppeals
