import { FC, useCallback, useContext, useState } from 'react'
import React from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import { Accordion, Box } from '@island.is/island-ui/core'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import {
  Feature,
  isRulingOrDismissalCase,
} from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  Conclusion,
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

import { ConfirmationInformation } from './ConfirmationInformation'
import { CriminalRecordUpdate } from './CriminalRecordUpdate'
import { DefendantServiceRequirement } from './DefendantServiceRequirement'
import { InformationForDefendant } from './InformationForDefendant'
import strings from './Completed.strings'

const Completed: FC = () => {
  const { user } = useContext(UserContext)
  const { features } = useContext(FeatureContext)

  const { formatMessage } = useIntl()
  const { deliverCaseVerdict } = useVerdict()
  const [isLoading, setIsLoading] = useState(false)

  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const { uploadFiles, addUploadFiles, updateUploadFile, removeUploadFile } =
    useUploadFiles(workingCase.caseFiles)
  const { handleUpload } = useS3Upload(workingCase.id)
  const { createEventLog } = useEventLog()

  const lawsBroken = useIndictmentsLawsBroken(workingCase)
  const [modalVisible, setModalVisible] =
    useState<'CONFIRM_AND_SEND_TO_PUBLIC_PROSECUTOR'>()

  const isSentToPublicProsecutor = Boolean(
    workingCase.indictmentSentToPublicProsecutorDate,
  )

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
    if (features?.includes(Feature.VERDICT_DELIVERY)) {
      const requiresVerdictDeliveryToDefendants = workingCase.defendants?.some(
        ({ verdict }) =>
          verdict?.serviceRequirement === ServiceRequirement.REQUIRED,
      )
      if (requiresVerdictDeliveryToDefendants) {
        const results = await deliverCaseVerdict(workingCase.id)
        if (!results) {
          setIsLoading(false)
          return
        }
      }
    }

    const eventLogCreated = createEventLog({
      caseId: workingCase.id,
      eventType: EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
    })
    if (!eventLogCreated) {
      setIsLoading(false)
      return
    }
    router.push(getStandardUserDashboardRoute(user))
    setIsLoading(false)
  }, [
    deliverCaseVerdict,
    handleUpload,
    uploadFiles,
    updateUploadFile,
    createEventLog,
    workingCase.id,
    workingCase.defendants,
    user,
    setIsLoading,
    features,
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

  const stepIsValid = () => {
    const isValidDefendants = isRuling
      ? workingCase.defendants?.every((defendant) =>
          defendant.verdict?.serviceRequirement ===
          ServiceRequirement.NOT_APPLICABLE
            ? Boolean(defendant.verdict?.appealDecision)
            : Boolean(defendant.verdict?.serviceRequirement),
        )
      : true

    return isValidDefendants
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
        {workingCase.defendants?.map(
          (defendant) =>
            features?.includes(Feature.VERDICT_DELIVERY) &&
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
        <Box marginBottom={5} component="section">
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
            <CriminalRecordUpdate
              uploadFiles={uploadFiles}
              addUploadFiles={addUploadFiles}
              updateUploadFile={updateUploadFile}
              removeUploadFile={removeUploadFile}
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

              const isLastDefendantElement =
                workingCase.defendants &&
                workingCase.defendants.length - 1 === index
              return (
                <Box
                  marginBottom={isLastDefendantElement ? 0 : 4}
                  key={defendant.id}
                >
                  <React.Fragment key={defendant.id}>
                    <DefendantServiceRequirement
                      defendant={defendant}
                      defendantIndex={index}
                    />
                    {features?.includes(Feature.VERDICT_DELIVERY) &&
                      verdict.serviceRequirement ===
                        ServiceRequirement.REQUIRED && (
                        <InformationForDefendant defendant={defendant} />
                      )}
                  </React.Fragment>
                </Box>
              )
            })}
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
            onClick: () => handleCaseConfirmation(),
          }}
          secondaryButton={{
            text: 'Hætta við',
            onClick: () => setModalVisible(undefined),
          }}
        />
      )}
    </PageLayout>
  )
}

export default Completed
