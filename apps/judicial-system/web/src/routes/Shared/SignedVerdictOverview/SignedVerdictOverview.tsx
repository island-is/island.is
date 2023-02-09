import React, { ReactNode, useCallback, useContext, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { ValueType } from 'react-select/src/types'
import { IntlShape, useIntl } from 'react-intl'
import formatISO from 'date-fns/formatISO'

import {
  CaseDecision,
  CaseState,
  isInvestigationCase,
  isRestrictionCase,
  RequestSignatureResponse,
  SignatureConfirmationResponse,
  CaseAppealDecision,
  isAcceptingCaseDecision,
  isCourtRole,
} from '@island.is/judicial-system/types'
import {
  FormFooter,
  PageLayout,
  Modal,
  BlueBox,
  InfoCard,
  PdfButton,
  CourtRecordAccordionItem,
  FormContentContainer,
  PoliceRequestAccordionItem,
  RulingAccordionItem,
  CommentsAccordionItem,
  CaseFilesAccordionItem,
  CaseDates,
  FormContext,
  MarkdownWrapper,
  RestrictionTags,
  SignedDocument,
  useRequestRulingSignature,
  SigningModal,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  useCase,
  useInstitution,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  ReactSelectOption,
  Sections,
  TempCase as Case,
  TempUpdateCase as UpdateCase,
} from '@island.is/judicial-system-web/src/types'
import {
  Box,
  Text,
  Accordion,
  Button,
  Select,
  Tooltip,
  Stack,
  Divider,
  AlertMessage,
} from '@island.is/island-ui/core'
import {
  capitalize,
  formatDate,
  caseTypes,
} from '@island.is/judicial-system/formatters'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  core,
  signedVerdictOverview as m,
  titles,
} from '@island.is/judicial-system-web/messages'
import {
  InstitutionType,
  User,
  UserRole,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import * as constants from '@island.is/judicial-system/consts'

import AppealSection from './Components/AppealSection/AppealSection'
import { CourtRecordSignatureConfirmationQuery } from './courtRecordSignatureConfirmationGql'
import ModifyDatesModal from './Components/ModifyDatesModal/ModifyDatesModal'

interface ModalControls {
  open: boolean
  title: string
  text: ReactNode
}

function showCustodyNotice(
  type: CaseType,
  state: CaseState,
  decision?: CaseDecision,
) {
  return (
    (type === CaseType.Custody || type === CaseType.AdmissionToFacility) &&
    state === CaseState.ACCEPTED &&
    isAcceptingCaseDecision(decision)
  )
}

export const titleForCase = (
  formatMessage: IntlShape['formatMessage'],
  theCase: Case,
) => {
  const isTravelBan =
    theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
    theCase.type === CaseType.TravelBan

  if (theCase.state === CaseState.REJECTED) {
    if (isInvestigationCase(theCase.type)) {
      return 'Kröfu um rannsóknarheimild hafnað'
    } else {
      return 'Kröfu hafnað'
    }
  }

  if (theCase.state === CaseState.DISMISSED) {
    return formatMessage(m.dismissedTitle)
  }

  if (theCase.isValidToDateInThePast) {
    return formatMessage(m.validToDateInThePast, {
      caseType: isTravelBan ? CaseType.TravelBan : theCase.type,
    })
  }

  return isInvestigationCase(theCase.type)
    ? formatMessage(m.investigationAccepted)
    : formatMessage(m.restrictionActive, {
        caseType: isTravelBan ? CaseType.TravelBan : theCase.type,
      })
}

export const rulingDateLabel = (
  formatMessage: IntlShape['formatMessage'],
  workingCase: Case,
) => {
  return formatMessage(m.rulingDateLabel, {
    courtEndTime: `${formatDate(
      workingCase.courtEndTime,
      'PPP',
    )} kl. ${formatDate(workingCase.courtEndTime, constants.TIME_FORMAT)}`,
  })
}

export const shouldHideNextButton = (workingCase: Case, user?: User) =>
  user?.role !== UserRole.Prosecutor ||
  workingCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
  workingCase.state === CaseState.REJECTED ||
  workingCase.state === CaseState.DISMISSED ||
  workingCase.isValidToDateInThePast ||
  Boolean(workingCase.childCase)

export const getExtensionInfoText = (
  formatMessage: IntlShape['formatMessage'],
  workingCase: Case,
  user?: User,
): string | undefined => {
  if (user?.role !== UserRole.Prosecutor) {
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
    : formatMessage(m.sections.caseExtension.extensionInfoV2, {
        hasChildCase: Boolean(workingCase.childCase),
        caseType: workingCase.type,
        rejectReason,
      })
}

type availableModals = 'NoModal' | 'SigningModal'

export const SignedVerdictOverview: React.FC = () => {
  // Date modification state
  const [isModifyingDates, setIsModifyingDates] = useState<boolean>(false)

  // Case sharing state
  const [shareCaseModal, setSharedCaseModal] = useState<ModalControls>()
  const [
    selectedSharingInstitutionId,
    setSelectedSharingInstitutionId,
  ] = useState<ValueType<ReactSelectOption>>()

  // Court record signature state
  const [
    requestCourtRecordSignatureResponse,
    setRequestCourtRecordSignatureResponse,
  ] = useState<RequestSignatureResponse>()
  const [
    courtRecordSignatureConfirmationResponse,
    setCourtRecordSignatureConfirmationResponse,
  ] = useState<SignatureConfirmationResponse>()

  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    refreshCase,
  } = useContext(FormContext)

  // Ruling signature state
  const [modalVisible, setModalVisible] = useState<availableModals>('NoModal')
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
    requestCourtRecordSignature,
    isRequestingCourtRecordSignature,
    extendCase,
    isExtendingCase,
    isSendingNotification,
  } = useCase()

  // skip loading institutions if the user does not have an id
  const { prosecutorsOffices } = useInstitution(!user?.id)

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
      user &&
      ([UserRole.Judge, UserRole.Registrar, UserRole.Prosecutor].includes(
        user.role,
      ) ||
        user.institution?.type === InstitutionType.PrisonAdmin) &&
      isRestrictionCase(workingCase.type)
    )
  }, [workingCase.type, user])

  const [getCourtRecordSignatureConfirmation] = useLazyQuery(
    CourtRecordSignatureConfirmationQuery,
    {
      fetchPolicy: 'no-cache',
      onCompleted: (courtRecordSignatureConfirmationData) => {
        if (
          courtRecordSignatureConfirmationData?.courtRecordSignatureConfirmation
        ) {
          setCourtRecordSignatureConfirmationResponse(
            courtRecordSignatureConfirmationData.courtRecordSignatureConfirmation,
          )
          refreshCase()
        } else {
          setCourtRecordSignatureConfirmationResponse({ documentSigned: false })
        }
      },
      onError: () => {
        setCourtRecordSignatureConfirmationResponse({ documentSigned: false })
      },
    },
  )

  const handleRequestCourtRecordSignature = async () => {
    if (!workingCase) {
      return
    }

    // Request court record signature to get control code
    requestCourtRecordSignature(workingCase.id).then(
      (requestCourtRecordSignatureResponse) => {
        setRequestCourtRecordSignatureResponse(
          requestCourtRecordSignatureResponse,
        )
        getCourtRecordSignatureConfirmation({
          variables: {
            input: {
              caseId: workingCase.id,
              documentToken: requestCourtRecordSignatureResponse?.documentToken,
            },
          },
        })
      },
    )
  }

  const handleCaseExtension = async () => {
    if (workingCase) {
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
    }
  }

  const setAccusedAppealDate = (date?: Date) => {
    if (workingCase && date) {
      setWorkingCase({
        ...workingCase,
        accusedPostponedAppealDate: formatISO(date),
      })

      updateCase(workingCase.id, {
        accusedPostponedAppealDate: formatISO(date),
      })
    }
  }

  const setProsecutorAppealDate = (date?: Date) => {
    if (workingCase && date) {
      setWorkingCase({
        ...workingCase,
        prosecutorPostponedAppealDate: formatISO(date),
      })

      updateCase(workingCase.id, {
        prosecutorPostponedAppealDate: formatISO(date),
      })
    }
  }

  const withdrawAccusedAppealDate = () => {
    if (workingCase) {
      setWorkingCase({
        ...workingCase,
        accusedPostponedAppealDate: undefined,
      })

      updateCase(workingCase.id, {
        accusedPostponedAppealDate: (null as unknown) as string,
      })
    }
  }

  const withdrawProsecutorAppealDate = () => {
    if (workingCase) {
      setWorkingCase({
        ...workingCase,
        prosecutorPostponedAppealDate: undefined,
      })

      updateCase(workingCase.id, {
        prosecutorPostponedAppealDate: (null as unknown) as string,
      })
    }
  }

  const shareCaseWithAnotherInstitution = (
    institution?: ValueType<ReactSelectOption>,
  ) => {
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

        setWorkingCase({
          ...workingCase,
          sharedWithProsecutorsOffice: undefined,
        })
        setSelectedSharingInstitutionId(null)

        updateCase(workingCase.id, {
          sharedWithProsecutorsOfficeId: (null as unknown) as string,
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
                prosecutorsOffice: (institution as ReactSelectOption).label,
              })}
            />
          ),
        })

        setWorkingCase({
          ...workingCase,
          sharedWithProsecutorsOffice: {
            id: (institution as ReactSelectOption).value as string,
            name: (institution as ReactSelectOption).label,
            type: InstitutionType.ProsecutorsOffice,
            created: new Date().toString(),
            modified: new Date().toString(),
            active: true,
          },
          isHeightenedSecurityLevel: workingCase.isHeightenedSecurityLevel
            ? false
            : workingCase.isHeightenedSecurityLevel,
        })

        updateCase(workingCase.id, {
          sharedWithProsecutorsOfficeId: (institution as ReactSelectOption)
            .value as string,
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

    setWorkingCase((theCase) => ({ ...theCase, ...update }))

    return true
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={Sections.CASE_CLOSED}
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
              onClick={() => router.push(constants.CASES_ROUTE)}
            >
              Til baka
            </Button>
          </Box>
          <Box display="flex" justifyContent="spaceBetween" marginBottom={3}>
            <Box>
              <Box marginBottom={1}>
                <Text as="h1" variant="h1">
                  {titleForCase(formatMessage, workingCase)}
                </Text>
              </Box>
              <Box>
                <Text variant="h5">
                  {rulingDateLabel(formatMessage, workingCase)}
                </Text>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column">
              <RestrictionTags workingCase={workingCase} />
            </Box>
          </Box>
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
        </Box>
        {workingCase.caseModifiedExplanation && (
          <Box marginBottom={5}>
            <AlertMessage
              type="info"
              title={formatMessage(m.sections.modifyDatesInfo.titleV3, {
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
            data={[
              {
                title: formatMessage(core.policeCaseNumber),
                value: workingCase.policeCaseNumbers.map((n) => (
                  <Text key={n}>{n}</Text>
                )),
              },
              {
                title: formatMessage(core.courtCaseNumber),
                value: workingCase.courtCaseNumber,
              },
              {
                title: formatMessage(core.prosecutor),
                value: `${workingCase.creatingProsecutor?.institution?.name}`,
              },
              {
                title: formatMessage(core.court),
                value: workingCase.court?.name,
              },
              {
                title: formatMessage(core.prosecutorPerson),
                value: workingCase.prosecutor?.name,
              },
              {
                title: formatMessage(core.judge),
                value: workingCase.judge?.name,
              },
              // Conditionally add this field based on case type
              ...(isInvestigationCase(workingCase.type)
                ? [
                    {
                      title: formatMessage(core.caseType),
                      value: capitalize(caseTypes[workingCase.type]),
                    },
                  ]
                : []),
              ...(workingCase.registrar
                ? [
                    {
                      title: formatMessage(core.registrar),
                      value: workingCase.registrar?.name,
                    },
                  ]
                : []),
            ]}
            defendants={
              workingCase.defendants
                ? {
                    title: capitalize(
                      formatMessage(core.defendant, {
                        suffix: workingCase.defendants.length > 1 ? 'ar' : 'i',
                      }),
                    ),
                    items: workingCase.defendants,
                  }
                : undefined
            }
            defenders={[
              {
                name: workingCase.defenderName ?? '',
                defenderNationalId: workingCase.defenderNationalId,
                sessionArrangement: workingCase.sessionArrangements,
                email: workingCase.defenderEmail,
                phoneNumber: workingCase.defenderPhoneNumber,
              },
            ]}
          />
        </Box>
        {(workingCase.accusedAppealDecision === CaseAppealDecision.POSTPONE ||
          workingCase.accusedAppealDecision === CaseAppealDecision.APPEAL ||
          workingCase.prosecutorAppealDecision ===
            CaseAppealDecision.POSTPONE ||
          workingCase.prosecutorAppealDecision === CaseAppealDecision.APPEAL) &&
          user?.role &&
          isCourtRole(user.role) &&
          user?.institution?.type !== InstitutionType.HighCourt && (
            <Box marginBottom={7}>
              <AppealSection
                workingCase={workingCase}
                setAccusedAppealDate={setAccusedAppealDate}
                setProsecutorAppealDate={setProsecutorAppealDate}
                withdrawAccusedAppealDate={withdrawAccusedAppealDate}
                withdrawProsecutorAppealDate={withdrawProsecutorAppealDate}
              />
            </Box>
          )}
        {user?.role !== UserRole.Staff && (
          <>
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
            <Box marginBottom={6}>
              <BlueBox>
                <Box marginBottom={2} textAlign="center">
                  <Text as="h3" variant="h3">
                    {formatMessage(m.conclusionTitle)}
                  </Text>
                </Box>
                <Box marginBottom={3}>
                  <Box marginTop={1}>
                    <Text variant="intro">{workingCase.conclusion}</Text>
                  </Box>
                </Box>
                <Box marginBottom={1} textAlign="center">
                  <Text variant="h4">{workingCase.judge?.name}</Text>
                </Box>
              </BlueBox>
            </Box>
          </>
        )}
        <Box marginBottom={10}>
          <Text as="h3" variant="h3" marginBottom={3}>
            {formatMessage(m.caseDocuments)}
          </Text>
          <Box marginBottom={2}>
            <Stack space={2} dividers>
              {user?.role !== UserRole.Staff && (
                <PdfButton
                  renderAs="row"
                  caseId={workingCase.id}
                  title={formatMessage(core.pdfButtonRequest)}
                  pdfType={'request'}
                />
              )}
              {showCustodyNotice(
                workingCase.type,
                workingCase.state,
                workingCase.decision,
              ) && (
                <PdfButton
                  renderAs="row"
                  caseId={workingCase.id}
                  title={formatMessage(core.pdfButtonCustodyNotice)}
                  pdfType="custodyNotice"
                />
              )}
              <PdfButton
                renderAs="row"
                caseId={workingCase.id}
                title={formatMessage(core.pdfButtonRulingShortVersion)}
                pdfType={'courtRecord'}
              >
                {isInvestigationCase(workingCase.type) &&
                  (workingCase.courtRecordSignatory ? (
                    <SignedDocument
                      signatory={workingCase.courtRecordSignatory.name}
                      signingDate={workingCase.courtRecordSignatureDate}
                    />
                  ) : user?.role && isCourtRole(user.role) ? (
                    <Button
                      variant="ghost"
                      size="small"
                      data-testid="signCourtRecordButton"
                      loading={isRequestingCourtRecordSignature}
                      onClick={(event) => {
                        event.stopPropagation()
                        handleRequestCourtRecordSignature()
                      }}
                    >
                      {formatMessage(m.signButton)}
                    </Button>
                  ) : isRestrictionCase(workingCase.type) ? null : (
                    <Text>{formatMessage(m.unsignedDocument)}</Text>
                  ))}
              </PdfButton>
              {user?.role !== UserRole.Staff && (
                <PdfButton
                  renderAs="row"
                  caseId={workingCase.id}
                  title={formatMessage(core.pdfButtonRuling)}
                  pdfType={'ruling'}
                >
                  <Box display="flex" flexDirection="row">
                    {workingCase.rulingDate ? (
                      <SignedDocument
                        signatory={workingCase.judge?.name}
                        signingDate={workingCase.rulingDate}
                      />
                    ) : user && user.id === workingCase.judge?.id ? (
                      <Button
                        size="small"
                        loading={isRequestingRulingSignature}
                        onClick={(event) => {
                          event.stopPropagation()
                          requestRulingSignature()
                        }}
                      >
                        {formatMessage(m.signButton)}
                      </Button>
                    ) : (
                      <Text>{formatMessage(m.unsignedDocument)}</Text>
                    )}
                    {user && user.id === workingCase.judge?.id && (
                      <Box marginLeft={3}>
                        <Button
                          variant="ghost"
                          size="small"
                          data-testid="modifyRulingButton"
                          onClick={(event) => {
                            event.stopPropagation()
                            router.push(
                              isRestrictionCase(workingCase.type)
                                ? `${constants.RESTRICTION_CASE_MODIFY_RULING_ROUTE}/${workingCase.id}`
                                : `${constants.INVESTIGATION_CASE_MODIFY_RULING_ROUTE}/${workingCase.id}`,
                            )
                          }}
                        >
                          {capitalize(formatMessage(core.modify))}
                        </Button>
                      </Box>
                    )}
                  </Box>
                </PdfButton>
              )}
            </Stack>
          </Box>
          <Divider />
        </Box>
        {user?.role === UserRole.Prosecutor &&
          user.institution?.id ===
            workingCase.creatingProsecutor?.institution?.id &&
          isRestrictionCase(workingCase.type) && (
            <Box marginBottom={9}>
              <Box marginBottom={3}>
                <Text variant="h3">
                  {formatMessage(m.sections.shareCase.title)}{' '}
                  <Tooltip text={formatMessage(m.sections.shareCase.info)} />
                </Text>
              </Box>
              <BlueBox>
                <Box display="flex">
                  <Box flexGrow={1} marginRight={2}>
                    <Select
                      name="sharedWithProsecutorsOfficeId"
                      label={formatMessage(m.sections.shareCase.label)}
                      placeholder={formatMessage(
                        m.sections.shareCase.placeholder,
                      )}
                      size="sm"
                      icon={
                        workingCase.sharedWithProsecutorsOffice
                          ? 'checkmark'
                          : undefined
                      }
                      options={prosecutorsOffices
                        .map((prosecutorsOffice) => ({
                          label: prosecutorsOffice.name,
                          value: prosecutorsOffice.id,
                        }))
                        .filter((t) => t.value !== user?.institution?.id)}
                      value={
                        workingCase.sharedWithProsecutorsOffice
                          ? {
                              label:
                                workingCase.sharedWithProsecutorsOffice.name,
                              value: workingCase.sharedWithProsecutorsOffice.id,
                            }
                          : selectedSharingInstitutionId
                          ? {
                              label: (selectedSharingInstitutionId as ReactSelectOption)
                                .label,
                              value: (selectedSharingInstitutionId as ReactSelectOption)
                                .value as string,
                            }
                          : null
                      }
                      onChange={(so: ValueType<ReactSelectOption>) =>
                        setSelectedSharingInstitutionId(so)
                      }
                      disabled={Boolean(
                        workingCase.sharedWithProsecutorsOffice,
                      )}
                    />
                  </Box>
                  <Button
                    size="small"
                    disabled={
                      !selectedSharingInstitutionId &&
                      !workingCase.sharedWithProsecutorsOffice
                    }
                    onClick={() =>
                      shareCaseWithAnotherInstitution(
                        selectedSharingInstitutionId,
                      )
                    }
                  >
                    {workingCase.sharedWithProsecutorsOffice
                      ? formatMessage(m.sections.shareCase.close)
                      : formatMessage(m.sections.shareCase.open)}
                  </Button>
                </Box>
              </BlueBox>
            </Box>
          )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={constants.CASES_ROUTE}
          hideNextButton={shouldHideNextButton(workingCase, user)}
          nextButtonText={formatMessage(m.sections.caseExtension.buttonLabel, {
            caseType: workingCase.type,
          })}
          onNextButtonClick={() => handleCaseExtension()}
          nextIsLoading={isExtendingCase}
          infoBoxText={getExtensionInfoText(formatMessage, workingCase, user)}
        />
      </FormContentContainer>
      {shareCaseModal?.open && (
        <Modal
          title={shareCaseModal.title}
          text={shareCaseModal.text}
          primaryButtonText={formatMessage(core.closeModal)}
          onPrimaryButtonClick={() => setSharedCaseModal(undefined)}
        />
      )}
      <AnimatePresence exitBeforeEnter>
        {isModifyingDates && (
          <ModifyDatesModal
            workingCase={workingCase}
            onSubmit={onModifyDatesSubmit}
            isSendingNotification={isSendingNotification}
            isUpdatingCase={isUpdatingCase}
            setIsModifyingDates={setIsModifyingDates}
          />
        )}
      </AnimatePresence>
      {requestCourtRecordSignatureResponse && (
        <Modal
          title={
            !courtRecordSignatureConfirmationResponse
              ? formatMessage(m.sections.courtRecordSignatureModal.titleSigning)
              : courtRecordSignatureConfirmationResponse.documentSigned
              ? formatMessage(m.sections.courtRecordSignatureModal.titleSuccess)
              : courtRecordSignatureConfirmationResponse.code === 7023 // User cancelled
              ? formatMessage(
                  m.sections.courtRecordSignatureModal.titleCanceled,
                )
              : formatMessage(m.sections.courtRecordSignatureModal.titleFailure)
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
                    m.sections.courtRecordSignatureModal.controlCodeDisclaimer,
                  )}
                </Text>
              </>
            ) : courtRecordSignatureConfirmationResponse.documentSigned ? (
              formatMessage(m.sections.courtRecordSignatureModal.completed)
            ) : (
              formatMessage(m.sections.courtRecordSignatureModal.notCompleted)
            )
          }
          primaryButtonText={
            courtRecordSignatureConfirmationResponse
              ? formatMessage(core.closeModal)
              : ''
          }
          onPrimaryButtonClick={() => {
            setRequestCourtRecordSignatureResponse(undefined)
            setCourtRecordSignatureConfirmationResponse(undefined)
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
    </PageLayout>
  )
}

export default SignedVerdictOverview
