import { FC, useCallback, useContext, useState } from 'react'
import React from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import { Accordion, AlertMessage, Box } from '@island.is/island-ui/core'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import { isRulingOrDismissalCase } from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  Conclusion,
  ConnectedCaseFilesAccordionItem,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
  // IndictmentsLawsBrokenAccordionItem, NOTE: Temporarily hidden while list of laws broken is not complete
  InfoCardClosedIndictment,
  MarkdownWrapper,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  ReopenModal,
  RulingInput,
  SectionHeading,
  useIndictmentsLawsBroken,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import VerdictStatusAlert from '@island.is/judicial-system-web/src/components/VerdictStatusAlert/VerdictStatusAlert'
import {
  CaseIndictmentRulingDecision,
  EventType,
  ServiceRequirement,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import useEventLog from '@island.is/judicial-system-web/src/utils/hooks/useEventLog'
import useVerdict from '@island.is/judicial-system-web/src/utils/hooks/useVerdict'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import { ConfirmationInformation } from './ConfirmationInformation'
import { CriminalRecordUpdate } from './CriminalRecordUpdate'
import { DefendantServiceRequirement } from './DefendantServiceRequirement'
import { InformationForDefendant } from './InformationForDefendant'
import strings from './Completed.strings'

type modal =
  | 'CONFIRM_AND_SEND_TO_PUBLIC_PROSECUTOR'
  | 'DELIVER_VERDICTS'
  | 'REOPEN'

const Completed: FC = () => {
  const { user } = useContext(UserContext)

  const { formatMessage } = useIntl()
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { deliverCaseVerdict } = useVerdict()
  const { uploadFiles, addUploadFiles, updateUploadFile, removeUploadFile } =
    useUploadFiles(workingCase.caseFiles)
  const { handleUpload } = useS3Upload(workingCase.id)
  const { createEventLog } = useEventLog()
  const lawsBroken = useIndictmentsLawsBroken(workingCase)

  const [isLoading, setIsLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState<modal>()

  // If the case has not been sent to the public prosecutor after completion/correction
  // then show the send to public prosecutor button
  const isSentToPublicProsecutor = Boolean(
    workingCase.indictmentCompletedDate &&
      workingCase.indictmentSentToPublicProsecutorDate &&
      workingCase.indictmentSentToPublicProsecutorDate >
        workingCase.indictmentCompletedDate,
  )

  const completeCaseConfirmation = useCallback(async () => {
    setIsLoading(true)

    const eventLogCreated = await createEventLog({
      caseId: workingCase.id,
      eventType: EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
    })

    if (!eventLogCreated) {
      setIsLoading(false)
      return
    }

    router.push(getStandardUserDashboardRoute(user))

    setIsLoading(false)
  }, [createEventLog, workingCase.id, user])

  const completeCaseConfirmationWithVerdictDelivery = useCallback(async () => {
    setIsLoading(true)

    const results = await deliverCaseVerdict(workingCase.id)

    if (!results) {
      setIsLoading(false)
      return
    }

    completeCaseConfirmation()
  }, [completeCaseConfirmation, deliverCaseVerdict, workingCase.id])

  // TODO: It would probably make sense to separate delivering verdicts
  //       from sending to the public prosecutor - that way we can
  //       create some logic around changes service requirements
  const handleCaseConfirmation = useCallback(async () => {
    setIsLoading(true)

    const uploadResult = await handleUpload(
      uploadFiles.filter((file) => file.percent === 0),
      updateUploadFile,
    )

    if (uploadResult !== 'ALL_SUCCEEDED') {
      setIsLoading(false)
      return
    }

    // The verdict needs to be delivered to some defendants
    const requiresVerdictDeliveryToDefendants = workingCase.defendants?.some(
      ({ verdict }) =>
        verdict?.serviceRequirement === ServiceRequirement.REQUIRED,
    )

    if (requiresVerdictDeliveryToDefendants) {
      // If verdicts have already been sent, then we ask
      if (workingCase.indictmentSentToPublicProsecutorDate) {
        setIsLoading(false)
        setModalVisible('DELIVER_VERDICTS')
        return
      }

      completeCaseConfirmationWithVerdictDelivery()
      return
    }

    completeCaseConfirmation()
  }, [
    handleUpload,
    uploadFiles,
    updateUploadFile,
    workingCase.defendants,
    workingCase.indictmentSentToPublicProsecutorDate,
    completeCaseConfirmation,
    completeCaseConfirmationWithVerdictDelivery,
  ])

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )

  const isRuling =
    workingCase.indictmentRulingDecision === CaseIndictmentRulingDecision.RULING
  const isFine =
    workingCase.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE
  const isRulingOrFine = isRuling || isFine

  const includeRulingText =
    !workingCase.withCourtSessions ||
    !workingCase.courtSessions ||
    workingCase.courtSessions.length === 0

  const stepIsValid = () => {
    const isValidDefendants = isRuling
      ? workingCase.defendants?.every((defendant) =>
          defendant.verdict?.serviceRequirement ===
          ServiceRequirement.NOT_APPLICABLE
            ? Boolean(defendant.verdict?.appealDecision)
            : Boolean(defendant.verdict?.serviceRequirement),
        )
      : true
    const isValidRuling =
      includeRulingText &&
      workingCase.defendants?.some(
        (defendant) =>
          defendant.verdict?.serviceRequirement === ServiceRequirement.REQUIRED,
      )
        ? workingCase.ruling
        : true

    return isValidDefendants && isValidRuling
  }

  const hasLawsBroken = lawsBroken.size > 0
  const hasMergeCases =
    workingCase.mergedCases && workingCase.mergedCases.length > 0

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
        {workingCase.rulingModifiedHistory && (
          <Box marginBottom={5}>
            <AlertMessage
              type="info"
              title="Mál leiðrétt"
              message={
                <MarkdownWrapper
                  markdown={workingCase.rulingModifiedHistory}
                  textProps={{ variant: 'small' }}
                />
              }
            />
          </Box>
        )}
        {workingCase.defendants?.map(
          (defendant) =>
            defendant.verdict && (
              <Box
                key={`${defendant.id}${defendant.verdict.id}`}
                marginBottom={2}
              >
                <VerdictStatusAlert
                  defendant={defendant}
                  verdict={defendant.verdict}
                />
              </Box>
            ),
        )}
        <div className={grid({ gap: 5, marginBottom: 10 })}>
          <Box component="section">
            <InfoCardClosedIndictment />
          </Box>
          {isRulingOrDismissalCase(workingCase.indictmentRulingDecision) && (
            <Conclusion
              title={`${
                workingCase.indictmentRulingDecision ===
                CaseIndictmentRulingDecision.RULING
                  ? 'Dóms'
                  : 'Úrskurðar'
              }orð héraðsdóms`}
              conclusionText={workingCase.courtSessions?.at(-1)?.ruling}
              judgeName={workingCase.judge?.name}
            />
          )}
          {(hasLawsBroken || hasMergeCases) && (
            <>
              {/*
            NOTE: Temporarily hidden while list of laws broken is not complete in
            indictment cases
            
            {hasLawsBroken && (
              <IndictmentsLawsBrokenAccordionItem workingCase={workingCase} />
            )} */}
              {hasMergeCases && (
                <Accordion dividerOnBottom={false} dividerOnTop={false}>
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
            </>
          )}
          <Box component="section">
            <IndictmentCaseFilesList workingCase={workingCase} />
          </Box>
          {isRulingOrFine && (
            <Box component="section">
              <CriminalRecordUpdate
                uploadFiles={uploadFiles}
                addUploadFiles={addUploadFiles}
                updateUploadFile={updateUploadFile}
                removeUploadFile={removeUploadFile}
              />
            </Box>
          )}
          {/* NOTE: This is a temp state for cases that were already in progress when the new court record was released */}
          {includeRulingText && isRuling && (
            <div>
              <SectionHeading title="Dómsorð" marginBottom={2} heading="h4" />
              <RulingInput
                rows={8}
                label="Dómsorð"
                placeholder="Hvert er dómsorðið?"
                required
              />
            </div>
          )}
          {isRuling && (
            <Box component="section">
              <SectionHeading
                title={formatMessage(strings.serviceRequirementTitle)}
                required
              />
              <div className={grid({ gap: 4 })}>
                {workingCase.defendants?.map((defendant) => {
                  const { verdict } = defendant
                  if (!verdict) return null

                  return (
                    <Box key={defendant.id} className={grid({ gap: 3 })}>
                      <DefendantServiceRequirement defendant={defendant} />
                      {verdict.serviceRequirement ===
                        ServiceRequirement.REQUIRED && (
                        <InformationForDefendant defendant={defendant} />
                      )}
                    </Box>
                  )
                })}
              </div>
            </Box>
          )}
        </div>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={getStandardUserDashboardRoute(user)}
          hideActionButton={
            workingCase.indictmentRulingDecision ===
            CaseIndictmentRulingDecision.WITHDRAWAL
          }
          actionButtonText="Leiðrétta mál"
          actionButtonColorScheme="default"
          actionButtonVariant="primary"
          onActionButtonClick={() => setModalVisible('REOPEN')}
          hideNextButton={!isRulingOrFine || isSentToPublicProsecutor}
          nextButtonText={formatMessage(strings.sendToPublicProsecutor)}
          nextIsDisabled={!stepIsValid()}
          onNextButtonClick={() => {
            setModalVisible('CONFIRM_AND_SEND_TO_PUBLIC_PROSECUTOR')
          }}
        />
      </FormContentContainer>
      {modalVisible === 'CONFIRM_AND_SEND_TO_PUBLIC_PROSECUTOR' && (
        <Modal
          title="Viltu senda mál til ákæruvalds?"
          text={<ConfirmationInformation uploadFiles={uploadFiles} />}
          primaryButton={{
            text: 'Staðfesta',
            icon: 'checkmark',
            isLoading: isLoading,
            onClick: handleCaseConfirmation,
          }}
          secondaryButton={{
            text: 'Hætta við',
            onClick: () => setModalVisible(undefined),
          }}
        />
      )}
      {modalVisible === 'DELIVER_VERDICTS' && (
        <Modal
          title="Viltu senda dóm í birtingu?"
          text="Hægt er að senda nýtt eintak af dómi í birtingu ef þörf krefur."
          primaryButton={{
            text: 'Já, senda',
            icon: 'checkmark',
            isLoading: isLoading,
            onClick: completeCaseConfirmationWithVerdictDelivery,
          }}
          secondaryButton={{
            text: 'Nei',
            isLoading: isLoading,
            onClick: completeCaseConfirmation,
          }}
        />
      )}
      {modalVisible === 'REOPEN' && (
        <ReopenModal onClose={() => setModalVisible(undefined)} />
      )}
    </PageLayout>
  )
}

export default Completed
