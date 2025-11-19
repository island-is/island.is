import { FC, ReactNode, useCallback, useContext, useState } from 'react'
import { IntlShape, useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'motion/react'
import { useRouter } from 'next/router'

import {
  Accordion,
  AlertMessage,
  Box,
  Button,
  Text,
  toast,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import {
  isDistrictCourtUser,
  isInvestigationCase,
  isPrisonAdminUser,
  isPrisonSystemUser,
  isProsecutionUser,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import {
  core,
  errors,
  signedVerdictOverview as m,
  titles,
} from '@island.is/judicial-system-web/messages'
import {
  AlertBanner,
  AppealCaseFilesOverview,
  CaseDates,
  CaseFilesAccordionItem,
  CaseTitleInfoAndTags,
  CommentsAccordionItem,
  Conclusion,
  conclusion,
  CourtRecordAccordionItem,
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCard,
  MarkdownWrapper,
  Modal,
  PageHeader,
  PageLayout,
  PoliceRequestAccordionItem,
  ReopenModal,
  RulingAccordionItem,
  SigningModal,
  UserContext,
  useRequestRulingSignature,
} from '@island.is/judicial-system-web/src/components'
import useInfoCardItems from '@island.is/judicial-system-web/src/components/InfoCard/useInfoCardItems'
import {
  Case,
  CaseAppealState,
  CaseDecision,
  CaseState,
  CaseTransition,
  Institution,
  RequestSignatureResponse,
  SignatureConfirmationResponse,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  UpdateCase,
  useAppealAlertBanner,
  useCase,
} from '@island.is/judicial-system-web/src/utils/hooks'

import CaseDocuments from './Components/CaseDocuments/CaseDocuments'
import ModifyDatesModal from './Components/ModifyDatesModal/ModifyDatesModal'
import ShareCase, { InstitutionOption } from './Components/ShareCase/ShareCase'
import { useCourtRecordSignatureConfirmationLazyQuery } from './courtRecordSignatureConfirmation.generated'
import { useRequestCourtRecordSignatureMutation } from './requestCourtRecordSignature.generated'
import { strings } from './SignedVerdictOverview.strings'

interface ModalControls {
  open: boolean
  title: string
  text: ReactNode
}

export const shouldHideNextButton = (workingCase: Case, user?: User) => {
  // Hide the next button if there is no user
  if (!user) {
    return true
  }

  const shouldShowExtendCaseButton =
    isProsecutionUser(user) && // the user is a prosecutor
    workingCase.state !== CaseState.REJECTED && // the case is not rejected
    workingCase.state !== CaseState.DISMISSED && // the case is not dismissed
    workingCase.decision !== CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN && // the case is not a custody case accepted as alternative travel ban
    !workingCase.isValidToDateInThePast && // the case is not a restriction case with a valid to date in the past
    !workingCase.childCase // the case has not already been extended

  const shouldShowReopenCaseButton =
    user.id === workingCase.judge?.id || // the user is the assigned judge ||
    user.id === workingCase.registrar?.id // the user is the assigned registrar

  return !shouldShowExtendCaseButton && !shouldShowReopenCaseButton
}

const getNextButtonText = (
  formatMessage: IntlShape['formatMessage'],
  workingCase: Case,
  user?: User,
) =>
  isProsecutionUser(user)
    ? formatMessage(m.sections.caseExtension.buttonLabel, {
        caseType: workingCase.type,
      })
    : 'Leiðrétta þingbók eða úrskurð'

export const getExtensionInfoText = (
  formatMessage: IntlShape['formatMessage'],
  workingCase: Case,
  user?: User,
): string | undefined => {
  if (!isProsecutionUser(user)) {
    // Only prosecutors should see the explanation.
    return undefined
  }

  let rejectReason:
    | 'rejected'
    | 'dismissed'
    | 'isValidToDateInThePast'
    | 'acceptingAlternativeTravelBan'
    | 'hasChildCase'
    | 'none' = 'none'

  if (workingCase.state === CaseState.REJECTED) {
    rejectReason = 'rejected'
  } else if (workingCase.state === CaseState.DISMISSED) {
    rejectReason = 'dismissed'
  } else if (
    workingCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
  ) {
    rejectReason = 'acceptingAlternativeTravelBan'
  } else if (workingCase.childCase) {
    rejectReason = 'hasChildCase'
  } else if (workingCase.isValidToDateInThePast) {
    // This must be after the rejected and alternatice decision cases as the custody
    // end date only applies to cases that were accepted by the judge. This must also
    // be after the already extended case as the custody end date may expire after
    // the case has been extended.
    rejectReason = 'isValidToDateInThePast'
  }

  return rejectReason === 'none'
    ? undefined
    : formatMessage(m.sections.caseExtension.extensionInfo, {
        hasChildCase: Boolean(workingCase.childCase),
        caseType: workingCase.type,
        rejectReason,
      })
}

type availableModals =
  | 'NoModal'
  | 'SigningModal'
  | 'ConfirmAppealAfterDeadline'
  | 'ConfirmStatementAfterDeadline'
  | 'AppealReceived'

export const SignedVerdictOverview: FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    refreshCase,
  } = useContext(FormContext)
  const {
    defendants,
    policeCaseNumbers,
    courtCaseNumber,
    prosecutor,
    prosecutorsOffice,
    court,
    judge,
    caseType,
    registrar,
    appealCaseNumber,
    appealAssistant,
    appealJudges,
    victims,
    showItem,
  } = useInfoCardItems()

  const [isModifyingDates, setIsModifyingDates] = useState<boolean>(false)
  const [shareCaseModal, setSharedCaseModal] = useState<ModalControls>()
  const [isReopeningCase, setIsReopeningCase] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState<availableModals>('NoModal')

  const [
    selectedSharingInstitutionOption,
    setSelectedSharingInstitutionOption,
  ] = useState<InstitutionOption>(null)

  const [
    requestCourtRecordSignatureResponse,
    setRequestCourtRecordSignatureResponse,
  ] = useState<RequestSignatureResponse>()

  const [
    courtRecordSignatureConfirmationResponse,
    setCourtRecordSignatureConfirmationResponse,
  ] = useState<SignatureConfirmationResponse>()

  const {
    requestRulingSignature,
    requestRulingSignatureResponse,
    isRequestingRulingSignature,
  } = useRequestRulingSignature(workingCase.id, () =>
    setModalVisible('SigningModal'),
  )
  const { user } = useContext(UserContext)
  const router = useRouter()
  const { formatMessage } = useIntl()
  const {
    updateCase,
    isUpdatingCase,
    extendCase,
    isExtendingCase,
    isSendingNotification,
    transitionCase,
  } = useCase()
  const { title, description, child, isLoadingAppealBanner } =
    useAppealAlertBanner(
      workingCase,
      () => setModalVisible('ConfirmAppealAfterDeadline'),
      () => setModalVisible('ConfirmStatementAfterDeadline'),
      () => handleReceivedTransition(workingCase),
    )

  /**
   * If the case is not rejected it must be accepted because
   * this screen is only rendered if the case is either accepted
   * or rejected. Here we are first handling the case where a case
   * is rejected, then the case where a case is accepted and the
   * custody end date is in the past and then we assume that
   * the case is accepted and the custody end date has not come yet.
   * For accepted cases, we first handle the case where the judge
   * decided only accept an alternative travel ban and finally we
   * assume that the actual custody was accepted.
   */
  const canModifyCaseDates = useCallback(() => {
    return (
      (isProsecutionUser(user) ||
        isDistrictCourtUser(user) ||
        isPrisonAdminUser(user)) &&
      isRestrictionCase(workingCase.type)
    )
  }, [workingCase.type, user])

  const [getCourtRecordSignatureConfirmation] =
    useCourtRecordSignatureConfirmationLazyQuery({
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
      onCompleted: (courtRecordSignatureConfirmationData) => {
        if (
          courtRecordSignatureConfirmationData?.courtRecordSignatureConfirmation
        ) {
          setCourtRecordSignatureConfirmationResponse(
            courtRecordSignatureConfirmationData.courtRecordSignatureConfirmation as SignatureConfirmationResponse,
          )
          refreshCase()
        } else {
          setCourtRecordSignatureConfirmationResponse({ documentSigned: false })
        }
      },
      onError: () => {
        setCourtRecordSignatureConfirmationResponse({ documentSigned: false })
      },
    })

  const [
    handleRequestCourtRecordSignature,
    { loading: isRequestingCourtRecordSignature },
  ] = useRequestCourtRecordSignatureMutation({
    variables: { input: { caseId: workingCase.id } },
    onCompleted: (data) => {
      setRequestCourtRecordSignatureResponse(
        data.requestCourtRecordSignature as RequestSignatureResponse,
      )
      getCourtRecordSignatureConfirmation({
        variables: {
          input: {
            caseId: workingCase.id,
            documentToken:
              data.requestCourtRecordSignature?.documentToken || '',
          },
        },
      })
      return data.requestCourtRecordSignature
    },
    onError: () => {
      toast.error(formatMessage(errors.requestCourtRecordSignature))
    },
  })

  const handleNextButtonClick = async () => {
    if (isProsecutionUser(user)) {
      if (workingCase.childCase) {
        if (isRestrictionCase(workingCase.type)) {
          router.push(
            `${constants.RESTRICTION_CASE_DEFENDANT_ROUTE}/${workingCase.childCase.id}`,
          )
        } else {
          router.push(
            `${constants.INVESTIGATION_CASE_DEFENDANT_ROUTE}/${workingCase.childCase.id}`,
          )
        }
      } else {
        await extendCase(workingCase.id).then((extendedCase) => {
          if (extendedCase) {
            if (isRestrictionCase(extendedCase.type)) {
              router.push(
                `${constants.RESTRICTION_CASE_DEFENDANT_ROUTE}/${extendedCase.id}`,
              )
            } else {
              router.push(
                `${constants.INVESTIGATION_CASE_DEFENDANT_ROUTE}/${extendedCase.id}`,
              )
            }
          }
        })
      }
    } else {
      setIsReopeningCase(true)
    }
  }

  const handleReceivedTransition = (workingCase: Case) => {
    transitionCase(
      workingCase.id,
      CaseTransition.RECEIVE_APPEAL,
      setWorkingCase,
    ).then((updatedCase) => {
      if (updatedCase) {
        setModalVisible('AppealReceived')
      }
    })
  }

  const shareCaseWithAnotherInstitution = (institution?: Institution) => {
    if (workingCase) {
      if (workingCase.sharedWithProsecutorsOffice) {
        setSharedCaseModal({
          open: true,
          title: formatMessage(m.sections.shareCaseModal.closeTitle, {
            courtCaseNumber: workingCase.courtCaseNumber,
          }),
          text: (
            <MarkdownWrapper
              markdown={formatMessage(m.sections.shareCaseModal.closeText, {
                prosecutorsOffice: workingCase.sharedWithProsecutorsOffice.name,
              })}
            />
          ),
        })

        setWorkingCase((prevWorkingCase) => ({
          ...prevWorkingCase,
          sharedWithProsecutorsOffice: undefined,
        }))
        setSelectedSharingInstitutionOption(null)

        updateCase(workingCase.id, {
          sharedWithProsecutorsOfficeId: null,
        })
      } else {
        setSharedCaseModal({
          open: true,
          title: formatMessage(m.sections.shareCaseModal.openTitle, {
            courtCaseNumber: workingCase.courtCaseNumber,
          }),
          text: (
            <MarkdownWrapper
              markdown={formatMessage(m.sections.shareCaseModal.openText, {
                prosecutorsOffice: institution?.name,
              })}
            />
          ),
        })

        setWorkingCase((prevWorkingCase) => ({
          ...prevWorkingCase,
          sharedWithProsecutorsOffice: institution,
          isHeightenedSecurityLevel: prevWorkingCase.isHeightenedSecurityLevel
            ? false
            : prevWorkingCase.isHeightenedSecurityLevel,
        }))

        updateCase(workingCase.id, {
          sharedWithProsecutorsOfficeId: institution?.id,
          isHeightenedSecurityLevel: workingCase.isHeightenedSecurityLevel
            ? false
            : workingCase.isHeightenedSecurityLevel,
        })
      }
    }
  }

  const onModifyDatesSubmit = async (update: UpdateCase) => {
    const updatedCase = await updateCase(workingCase.id, { ...update })

    if (!updatedCase) {
      return false
    }

    setWorkingCase((prevWorkingCase) => ({ ...prevWorkingCase, ...update }))

    return true
  }

  const shouldDisplayAlertBanner =
    (workingCase.hasBeenAppealed &&
      (isProsecutionUser(user) || isDistrictCourtUser(user))) ||
    (isProsecutionUser(user) && workingCase.canProsecutorAppeal) ||
    workingCase.appealState === CaseAppealState.COMPLETED

  return (
    <>
      {!isLoadingAppealBanner && shouldDisplayAlertBanner && (
        <AlertBanner variant="warning" title={title} description={description}>
          {child}
        </AlertBanner>
      )}
      <PageLayout
        workingCase={workingCase}
        isLoading={isLoadingWorkingCase}
        notFound={caseNotFound}
      >
        <PageHeader
          title={formatMessage(titles.shared.closedCaseOverview, {
            courtCaseNumber: workingCase.courtCaseNumber,
          })}
        />
        <FormContentContainer>
          <Box marginBottom={5}>
            <Box marginBottom={3}>
              <Button
                variant="text"
                preTextIcon="arrowBack"
                onClick={() => router.push(getStandardUserDashboardRoute(user))}
              >
                {formatMessage(core.back)}
              </Button>
            </Box>
            <CaseTitleInfoAndTags />
            {isRestrictionCase(workingCase.type) &&
              workingCase.decision !==
                CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN &&
              workingCase.state === CaseState.ACCEPTED && (
                <CaseDates
                  workingCase={workingCase}
                  button={
                    canModifyCaseDates()
                      ? {
                          label: formatMessage(core.update),
                          onClick: () => setIsModifyingDates((value) => !value),
                          icon: 'pencil',
                        }
                      : undefined
                  }
                />
              )}
            {workingCase.appealRulingModifiedHistory && (
              <Box marginBottom={5} marginTop={5}>
                <AlertMessage
                  type="info"
                  title={formatMessage(strings.rulingModifiedTitle)}
                  message={
                    <MarkdownWrapper
                      markdown={workingCase.appealRulingModifiedHistory}
                      textProps={{ variant: 'small' }}
                    />
                  }
                />
              </Box>
            )}
          </Box>
          {workingCase.caseModifiedExplanation && (
            <Box marginBottom={5}>
              <AlertMessage
                type="info"
                title={formatMessage(m.sections.modifyDatesInfo.title, {
                  caseType: workingCase.type,
                })}
                message={
                  <MarkdownWrapper
                    markdown={workingCase.caseModifiedExplanation}
                    textProps={{ variant: 'small' }}
                  />
                }
              />
            </Box>
          )}
          {workingCase.rulingModifiedHistory && (
            <Box marginBottom={5}>
              <AlertMessage
                type="info"
                title={formatMessage(m.sections.modifyRulingInfo.title)}
                message={
                  <MarkdownWrapper
                    markdown={workingCase.rulingModifiedHistory}
                    textProps={{ variant: 'small' }}
                  />
                }
              />
            </Box>
          )}
          <Box marginBottom={6}>
            <InfoCard
              sections={[
                {
                  id: 'defendants-section',
                  items: [defendants(workingCase.type)],
                },
                ...(showItem(victims)
                  ? [
                      {
                        id: 'victims-section',
                        items: [victims],
                      },
                    ]
                  : []),
                {
                  id: 'case-info-section',
                  items: [
                    policeCaseNumbers,
                    courtCaseNumber,
                    prosecutorsOffice,
                    court,
                    prosecutor(workingCase.type),
                    judge,
                    ...(isInvestigationCase(workingCase.type)
                      ? [caseType]
                      : []),
                    ...(workingCase.registrar ? [registrar] : []),
                  ],
                  columns: 2,
                },
                ...(workingCase.appealCaseNumber
                  ? [
                      {
                        id: 'court-of-appeal-section',
                        items: [
                          appealCaseNumber,
                          ...(appealAssistant ? [appealAssistant] : []),
                          ...(workingCase.appealJudge1 &&
                          workingCase.appealJudge2 &&
                          workingCase.appealJudge3
                            ? [appealJudges]
                            : []),
                        ],
                        columns: 2,
                      },
                    ]
                  : []),
              ]}
            />
          </Box>
          {!isPrisonSystemUser(user) && (
            <Box marginBottom={5} data-testid="accordionItems">
              <Accordion>
                <PoliceRequestAccordionItem workingCase={workingCase} />
                <CourtRecordAccordionItem workingCase={workingCase} />
                <RulingAccordionItem workingCase={workingCase} />
                {user && (
                  <CaseFilesAccordionItem
                    workingCase={workingCase}
                    setWorkingCase={setWorkingCase}
                    user={user}
                  />
                )}
                {(workingCase.comments ||
                  workingCase.caseFilesComments ||
                  workingCase.caseResentExplanation) && (
                  <CommentsAccordionItem workingCase={workingCase} />
                )}
              </Accordion>
            </Box>
          )}
          <Box marginBottom={6}>
            <Conclusion
              title={formatMessage(conclusion.title)}
              conclusionText={workingCase.conclusion}
              judgeName={workingCase.judge?.name}
            />
          </Box>
          {workingCase.appealState === CaseAppealState.COMPLETED &&
            workingCase.appealConclusion && (
              <Box marginBottom={6}>
                <Conclusion
                  title={formatMessage(conclusion.appealTitle)}
                  conclusionText={workingCase.appealConclusion}
                />
              </Box>
            )}
          <Box marginBottom={5}>
            <AppealCaseFilesOverview />
          </Box>
          <CaseDocuments
            isRequestingCourtRecordSignature={isRequestingCourtRecordSignature}
            handleRequestCourtRecordSignature={
              handleRequestCourtRecordSignature
            }
            isRequestingRulingSignature={isRequestingRulingSignature}
            requestRulingSignature={requestRulingSignature}
          />

          {isProsecutionUser(user) &&
            user?.institution?.id === workingCase.prosecutorsOffice?.id &&
            isRestrictionCase(workingCase.type) && (
              <ShareCase
                selectedSharingInstitutionOption={
                  selectedSharingInstitutionOption
                }
                setSelectedSharingInstitutionOption={
                  setSelectedSharingInstitutionOption
                }
                shareCaseWithAnotherInstitution={
                  shareCaseWithAnotherInstitution
                }
              />
            )}
        </FormContentContainer>
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={getStandardUserDashboardRoute(user)}
            hideNextButton={shouldHideNextButton(workingCase, user)}
            nextButtonText={getNextButtonText(formatMessage, workingCase, user)}
            onNextButtonClick={() => handleNextButtonClick()}
            nextIsLoading={isExtendingCase}
            infoBoxText={getExtensionInfoText(formatMessage, workingCase, user)}
          />
        </FormContentContainer>
        {shareCaseModal?.open && (
          <Modal
            title={shareCaseModal.title}
            text={shareCaseModal.text}
            primaryButton={{
              text: formatMessage(core.closeModal),
              onClick: () => setSharedCaseModal(undefined),
            }}
          />
        )}
        <AnimatePresence>
          {isModifyingDates && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="modify-dates-modal"
            >
              <ModifyDatesModal
                workingCase={workingCase}
                onSubmit={onModifyDatesSubmit}
                isSendingNotification={isSendingNotification}
                isUpdatingCase={isUpdatingCase}
                closeModal={() => setIsModifyingDates(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {requestCourtRecordSignatureResponse && (
          <Modal
            title={
              !courtRecordSignatureConfirmationResponse
                ? formatMessage(
                    m.sections.courtRecordSignatureModal.titleSigning,
                  )
                : courtRecordSignatureConfirmationResponse.documentSigned
                ? formatMessage(
                    m.sections.courtRecordSignatureModal.titleSuccess,
                  )
                : courtRecordSignatureConfirmationResponse.code === 7023 // User cancelled
                ? formatMessage(
                    m.sections.courtRecordSignatureModal.titleCanceled,
                  )
                : formatMessage(
                    m.sections.courtRecordSignatureModal.titleFailure,
                  )
            }
            text={
              !courtRecordSignatureConfirmationResponse ? (
                <>
                  <Box marginBottom={2}>
                    <Text variant="h2" color="blue400">
                      {formatMessage(
                        m.sections.courtRecordSignatureModal.controlCode,
                        {
                          controlCode:
                            requestCourtRecordSignatureResponse?.controlCode,
                        },
                      )}
                    </Text>
                  </Box>
                  <Text>
                    {formatMessage(
                      m.sections.courtRecordSignatureModal
                        .controlCodeDisclaimer,
                    )}
                  </Text>
                </>
              ) : courtRecordSignatureConfirmationResponse.documentSigned ? (
                formatMessage(m.sections.courtRecordSignatureModal.completed)
              ) : (
                formatMessage(m.sections.courtRecordSignatureModal.notCompleted)
              )
            }
            primaryButton={{
              text: courtRecordSignatureConfirmationResponse
                ? formatMessage(core.closeModal)
                : '',
              onClick: () => {
                setRequestCourtRecordSignatureResponse(undefined)
                setCourtRecordSignatureConfirmationResponse(undefined)
              },
            }}
          />
        )}
        {modalVisible === 'SigningModal' && (
          <SigningModal
            workingCase={workingCase}
            requestRulingSignature={requestRulingSignature}
            requestRulingSignatureResponse={requestRulingSignatureResponse}
            onClose={() => {
              refreshCase()
              setModalVisible('NoModal')
            }}
            navigateOnClose={false}
          />
        )}
        {isReopeningCase && (
          <ReopenModal onClose={() => setIsReopeningCase(false)} />
        )}
        {modalVisible === 'ConfirmAppealAfterDeadline' && (
          <Modal
            title={formatMessage(
              m.sections.confirmAppealAfterDeadlineModal.title,
            )}
            text={formatMessage(
              m.sections.confirmAppealAfterDeadlineModal.text,
            )}
            primaryButton={{
              text: formatMessage(
                m.sections.confirmAppealAfterDeadlineModal.primaryButtonText,
              ),
              onClick: () =>
                router.push(`${constants.APPEAL_ROUTE}/${workingCase.id}`),
            }}
            secondaryButton={{
              text: formatMessage(
                m.sections.confirmAppealAfterDeadlineModal.secondaryButtonText,
              ),
              onClick: () => setModalVisible('NoModal'),
            }}
          />
        )}
        {modalVisible === 'ConfirmStatementAfterDeadline' && (
          <Modal
            title={formatMessage(
              strings.confirmStatementAfterDeadlineModalTitle,
            )}
            text={formatMessage(strings.confirmStatementAfterDeadlineModalText)}
            primaryButton={{
              text: formatMessage(
                strings.confirmStatementAfterDeadlineModalPrimaryButtonText,
              ),
              onClick: () =>
                router.push(`${constants.STATEMENT_ROUTE}/${workingCase.id}`),
            }}
            secondaryButton={{
              text: formatMessage(
                strings.confirmStatementAfterDeadlineModalSecondaryButtonText,
              ),
              onClick: () => setModalVisible('NoModal'),
            }}
          />
        )}
        {modalVisible === 'AppealReceived' && (
          <Modal
            title={formatMessage(m.sections.appealReceived.title)}
            text={formatMessage(m.sections.appealReceived.text)}
            primaryButton={{
              text: formatMessage(m.sections.appealReceived.primaryButtonText),
              onClick: () => setModalVisible('NoModal'),
            }}
          />
        )}
      </PageLayout>
    </>
  )
}

export default SignedVerdictOverview
