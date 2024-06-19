import React, { FC, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import {
  Box,
  InputFileUpload,
  RadioButton,
  Text,
  UploadFile,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
  InfoCardClosedIndictment,
  Modal,
  PageHeader,
  PageLayout,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  EventType,
  ServiceRequirement,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useDefendants,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import useEventLog from '@island.is/judicial-system-web/src/utils/hooks/useEventLog'

import strings from './Completed.strings'

const Completed: FC = () => {
  const { formatMessage } = useIntl()
  const { setAndSendDefendantToServer } = useDefendants()
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { uploadFiles, addUploadFiles, removeUploadFile, updateUploadFile } =
    useUploadFiles(workingCase.caseFiles)
  const { handleUpload, handleRemove } = useS3Upload(workingCase.id)
  const { createEventLog } = useEventLog()
  const [modalVisible, setModalVisible] =
    useState<'SENT_TO_PUBLIC_PROSECUTOR'>()

  const sentToPublicProsecutor = workingCase.eventLogs?.some(
    (log) => log.eventType === EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
  )

  const handleNextButtonClick = useCallback(async () => {
    const allSucceeded = await handleUpload(
      uploadFiles.filter((file) => !file.key),
      updateUploadFile,
    )

    if (!allSucceeded) {
      return
    }

    createEventLog({
      caseId: workingCase.id,
      eventType: EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
    })

    setModalVisible('SENT_TO_PUBLIC_PROSECUTOR')
  }, [
    handleUpload,
    uploadFiles,
    updateUploadFile,
    createEventLog,
    workingCase.id,
  ])

  const handleRemoveFile = useCallback(
    (file: UploadFile) => {
      if (file.key) {
        handleRemove(file, removeUploadFile)
      } else {
        removeUploadFile(file)
      }
    },
    [handleRemove, removeUploadFile],
  )

  const handleCriminalRecordUpdateUpload = useCallback(
    (files: File[], type: CaseFileCategory) => {
      addUploadFiles(files, type, 'done')
    },
    [addUploadFiles],
  )

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )

  const isRulingOrFine =
    workingCase.indictmentRulingDecision &&
    [
      CaseIndictmentRulingDecision.RULING,
      CaseIndictmentRulingDecision.FINE,
    ].includes(workingCase.indictmentRulingDecision)

  const stepIsValid = () =>
    workingCase.indictmentRulingDecision === CaseIndictmentRulingDecision.RULING
      ? workingCase.defendants?.every(
          (defendant) =>
            defendant.serviceRequirement !== undefined &&
            defendant.serviceRequirement !== null,
        )
      : true

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(titles.court.indictments.completed)} />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.heading)}
          </Text>
        </Box>
        <Box marginBottom={5} component="section">
          <InfoCardClosedIndictment />
        </Box>
        <Box marginBottom={5} component="section">
          <IndictmentCaseFilesList workingCase={workingCase} />
        </Box>
        {!sentToPublicProsecutor && (
          <>
            {isRulingOrFine && (
              <Box marginBottom={5} component="section">
                <SectionHeading
                  title={formatMessage(strings.criminalRecordUpdateTitle)}
                />
                <InputFileUpload
                  fileList={uploadFiles.filter(
                    (file) =>
                      file.category === CaseFileCategory.CRIMINAL_RECORD_UPDATE,
                  )}
                  accept="application/pdf"
                  header={formatMessage(core.uploadBoxTitle)}
                  buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
                  description={formatMessage(core.uploadBoxDescription, {
                    fileEndings: '.pdf',
                  })}
                  onChange={(files) =>
                    handleCriminalRecordUpdateUpload(
                      files,
                      CaseFileCategory.CRIMINAL_RECORD_UPDATE,
                    )
                  }
                  onRemove={(file) => handleRemoveFile(file)}
                />
              </Box>
            )}
            {workingCase.indictmentRulingDecision ===
              CaseIndictmentRulingDecision.RULING && (
              <Box marginBottom={10}>
                <SectionHeading
                  title={formatMessage(strings.serviceRequirementTitle)}
                />
                {workingCase.defendants?.map((defendant, index) => (
                  <Box
                    key={defendant.id}
                    component="section"
                    marginBottom={
                      workingCase.defendants &&
                      workingCase.defendants.length - 1 === index
                        ? 10
                        : 3
                    }
                  >
                    <BlueBox>
                      <SectionHeading
                        title={defendant.name || ''}
                        marginBottom={2}
                        heading="h4"
                        required
                      />
                      <Box marginBottom={2}>
                        <RadioButton
                          id={`defendant-${defendant.id}-service-requirement-not-applicable`}
                          name={`defendant-${defendant.id}-service-requirement`}
                          checked={
                            defendant.serviceRequirement ===
                            ServiceRequirement.NOT_APPLICABLE
                          }
                          onChange={() => {
                            setAndSendDefendantToServer(
                              {
                                defendantId: defendant.id,
                                caseId: workingCase.id,
                                serviceRequirement:
                                  ServiceRequirement.NOT_APPLICABLE,
                              },
                              setWorkingCase,
                            )
                          }}
                          large
                          backgroundColor="white"
                          label={formatMessage(
                            strings.serviceRequirementNotApplicable,
                          )}
                        />
                      </Box>
                      <Box marginBottom={2}>
                        <RadioButton
                          id={`defendant-${defendant.id}-service-requirement-required`}
                          name={`defendant-${defendant.id}-service-requirement`}
                          checked={
                            defendant.serviceRequirement ===
                            ServiceRequirement.REQUIRED
                          }
                          onChange={() => {
                            setAndSendDefendantToServer(
                              {
                                defendantId: defendant.id,
                                caseId: workingCase.id,
                                serviceRequirement: ServiceRequirement.REQUIRED,
                              },
                              setWorkingCase,
                            )
                          }}
                          large
                          backgroundColor="white"
                          label={formatMessage(
                            strings.serviceRequirementRequired,
                          )}
                        />
                      </Box>
                      <RadioButton
                        id={`defendant-${defendant.id}-service-requirement-not-required`}
                        name={`defendant-${defendant.id}-service-requirement`}
                        checked={
                          defendant.serviceRequirement ===
                          ServiceRequirement.NOT_REQUIRED
                        }
                        onChange={() => {
                          setAndSendDefendantToServer(
                            {
                              defendantId: defendant.id,
                              caseId: workingCase.id,
                              serviceRequirement:
                                ServiceRequirement.NOT_REQUIRED,
                            },
                            setWorkingCase,
                          )
                        }}
                        large
                        backgroundColor="white"
                        label={formatMessage(
                          strings.serviceRequirementNotRequired,
                        )}
                      />
                    </BlueBox>
                  </Box>
                ))}
              </Box>
            )}
          </>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={constants.CASES_ROUTE}
          hideNextButton={!isRulingOrFine || sentToPublicProsecutor}
          nextButtonText={formatMessage(strings.sendToPublicProsecutor)}
          nextIsDisabled={!stepIsValid()}
          onNextButtonClick={handleNextButtonClick}
        />
      </FormContentContainer>
      {modalVisible === 'SENT_TO_PUBLIC_PROSECUTOR' && (
        <Modal
          title={formatMessage(strings.sentToPublicProsecutorModalTitle)}
          text={formatMessage(strings.sentToPublicProsecutorModalMessage)}
          primaryButtonText={formatMessage(core.closeModal)}
          onPrimaryButtonClick={() => router.push(constants.CASES_ROUTE)}
        />
      )}
    </PageLayout>
  )
}

export default Completed
