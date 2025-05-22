import { FC, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'motion/react'
import router from 'next/router'

import {
  Accordion,
  Box,
  Checkbox,
  FileUploadStatus,
  Input,
  InputFileUpload,
  RadioButton,
  Text,
  UploadFile,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
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
  SectionHeading,
  useIndictmentsLawsBroken,
} from '@island.is/judicial-system-web/src/components'
import VerdictAppealDecisionChoice from '@island.is/judicial-system-web/src/components/VerdictAppealDecisionChoice/VerdictAppealDecisionChoice'
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
import * as styles from './Completed.css'

const Completed: FC = () => {
  const { formatMessage } = useIntl()
  const { setAndSendDefendantToServer } = useDefendants()
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { uploadFiles, addUploadFiles, removeUploadFile, updateUploadFile } =
    useUploadFiles(workingCase.caseFiles)
  const { handleUpload, handleRemove } = useS3Upload(workingCase.id)
  const { createEventLog } = useEventLog()

  const lawsBroken = useIndictmentsLawsBroken(workingCase)
  const [modalVisible, setModalVisible] =
    useState<'SENT_TO_PUBLIC_PROSECUTOR'>()

  const isSentToPublicProsecutor = workingCase.eventLogs?.some(
    (log) => log.eventType === EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
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
    (files: File[]) => {
      // If the case has been sent to the public prosecutor
      // we want to complete these uploads straight away
      if (isSentToPublicProsecutor) {
        handleUpload(
          addUploadFiles(files, {
            category: CaseFileCategory.CRIMINAL_RECORD_UPDATE,
          }),
          updateUploadFile,
        )
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
    [addUploadFiles, handleUpload, isSentToPublicProsecutor, updateUploadFile],
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

  const stepIsValid = () =>
    workingCase.indictmentRulingDecision === CaseIndictmentRulingDecision.RULING
      ? workingCase.defendants?.every((defendant) =>
          defendant.serviceRequirement === ServiceRequirement.NOT_APPLICABLE
            ? Boolean(defendant.verdictAppealDecision)
            : Boolean(defendant.serviceRequirement),
        )
      : true

  const hasLawsBroken = lawsBroken.size > 0
  const hasMergeCases =
    workingCase.mergedCases && workingCase.mergedCases.length > 0

  const marginSpaceBetweenButtons = 2

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
            />
          </Box>
        )}
        {isRuling && (
          <Box marginBottom={5} component="section">
            <SectionHeading
              title={formatMessage(strings.serviceRequirementTitle)}
              required
            />
            {workingCase.defendants?.map((defendant, index) => (
              <>
                <Box
                  key={defendant.id}
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
                              verdictAppealDecision: null,
                            },
                            setWorkingCase,
                          )
                        }}
                        large
                        backgroundColor="white"
                        label={
                          formatMessage(strings.serviceRequirementRequired) +
                          ' asdas'
                        }
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
                            serviceRequirement: ServiceRequirement.NOT_REQUIRED,
                            verdictAppealDecision: null,
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
                      {defendant.serviceRequirement ===
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
                          <VerdictAppealDecisionChoice defendant={defendant} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </BlueBox>
                </Box>
                {features?.includes(Feature.SERVICE_PORTAL) && (
                  <AnimatePresence>
                    {defendant.serviceRequirement ===
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
                          <Checkbox
                            label="Leiðbeiningar um endurupptöku útivistarmála"
                            large
                            filled
                          />
                          <Box marginBottom={marginSpaceBetweenButtons} />
                          <Checkbox
                            label="Upplýsingar um áfrýjun til Landsréttar og áfrýjunarfresti"
                            large
                            filled
                          />
                          <Box marginBottom={marginSpaceBetweenButtons} />
                          <Checkbox
                            label="Þýðing skilorðsbundinnar refsingar og skilorðsrofs"
                            large
                            filled
                          />
                          <Box marginBottom={marginSpaceBetweenButtons} />
                          <Checkbox
                            label="Þýðing sviptingu ökuréttinda"
                            large
                            filled
                          />

                          <Box marginBottom={marginSpaceBetweenButtons} />
                          <Checkbox
                            label="Þýðing vararefsingu fésekta"
                            large
                            filled
                          />

                          <Box marginBottom={marginSpaceBetweenButtons} />
                          <Checkbox
                            label="Upplýsingar um skilyrði og umsókn um samfélagsþjónustu"
                            large
                            filled
                          />

                          <Box marginBottom={marginSpaceBetweenButtons} />
                          <Checkbox
                            label="Upplýsingar um greiðslu sekta, sakarkostnaðar og bóta"
                            large
                            filled
                          />

                          <Box marginBottom={marginSpaceBetweenButtons} />
                          <Checkbox
                            label="Upplýsingar um upptöku muna/efna"
                            large
                            filled
                          />
                        </BlueBox>
                        <Box marginBottom={5} />
                        <SectionHeading
                          title={'Dómsorð'}
                          marginBottom={2}
                          heading="h4"
                        />
                        <Input
                          data-testid="sessionBookings"
                          name="sessionBookings"
                          label={'Dómsorð'}
                          value={''}
                          placeholder={'Hvert er dómsorðið?'}
                          // onChange={(event) => console.log(event.target.value)}
                          textarea
                          rows={8}
                          autoExpand={{ on: true, maxHeight: 600 }}
                          required={true}
                        />
                      </Box>
                    )}
                  </AnimatePresence>
                )}
              </>
            ))}
          </Box>
        )}
      </FormContentContainer>
      <Box marginBottom={10} />
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={constants.CASES_ROUTE}
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
          onPrimaryButtonClick={() => router.push(constants.CASES_ROUTE)}
        />
      )}
    </PageLayout>
  )
}

export default Completed
