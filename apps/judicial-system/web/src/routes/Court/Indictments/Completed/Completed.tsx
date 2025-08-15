import { FC, useCallback, useContext, useState } from 'react'
import React from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'motion/react'
import router from 'next/router'

import {
  Accordion,
  Box,
  Checkbox,
  FileUploadStatus,
  InputFileUpload,
  RadioButton,
  Text,
  UploadFile,
} from '@island.is/island-ui/core'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import { informationForDefendantMap } from '@island.is/judicial-system/types'
import { Feature } from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  ConnectedCaseFilesAccordionItem,
  CourtCaseInfo,
  FeatureContext,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
  // IndictmentsLawsBrokenAccordionItem, NOTE: Temporarily hidden while list of laws broken is not complete
  InfoCardClosedIndictment,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  RulingInput,
  SectionHeading,
  useIndictmentsLawsBroken,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import VerdictAppealDecisionChoice from '@island.is/judicial-system-web/src/components/VerdictAppealDecisionChoice/VerdictAppealDecisionChoice'
import {
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  EventType,
  ServiceRequirement,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useFileList,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import useEventLog from '@island.is/judicial-system-web/src/utils/hooks/useEventLog'
import useVerdict from '@island.is/judicial-system-web/src/utils/hooks/useVerdict'

import strings from './Completed.strings'
import * as styles from './Completed.css'

const Completed: FC = () => {
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const { setAndSendVerdictToServer } = useVerdict()
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const { uploadFiles, addUploadFiles, removeUploadFile, updateUploadFile } =
    useUploadFiles(workingCase.caseFiles)
  const { handleUpload, handleRemove } = useS3Upload(workingCase.id)
  const { createEventLog } = useEventLog()

  const { onOpenFile } = useFileList({
    caseId: workingCase.id,
  })

  const lawsBroken = useIndictmentsLawsBroken(workingCase)
  const [modalVisible, setModalVisible] =
    useState<'SENT_TO_PUBLIC_PROSECUTOR'>()

  const isSentToPublicProsecutor = Boolean(
    workingCase.indictmentSentToPublicProsecutorDate,
  )

  const handleNextButtonClick = useCallback(async () => {
    const uploadResult = await handleUpload(
      uploadFiles.filter((file) => file.percent === 0),
      updateUploadFile,
    )
    if (uploadResult !== 'ALL_SUCCEEDED') {
      return
    }

    const eventLogCreated = createEventLog({
      caseId: workingCase.id,
      eventType: EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
    })
    if (!eventLogCreated) {
      return
    }

    setModalVisible('SENT_TO_PUBLIC_PROSECUTOR')
  }, [
    handleUpload,
    uploadFiles,
    updateUploadFile,
    createEventLog,
    workingCase.id,
  ])

  const { features } = useContext(FeatureContext)

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
    async (files: File[]) => {
      // If the case has been sent to the public prosecutor
      // we want to complete these uploads straight away
      if (isSentToPublicProsecutor) {
        const uploadResult = await handleUpload(
          addUploadFiles(files, {
            category: CaseFileCategory.CRIMINAL_RECORD_UPDATE,
          }),
          updateUploadFile,
        )
        if (uploadResult !== 'ALL_SUCCEEDED') {
          return
        }

        // TODO: Make sure to log an event if at least one file was uploaded
        const eventLogCreated = createEventLog({
          caseId: workingCase.id,
          eventType: EventType.INDICTMENT_CRIMINAL_RECORD_UPDATED_BY_COURT,
        })
        if (!eventLogCreated) {
          return
        }
      }
      // Otherwise we don't complete uploads until
      // we handle the next button click
      else {
        addUploadFiles(files, {
          category: CaseFileCategory.CRIMINAL_RECORD_UPDATE,
          status: FileUploadStatus.done,
        })
      }
    },
    [
      workingCase.id,
      addUploadFiles,
      handleUpload,
      isSentToPublicProsecutor,
      updateUploadFile,
      createEventLog,
    ],
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

  const isRuling =
    workingCase.indictmentRulingDecision === CaseIndictmentRulingDecision.RULING

  const stepIsValid = () => {
    const isValidDefendants =
      workingCase.indictmentRulingDecision ===
      CaseIndictmentRulingDecision.RULING
        ? workingCase.defendants?.every((defendant) =>
            defendant.verdict?.serviceRequirement ===
            ServiceRequirement.NOT_APPLICABLE
              ? Boolean(defendant.verdict?.appealDecision)
              : Boolean(defendant.verdict?.serviceRequirement),
          )
        : true

    if (features?.includes(Feature.SERVICE_PORTAL)) {
      return Boolean(workingCase.ruling) && isValidDefendants
    } else {
      return isValidDefendants
    }
  }

  const hasLawsBroken = lawsBroken.size > 0
  const hasMergeCases =
    workingCase.mergedCases && workingCase.mergedCases.length > 0

  const marginSpaceBetweenButtons = 2

  const defendantCheckboxes = Array.from(
    informationForDefendantMap.entries(),
  ).map(([key, value]) => ({
    label: value.label,
    value: key,
    tooltip: value.detail,
  }))

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(titles.court.indictments.completed)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.heading)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <Box marginBottom={5} component="section">
          <InfoCardClosedIndictment />
        </Box>
        {(hasLawsBroken || hasMergeCases) && (
          <Box marginBottom={5}>
            {/*
            NOTE: Temporarily hidden while list of laws broken is not complete in
            indictment cases
            
            {hasLawsBroken && (
              <IndictmentsLawsBrokenAccordionItem workingCase={workingCase} />
            )} */}
            {hasMergeCases && (
              <Accordion>
                {workingCase.mergedCases?.map((mergedCase) => (
                  <Box key={mergedCase.id}>
                    <ConnectedCaseFilesAccordionItem
                      connectedCaseParentId={workingCase.id}
                      connectedCase={mergedCase}
                    />
                  </Box>
                ))}
              </Accordion>
            )}
          </Box>
        )}
        <Box marginBottom={5} component="section">
          <IndictmentCaseFilesList workingCase={workingCase} />
        </Box>
        {isRulingOrFine && (
          <Box marginBottom={isRuling ? 5 : 10} component="section">
            <SectionHeading
              title={formatMessage(strings.criminalRecordUpdateTitle)}
            />
            <InputFileUpload
              name="criminalRecordUpdate"
              files={uploadFiles.filter(
                (file) =>
                  file.category === CaseFileCategory.CRIMINAL_RECORD_UPDATE,
              )}
              accept="application/pdf"
              title={formatMessage(core.uploadBoxTitle)}
              buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
              description={formatMessage(core.uploadBoxDescription, {
                fileEndings: '.pdf',
              })}
              onChange={handleCriminalRecordUpdateUpload}
              onRemove={handleRemoveFile}
              onOpenFile={(file) => onOpenFile(file)}
            />
          </Box>
        )}
        {isRuling && (
          <Box marginBottom={5} component="section">
            <SectionHeading
              title={formatMessage(strings.serviceRequirementTitle)}
              required
            />
            {workingCase.defendants?.map((defendant, index) => {
              const { verdict } = defendant
              if (!verdict) return null

              return (
                <React.Fragment key={defendant.id}>
                  <Box
                    component="section"
                    marginBottom={
                      workingCase.defendants &&
                      workingCase.defendants.length - 1 === index
                        ? 5
                        : 3
                    }
                  >
                    <BlueBox>
                      <SectionHeading
                        title={defendant.name || ''}
                        marginBottom={2}
                        heading="h4"
                      />
                      <Box marginBottom={2}>
                        <RadioButton
                          id={`defendant-${defendant.id}-service-requirement-not-applicable`}
                          name={`defendant-${defendant.id}-service-requirement`}
                          checked={
                            verdict.serviceRequirement ===
                            ServiceRequirement.NOT_APPLICABLE
                          }
                          onChange={() => {
                            setAndSendVerdictToServer(
                              {
                                defendantId: defendant.id,
                                caseId: workingCase.id,
                                serviceRequirement:
                                  ServiceRequirement.NOT_APPLICABLE,
                                serviceInformationForDefendant: [],
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
                            verdict.serviceRequirement ===
                            ServiceRequirement.REQUIRED
                          }
                          onChange={() => {
                            setAndSendVerdictToServer(
                              {
                                defendantId: defendant.id,
                                caseId: workingCase.id,
                                serviceRequirement: ServiceRequirement.REQUIRED,
                                appealDecision: null,
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
                          verdict.serviceRequirement ===
                          ServiceRequirement.NOT_REQUIRED
                        }
                        onChange={() => {
                          setAndSendVerdictToServer(
                            {
                              defendantId: defendant.id,
                              caseId: workingCase.id,
                              serviceRequirement:
                                ServiceRequirement.NOT_REQUIRED,
                              appealDecision: null,
                              serviceInformationForDefendant: [],
                            },
                            setWorkingCase,
                          )
                        }}
                        large
                        backgroundColor="white"
                        label={formatMessage(
                          strings.serviceRequirementNotRequired,
                        )}
                        tooltip={formatMessage(
                          strings.serviceRequirementNotRequiredTooltip,
                        )}
                      />
                      <AnimatePresence>
                        {verdict.serviceRequirement ===
                          ServiceRequirement.NOT_APPLICABLE && (
                          <motion.div
                            key="verdict-appeal-decision"
                            className={styles.motionBox}
                            initial={{
                              opacity: 0,
                              height: 0,
                            }}
                            animate={{
                              opacity: 1,
                              height: 'auto',
                              transition: {
                                opacity: { delay: 0.2 },
                              },
                            }}
                            exit={{
                              opacity: 0,
                              height: 0,
                              transition: {
                                height: { delay: 0.2 },
                              },
                            }}
                          >
                            <SectionHeading
                              heading="h4"
                              title="Afstaða dómfellda til dóms"
                              marginBottom={2}
                              required
                            />
                            <VerdictAppealDecisionChoice
                              defendant={defendant}
                              verdict={verdict}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </BlueBox>
                  </Box>
                  {features?.includes(Feature.SERVICE_PORTAL) && (
                    <AnimatePresence>
                      {verdict.serviceRequirement ===
                        ServiceRequirement.REQUIRED && (
                        <Box>
                          <SectionHeading
                            title={'Upplýsingagjöf til dómfellda'}
                            marginBottom={2}
                            heading="h4"
                          />
                          <Text marginBottom={3}>
                            Vinsamlegast hakið við þau atriði sem upplýsa verður
                            dómfellda um við birtingu dómsins.
                          </Text>
                          <BlueBox>
                            {defendantCheckboxes.map(
                              (checkbox, indexChecbox) => (
                                <React.Fragment
                                  key={`${verdict.id}-${checkbox.value}`}
                                >
                                  <Checkbox
                                    label={checkbox.label}
                                    id={`${verdict.id}-${checkbox.value}`}
                                    name={`${verdict.id}-${checkbox.value}`}
                                    checked={verdict.serviceInformationForDefendant?.includes(
                                      checkbox.value,
                                    )}
                                    tooltip={checkbox?.tooltip}
                                    large
                                    filled
                                    onChange={(target) => {
                                      setAndSendVerdictToServer(
                                        {
                                          defendantId: defendant.id,
                                          caseId: workingCase.id,
                                          serviceInformationForDefendant: target
                                            .target.checked
                                            ? [
                                                ...(verdict.serviceInformationForDefendant ||
                                                  []),
                                                checkbox.value,
                                              ]
                                            : (
                                                verdict.serviceInformationForDefendant ||
                                                []
                                              ).filter(
                                                (item) =>
                                                  item !== checkbox.value,
                                              ),
                                        },
                                        setWorkingCase,
                                      )
                                    }}
                                  />
                                  {defendantCheckboxes.length - 1 !==
                                    indexChecbox && (
                                    <Box
                                      marginBottom={marginSpaceBetweenButtons}
                                    />
                                  )}
                                </React.Fragment>
                              ),
                            )}
                          </BlueBox>
                        </Box>
                      )}
                    </AnimatePresence>
                  )}
                </React.Fragment>
              )
            })}
          </Box>
        )}
        {features?.includes(Feature.SERVICE_PORTAL) &&
          workingCase.indictmentRulingDecision ===
            CaseIndictmentRulingDecision.RULING && (
            <Box>
              <SectionHeading title={'Dómsorð'} marginBottom={2} heading="h4" />
              <RulingInput
                workingCase={workingCase}
                setWorkingCase={setWorkingCase}
                rows={8}
                label="Dómsorð"
                placeholder="Hvert er dómsorðið?"
                required
              />
            </Box>
          )}
      </FormContentContainer>
      <Box marginBottom={10} />
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={getStandardUserDashboardRoute(user)}
          hideNextButton={!isRulingOrFine || isSentToPublicProsecutor}
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
          onPrimaryButtonClick={() =>
            router.push(getStandardUserDashboardRoute(user))
          }
        />
      )}
    </PageLayout>
  )
}

export default Completed
