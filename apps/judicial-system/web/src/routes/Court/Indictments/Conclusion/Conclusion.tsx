import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import {
  Box,
  InputFileUpload,
  RadioButton,
  toast,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { core, errors, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseFileCategory,
  CaseTransition,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  useCase,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { conclusion as m } from './Conclusion.strings'

const Conclusion: React.FC = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const [navigateTo, setNavigateTo] = useState<keyof stepValidationsType>()

  const { formatMessage } = useIntl()
  const { transitionCase, isTransitioningCase, setAndSendCaseToServer } =
    useCase()

  const {
    uploadFiles,
    allFilesDoneOrError,
    addUploadFiles,
    updateUploadFile,
    removeUploadFile,
  } = useUploadFiles(workingCase.caseFiles)
  const { handleUpload, handleRetry, handleRemove } = useS3Upload(
    workingCase.id,
  )

  const handleNavigationTo = useCallback(
    async (destination: keyof stepValidationsType) => {
      const transitionSuccessful = await transitionCase(
        workingCase.id,
        CaseTransition.ACCEPT,
      )

      if (transitionSuccessful) {
        setNavigateTo(destination)
      } else {
        toast.error(formatMessage(errors.transitionCase))
      }
    },
    [transitionCase, workingCase, formatMessage],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={allFilesDoneOrError}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(titles.court.indictments.courtRecord)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(m.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <BlueBox>
            <Box marginBottom={2}>
              <RadioButton
                id="conclusion-postpone"
                name="conclusion-decision"
                checked={false} // {defendant.defendantPlea === DefendantPlea.GUILTY}
                onChange={() => {
                  setAndSendCaseToServer([], workingCase, setWorkingCase)
                }}
                large
                backgroundColor="white"
                label={formatMessage(m.postponed)}
              />
            </Box>
            <RadioButton
              id="conclusion-judgement"
              name="conclusion-decision"
              checked={false} // {defendant.defendantPlea === DefendantPlea.NOT_GUILTY}
              onChange={() => {
                // handleUpdateDefendant({
                //   defendantId: defendant.id,
                //   caseId: workingCase.id,
                //   defendantPlea: DefendantPlea.NOT_GUILTY,
                // })
              }}
              large
              backgroundColor="white"
              label={formatMessage(m.judgement)}
            />
          </BlueBox>
        </Box>
        <Box component="section" marginBottom={5}>
          <SectionHeading title={formatMessage(m.courtRecordTitle)} />
          <InputFileUpload
            fileList={uploadFiles.filter(
              (file) => file.category === CaseFileCategory.COURT_RECORD,
            )}
            accept="application/pdf"
            header={formatMessage(m.inputFieldLabel)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(m.uploadButtonText)}
            onChange={(files) => {
              handleUpload(
                addUploadFiles(files, CaseFileCategory.COURT_RECORD),
                updateUploadFile,
              )
            }}
            onRemove={(file) => handleRemove(file, removeUploadFile)}
            onRetry={(file) => handleRetry(file, updateUploadFile)}
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <SectionHeading title={formatMessage(m.rulingTitle)} />
          <InputFileUpload
            fileList={uploadFiles.filter(
              (file) => file.category === CaseFileCategory.RULING,
            )}
            accept="application/pdf"
            header={formatMessage(m.inputFieldLabel)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(m.uploadButtonText)}
            onChange={(files) =>
              handleUpload(
                addUploadFiles(files, CaseFileCategory.RULING),
                updateUploadFile,
              )
            }
            onRemove={(file) => handleRemove(file, removeUploadFile)}
            onRetry={(file) => handleRetry(file, updateUploadFile)}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INDICTMENTS_DEFENDER_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.CLOSED_INDICTMENT_OVERVIEW_ROUTE)
          }
          nextIsDisabled={!allFilesDoneOrError}
          nextIsLoading={isTransitioningCase}
          nextButtonText={formatMessage(m.nextButtonText)}
        />
      </FormContentContainer>
      {navigateTo !== undefined && (
        <Modal
          title={formatMessage(m.modalTitle)}
          text={formatMessage(m.modalText)}
          onPrimaryButtonClick={() => {
            router.push(`${navigateTo}/${workingCase.id}`)
          }}
          primaryButtonText={formatMessage(core.closeModal)}
        />
      )}
    </PageLayout>
  )
}

export default Conclusion
