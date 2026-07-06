import { FC, useCallback, useContext, useState } from 'react'
import React from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import { Box } from '@island.is/island-ui/core'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import { isRulingOrDismissalCase } from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  AllIndictmentCaseFiles,
  AppealRulingModifiedAlert,
  Conclusion,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  // IndictmentsLawsBrokenAccordionItem, NOTE: Temporarily hidden while list of laws broken is not complete
  InfoCardClosedIndictment,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  ReopenModal,
  RulingInput,
  RulingModifiedAlert,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import VerdictStatusAlert from '@island.is/judicial-system-web/src/components/VerdictStatusAlert/VerdictStatusAlert'
import {
  AppealCaseState,
  CaseIndictmentRulingDecision,
  EventType,
  ServiceRequirement,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useAppealCaseBanner,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import useEventLog from '@island.is/judicial-system-web/src/utils/hooks/useEventLog'
import useVerdict from '@island.is/judicial-system-web/src/utils/hooks/useVerdict'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import { ConfirmationInformation } from './ConfirmationInformation'
import { CriminalRecordUpdate } from './CriminalRecordUpdate'
import { DefendantServiceRequirement } from './DefendantServiceRequirement'
import ReopenCaseModal, { canReopenCase } from './ReopenCaseModal'
import strings from './Completed.strings'

type modal =
  | 'CONFIRM_AND_SEND_TO_PUBLIC_PROSECUTOR'
  | 'DELIVER_VERDICTS'
  | 'CORRECT'
  | 'REOPEN_CASE'

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
  const { appealBanner, appealModals } = useAppealCaseBanner()

  const [isLoading, setIsLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState<modal>()

  // Defendants whose indictment was cancelled or dismissed (completed for some)
  // do not get a verdict and therefore no service requirement
  const defendantsWithVerdict = workingCase.defendants?.filter(
    (defendant) => !defendant.indictmentCancelledOrDismissedState,
  )

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
    const requiresVerdictDeliveryToDefendants = defendantsWithVerdict?.some(
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
    defendantsWithVerdict,
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
      ? defendantsWithVerdict?.every((defendant) =>
          defendant.verdict?.serviceRequirement ===
          ServiceRequirement.NOT_APPLICABLE
            ? Boolean(defendant.verdict?.appealDecision)
            : Boolean(defendant.verdict?.serviceRequirement),
        )
      : true
    const isValidRuling =
      includeRulingText &&
      defendantsWithVerdict?.some(
        (defendant) =>
          defendant.verdict?.serviceRequirement === ServiceRequirement.REQUIRED,
      )
        ? workingCase.ruling
        : true

    return isValidDefendants && isValidRuling
  }

  const shouldDisplayAppealBanner =
    workingCase.indictmentRulingDecision ===
      CaseIndictmentRulingDecision.DISMISSAL &&
    (workingCase.hasBeenAppealed ||
      workingCase.appealCase?.appealState === AppealCaseState.COMPLETED ||
      workingCase.appealCase?.appealState === AppealCaseState.WITHDRAWN)

  return (
    <>
      {shouldDisplayAppealBanner && appealBanner}
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
          {defendantsWithVerdict?.map(
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
            <AppealRulingModifiedAlert />
            <RulingModifiedAlert />
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
            {workingCase.appealCase?.appealState ===
              AppealCaseState.COMPLETED &&
              workingCase.appealCase?.appealConclusion && (
                <Conclusion
                  title="Úrskurðarorð Landsréttar"
                  conclusionText={workingCase.appealCase?.appealConclusion}
                />
              )}
            <AllIndictmentCaseFiles />
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
                />
                <div className={grid({ gap: 4 })}>
                  {defendantsWithVerdict?.map((defendant) => {
                    const { verdict } = defendant
                    if (!verdict) return null

                    return (
                      <Box key={defendant.id} className={grid({ gap: 3 })}>
                        <DefendantServiceRequirement defendant={defendant} />
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
            actions={[
              ...(canReopenCase(workingCase, user)
                ? [
                    {
                      text: 'Enduropna mál',
                      onClick: () => setModalVisible('REOPEN_CASE'),
                      variant: 'ghost' as const,
                      colorScheme: 'destructive' as const,
                    },
                  ]
                : []),
              ...(workingCase.indictmentRulingDecision ===
              CaseIndictmentRulingDecision.WITHDRAWAL
                ? []
                : [
                    {
                      text: 'Leiðrétta mál',
                      onClick: () => setModalVisible('CORRECT'),
                    },
                  ]),
              ...(!isRulingOrFine || isSentToPublicProsecutor
                ? []
                : [
                    {
                      text: formatMessage(strings.sendToPublicProsecutor),
                      onClick: () =>
                        setModalVisible(
                          'CONFIRM_AND_SEND_TO_PUBLIC_PROSECUTOR',
                        ),
                      disabled: !stepIsValid(),
                      testId: 'continueButton',
                    },
                  ]),
            ]}
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
        {modalVisible === 'CORRECT' && (
          <ReopenModal onClose={() => setModalVisible(undefined)} />
        )}
        {modalVisible === 'REOPEN_CASE' && (
          <ReopenCaseModal
            workingCase={workingCase}
            onClose={() => setModalVisible(undefined)}
          />
        )}
        {appealModals}
      </PageLayout>
    </>
  )
}

export default Completed
