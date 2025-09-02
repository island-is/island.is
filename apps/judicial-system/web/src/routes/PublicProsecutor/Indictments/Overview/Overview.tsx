import { Fragment, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Button, Option, Text } from '@island.is/island-ui/core'
import {
  getStandardUserDashboardRoute,
  PUBLIC_PROSECUTOR_STAFF_INDICTMENT_SEND_TO_PRISON_ADMIN_ROUTE,
} from '@island.is/judicial-system/consts'
import { Feature } from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  BlueBoxWithDate,
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
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import VerdictAppealDecisionChoice from '@island.is/judicial-system-web/src/components/VerdictAppealDecisionChoice/VerdictAppealDecisionChoice'
import VerdictStatusAlert from '@island.is/judicial-system-web/src/components/VerdictStatusAlert/VerdictStatusAlert'
import {
  CaseIndictmentRulingDecision,
  Defendant,
  IndictmentCaseReviewDecision,
  ServiceRequirement,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useDefendants,
} from '@island.is/judicial-system-web/src/utils/hooks'
import useVerdict from '@island.is/judicial-system-web/src/utils/hooks/useVerdict'

import { ReviewDecision } from '../../components/ReviewDecision/ReviewDecision'
import {
  CONFIRM_PROSECUTOR_DECISION,
  ConfirmationModal,
  isReviewerAssignedModal,
  REVIEWER_ASSIGNED,
} from '../../components/utils'
import { IndictmentReviewerSelector } from './IndictmentReviewerSelector'
import { strings } from './Overview.strings'
import * as styles from './Overview.css'

type VisibleModal = {
  type: 'REVOKE_SEND_TO_PRISON_ADMIN'
  defendant: Defendant
}

export const Overview = () => {
  const { user } = useContext(UserContext)
  const router = useRouter()
  const { formatMessage: fm } = useIntl()
  const { updateCase, setAndSendCaseToServer } = useCase()
  const { setAndSendDefendantToServer, isUpdatingDefendant } = useDefendants()
  const { setAndSendVerdictToServer } = useVerdict()
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { features } = useContext(FeatureContext)

  const [selectedIndictmentReviewer, setSelectedIndictmentReviewer] =
    useState<Option<string> | null>()
  const [isReviewedDecisionChanged, setIsReviewedDecisionChanged] =
    useState<boolean>(false)

  const [confirmationModal, setConfirmationModal] = useState<
    ConfirmationModal | undefined
  >()
  const [modalVisible, setModalVisible] = useState<VisibleModal>()

  // const lawsBroken = useIndictmentsLawsBroken(workingCase) NOTE: Temporarily hidden while list of laws broken is not complete

  const assignReviewer = async () => {
    if (!selectedIndictmentReviewer) {
      return
    }
    const updatedCase = await updateCase(workingCase.id, {
      indictmentReviewerId: selectedIndictmentReviewer.value,
    })
    if (!updatedCase) {
      return
    }

    setConfirmationModal(REVIEWER_ASSIGNED)
  }

  const handleSendToPrisonAdmin = (defendant: Defendant) => {
    router.push(
      `${PUBLIC_PROSECUTOR_STAFF_INDICTMENT_SEND_TO_PRISON_ADMIN_ROUTE}/${workingCase.id}/${defendant.id}`,
    )
  }

  const handleRevokeAppeal = (defendant: Defendant) => {
    setAndSendVerdictToServer(
      {
        caseId: workingCase.id,
        defendantId: defendant.id,
        appealDate: null,
      },
      setWorkingCase,
    )
  }

  const handleRevokeSendToPrisonAdmin = (defendant: Defendant) => {
    setAndSendDefendantToServer(
      {
        caseId: workingCase.id,
        defendantId: defendant.id,
        isSentToPrisonAdmin: false,
      },
      setWorkingCase,
    )

    setModalVisible(undefined)
  }

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [router, workingCase.id],
  )

  const onSelect = (decision?: IndictmentCaseReviewDecision) => {
    if (!decision) {
      return
    }

    const isDecisionChanged = decision !== workingCase.indictmentReviewDecision
    setIsReviewedDecisionChanged(isDecisionChanged)
  }

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={true}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={fm(titles.shared.closedCaseOverview, {
          courtCaseNumber: workingCase.courtCaseNumber,
        })}
      />
      <FormContentContainer>
        <PageTitle>{fm(strings.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        {workingCase.defendants?.map((defendant) => {
          const { verdict } = defendant

          if (!verdict) {
            return null
          }

          const isFine =
            workingCase.indictmentRulingDecision ===
            CaseIndictmentRulingDecision.FINE

          const isServiceRequired =
            verdict.serviceRequirement === ServiceRequirement.REQUIRED

          const isServiceNotApplicable =
            verdict.serviceRequirement === ServiceRequirement.NOT_APPLICABLE

          return (
            <Fragment key={defendant.id}>
              <Box className={styles.container}>
                {features?.includes(Feature.PUBLIC_PROSECUTOR_VERDICT) && (
                  <VerdictStatusAlert verdict={verdict} defendant={defendant} />
                )}
                <Box component="section">
                  <BlueBoxWithDate defendant={defendant} icon="calendar" />
                </Box>
                {verdict &&
                  (isServiceNotApplicable ||
                    (isServiceRequired && verdict.serviceDate)) && (
                    <Box component="section">
                      <BlueBox>
                        <SectionHeading
                          title="Afstaða dómfellda til dóms"
                          heading="h4"
                          marginBottom={2}
                          required
                        />
                        <Box marginBottom={2}>
                          <Text variant="eyebrow">{defendant.name}</Text>
                        </Box>
                        <VerdictAppealDecisionChoice
                          defendant={defendant}
                          verdict={verdict}
                          disabled={!!defendant.isSentToPrisonAdmin}
                        />
                      </BlueBox>
                    </Box>
                  )}
              </Box>
              <Box
                display="flex"
                justifyContent="flexEnd"
                marginBottom={5}
                marginTop={1}
                columnGap={2}
              >
                <Button
                  size="small"
                  onClick={() =>
                    setAndSendCaseToServer(
                      [
                        {
                          publicProsecutorIsRegisteredInPoliceSystem:
                            !workingCase.publicProsecutorIsRegisteredInPoliceSystem,
                          force: true,
                        },
                      ],
                      workingCase,
                      setWorkingCase,
                    )
                  }
                  variant="text"
                  colorScheme={
                    workingCase.publicProsecutorIsRegisteredInPoliceSystem
                      ? 'destructive'
                      : 'default'
                  }
                >
                  {workingCase.publicProsecutorIsRegisteredInPoliceSystem
                    ? 'Afskrá í LÖKE'
                    : 'Skráð í LÖKE'}
                </Button>
                {verdict?.appealDate ? (
                  <Button
                    variant="text"
                    onClick={() => handleRevokeAppeal(defendant)}
                    size="small"
                    colorScheme="destructive"
                  >
                    Afturkalla áfrýjun
                  </Button>
                ) : defendant.isSentToPrisonAdmin ? (
                  <Button
                    variant="text"
                    onClick={() =>
                      setModalVisible({
                        type: 'REVOKE_SEND_TO_PRISON_ADMIN',
                        defendant,
                      })
                    }
                    size="small"
                    colorScheme="destructive"
                  >
                    Afturkalla úr fullnustu
                  </Button>
                ) : (
                  <Button
                    variant="text"
                    onClick={() => handleSendToPrisonAdmin(defendant)}
                    size="small"
                    disabled={
                      !workingCase.indictmentReviewDecision ||
                      (!isFine && !verdict?.serviceDate && isServiceRequired)
                    }
                  >
                    Senda til fullnustu
                  </Button>
                )}
              </Box>
            </Fragment>
          )
        })}
        <Box component="section" marginBottom={5}>
          <InfoCardClosedIndictment displaySentToPrisonAdminDate={false} />
        </Box>
        {/* 
        NOTE: Temporarily hidden while list of laws broken is not complete in
        indictment cases
        
        {lawsBroken.size > 0 && (
          <Box marginBottom={5}>
            <IndictmentsLawsBrokenAccordionItem workingCase={workingCase} />
          </Box>
        )} */}
        <Box component="section" marginBottom={5}>
          <IndictmentCaseFilesList workingCase={workingCase} />
        </Box>
        <Box component="section" marginBottom={10}>
          {!workingCase.indictmentReviewDecision ? (
            <IndictmentReviewerSelector
              workingCase={workingCase}
              selectedIndictmentReviewer={selectedIndictmentReviewer}
              setSelectedIndictmentReviewer={setSelectedIndictmentReviewer}
            />
          ) : (
            <ReviewDecision
              caseId={workingCase.id}
              currentDecision={workingCase.indictmentReviewDecision}
              indictmentAppealDeadline={
                workingCase.indictmentAppealDeadline ?? ''
              }
              indictmentAppealDeadlineIsInThePast={
                workingCase.indictmentVerdictAppealDeadlineExpired ?? false
              }
              modalVisible={confirmationModal}
              setModalVisible={setConfirmationModal}
              isFine={
                workingCase.indictmentRulingDecision ===
                CaseIndictmentRulingDecision.FINE
              }
              onSelect={onSelect}
            />
          )}
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        {!workingCase.indictmentReviewDecision ? (
          <FormFooter
            nextButtonIcon="arrowForward"
            previousUrl={getStandardUserDashboardRoute(user)}
            nextIsLoading={isLoadingWorkingCase}
            nextIsDisabled={
              !selectedIndictmentReviewer ||
              selectedIndictmentReviewer.value ===
                workingCase.indictmentReviewer?.id ||
              isLoadingWorkingCase
            }
            onNextButtonClick={assignReviewer}
            nextButtonText={fm(core.continue)}
          />
        ) : (
          <FormFooter
            previousUrl={getStandardUserDashboardRoute(user)}
            nextIsLoading={isLoadingWorkingCase}
            nextIsDisabled={!isReviewedDecisionChanged}
            onNextButtonClick={() =>
              setConfirmationModal(CONFIRM_PROSECUTOR_DECISION)
            }
            nextButtonText={fm(strings.changeReviewedDecisionButtonText)}
          />
        )}
      </FormContentContainer>
      {isReviewerAssignedModal(confirmationModal) && (
        <Modal
          title={fm(strings.reviewerAssignedModalTitle)}
          text={fm(strings.reviewerAssignedModalText, {
            caseNumber: workingCase.courtCaseNumber,
            reviewer: selectedIndictmentReviewer?.label,
          })}
          secondaryButtonText={fm(core.back)}
          onSecondaryButtonClick={() =>
            router.push(getStandardUserDashboardRoute(user))
          }
        />
      )}
      {modalVisible?.type === 'REVOKE_SEND_TO_PRISON_ADMIN' && (
        <Modal
          title="Afturkalla úr fullnustu"
          text={`Mál ${workingCase.courtCaseNumber} verður afturkallað.\nÁkærði: ${modalVisible.defendant.name}.`}
          onPrimaryButtonClick={() =>
            handleRevokeSendToPrisonAdmin(modalVisible.defendant)
          }
          primaryButtonText="Afturkalla"
          isPrimaryButtonLoading={isUpdatingDefendant}
          secondaryButtonText={fm(core.cancel)}
          onSecondaryButtonClick={() => setModalVisible(undefined)}
        />
      )}
    </PageLayout>
  )
}

export default Overview
