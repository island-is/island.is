import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { ValueType } from 'react-select/src/types'
import { IntlShape, useIntl } from 'react-intl'
import compareAsc from 'date-fns/compareAsc'
import formatISO from 'date-fns/formatISO'

import {
  Case,
  CaseDecision,
  CaseState,
  CaseType,
  InstitutionType,
  isInvestigationCase,
  isRestrictionCase,
  NotificationType,
  RequestSignatureResponse,
  SignatureConfirmationResponse,
  UserRole,
  CaseAppealDecision,
  isAcceptingCaseDecision,
} from '@island.is/judicial-system/types'
import {
  FormFooter,
  PageLayout,
  Modal,
  DateTime,
  BlueBox,
  InfoCard,
  PdfButton,
  CourtRecordAccordionItem,
  FormContentContainer,
  PoliceRequestAccordionItem,
  RulingAccordionItem,
  CommentsAccordionItem,
  CaseFilesAccordionItem,
} from '@island.is/judicial-system-web/src/components'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import {
  useCase,
  useInstitution,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import {
  Box,
  Input,
  Text,
  Accordion,
  Button,
  Select,
  Tooltip,
  Stack,
  Divider,
  AlertMessage,
} from '@island.is/island-ui/core'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  capitalize,
  formatDate,
  caseTypes,
} from '@island.is/judicial-system/formatters'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'
import MarkdownWrapper from '@island.is/judicial-system-web/src/components/MarkdownWrapper/MarkdownWrapper'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import * as constants from '@island.is/judicial-system/consts'
import {
  core,
  signedVerdictOverview as m,
  titles,
} from '@island.is/judicial-system-web/messages'
import { SignedDocument } from '@island.is/judicial-system-web/src/components/SignedDocument/SignedDocument'
import CaseDates from '@island.is/judicial-system-web/src/components/CaseDates/CaseDates'
import RestrictionTags from '@island.is/judicial-system-web/src/components/RestrictionTags/RestrictionTags'

import AppealSection from './Components/AppealSection/AppealSection'
import { CourtRecordSignatureConfirmationQuery } from './courtRecordSignatureConfirmationGql'

interface ModalControls {
  open: boolean
  title: string
  text: ReactNode
}

interface DateTime {
  value?: Date
  isValid: boolean
}

function showCustodyNotice(
  type: CaseType,
  state: CaseState,
  decision?: CaseDecision,
) {
  return (
    (type === CaseType.CUSTODY || type === CaseType.ADMISSION_TO_FACILITY) &&
    state === CaseState.ACCEPTED &&
    isAcceptingCaseDecision(decision)
  )
}

export const SignedVerdictOverview: React.FC = () => {
  // Date modification state
  const [isModifyingDates, setIsModifyingDates] = useState<boolean>(false)
  const [modifiedValidToDate, setModifiedValidToDate] = useState<DateTime>()
  const [
    caseModifiedExplanation,
    setCaseModifiedExplanation,
  ] = useState<string>()
  const [
    caseModifiedExplanationErrorMessage,
    setCaseModifiedExplanationErrorMessage,
  ] = useState<string>('')
  const [
    isCaseModificationConfirmed,
    setIsCaseModificationConfirmed,
  ] = useState<boolean>(false)
  const [validToDateChanged, setValidToDateChanged] = useState<boolean>()
  const [
    isolationToDateChanged,
    setIsolationToDateChanged,
  ] = useState<boolean>()
  const [
    modifiedIsolationToDate,
    setModifiedIsolationToDate,
  ] = useState<DateTime>()

  // Case sharing state
  const [shareCaseModal, setSharedCaseModal] = useState<ModalControls>()
  const [
    selectedSharingInstitutionId,
    setSelectedSharingInstitutionId,
  ] = useState<ValueType<ReactSelectOption>>()

  // Signature state
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
    sendNotification,
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
  const titleForCase = (theCase: Case) => {
    const isTravelBan =
      theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
      theCase.type === CaseType.TRAVEL_BAN

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
        caseType: isTravelBan ? CaseType.TRAVEL_BAN : theCase.type,
      })
    }

    return isInvestigationCase(theCase.type)
      ? formatMessage(m.investigationAccepted)
      : formatMessage(m.restrictionActive, {
          caseType: isTravelBan ? CaseType.TRAVEL_BAN : theCase.type,
        })
  }

  const canModifyCaseDates = useCallback(() => {
    return (
      user &&
      [UserRole.JUDGE, UserRole.REGISTRAR, UserRole.PROSECUTOR].includes(
        user.role,
      ) &&
      (workingCase.type === CaseType.CUSTODY ||
        workingCase.type === CaseType.ADMISSION_TO_FACILITY)
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
      onError: (reason) => {
        console.log(reason)
        setCourtRecordSignatureConfirmationResponse({ documentSigned: false })
      },
    },
  )

  useEffect(() => {
    if (workingCase.validToDate) {
      setModifiedValidToDate({
        value: new Date(workingCase.validToDate),
        isValid: true,
      })
    }

    if (workingCase.isolationToDate) {
      setModifiedIsolationToDate({
        value: new Date(workingCase.isolationToDate),
        isValid: true,
      })
    }
  }, [workingCase.validToDate, workingCase.isolationToDate])

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
          router.push(`${constants.STEP_ONE_ROUTE}/${workingCase.childCase.id}`)
        } else {
          router.push(
            `${constants.IC_DEFENDANT_ROUTE}/${workingCase.childCase.id}`,
          )
        }
      } else {
        await extendCase(workingCase.id).then((extendedCase) => {
          if (extendedCase) {
            if (isRestrictionCase(extendedCase.type)) {
              router.push(`${constants.STEP_ONE_ROUTE}/${extendedCase.id}`)
            } else {
              router.push(`${constants.IC_DEFENDANT_ROUTE}/${extendedCase.id}`)
            }
          }
        })
      }
    }
  }

  const getExtensionInfoText = (
    workingCase: Case,
    formatMessage: IntlShape['formatMessage'],
  ): string | undefined => {
    if (user?.role !== UserRole.PROSECUTOR) {
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
          hasChildCase: workingCase.childCase ? 'yes' : 'no',
          caseType: workingCase.type,
          rejectReason,
        })
  }

  const getModificationSuccessText = () => {
    let modification = ''

    const validToDateAndIsolationToDateAreTheSame =
      modifiedValidToDate &&
      modifiedValidToDate.value &&
      workingCase.validToDate &&
      modifiedIsolationToDate &&
      modifiedIsolationToDate.value &&
      workingCase.isolationToDate &&
      compareAsc(modifiedValidToDate?.value, modifiedIsolationToDate?.value) ===
        0

    if (validToDateAndIsolationToDateAreTheSame) {
      modification = formatMessage(
        m.sections.modifyDatesModal.validToDateAndIsolationToDateAreTheSame,
        {
          caseType: workingCase.type,
          date: `${formatDate(modifiedValidToDate?.value, 'PPPP')?.replace(
            'dagur,',
            'dagsins',
          )} kl. ${formatDate(
            modifiedValidToDate?.value,
            constants.TIME_FORMAT,
          )}`,
        },
      )
    } else if (validToDateChanged || isolationToDateChanged) {
      if (validToDateChanged) {
        modification = formatMessage(
          m.sections.modifyDatesModal.validToDateChanged,
          {
            caseType: workingCase.type,
            date: `${formatDate(modifiedValidToDate?.value, 'PPPP')?.replace(
              'dagur,',
              'dagsins',
            )} kl. ${formatDate(
              modifiedValidToDate?.value,
              constants.TIME_FORMAT,
            )}`,
          },
        )
      }

      if (isolationToDateChanged) {
        const isolationText = formatMessage(
          m.sections.modifyDatesModal.isolationDateChanged,
          {
            date: `${formatDate(
              modifiedIsolationToDate?.value,
              'PPPP',
            )?.replace('dagur,', 'dagsins')} kl. ${formatDate(
              modifiedIsolationToDate?.value,
              constants.TIME_FORMAT,
            )}`,
          },
        )
        modification = modification
          ? `${modification} ${isolationText}`
          : isolationText
      }
    }

    return formatMessage(m.sections.modifyDatesModal.successText, {
      modification,
      courtOrProsecutor:
        user?.role === UserRole.PROSECUTOR
          ? 'héraðsdómstól'
          : 'saksóknaraembætti',
    })
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
            type: InstitutionType.PROSECUTORS_OFFICE,
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

  const handleValidToDateModification = (
    value: Date | undefined,
    valid: boolean,
  ) => {
    const validToDate = value ?? modifiedValidToDate?.value

    if (
      validToDate &&
      workingCase.isCustodyIsolation &&
      (!modifiedIsolationToDate?.value ||
        compareAsc(validToDate, new Date(modifiedIsolationToDate.value)) === -1)
    ) {
      setModifiedIsolationToDate({
        value: validToDate,
        isValid: valid,
      })

      setIsolationToDateChanged(
        !workingCase.isolationToDate ||
          compareAsc(validToDate, new Date(workingCase.isolationToDate)) !== 0,
      )
    }

    setModifiedValidToDate({
      value: validToDate,
      isValid: valid,
    })

    setValidToDateChanged(
      value &&
        (!workingCase.validToDate ||
          compareAsc(value, new Date(workingCase.validToDate)) !== 0),
    )
  }

  const handleDateModification = async () => {
    if (!caseModifiedExplanation) {
      return
    }

    if (modifiedValidToDate?.value && modifiedIsolationToDate?.value) {
      const formattedValidToDate = formatISO(modifiedValidToDate.value, {
        representation: 'complete',
      })

      const formattedIsolationToDate = formatISO(
        modifiedIsolationToDate.value,
        {
          representation: 'complete',
        },
      )

      const update = {
        validToDate: formattedValidToDate,
        isolationToDate: formattedIsolationToDate,
        caseModifiedExplanation: `${
          workingCase.caseModifiedExplanation
            ? workingCase.caseModifiedExplanation
            : ''
        }${createCaseModifiedExplanation(caseModifiedExplanation)}`,
      }

      const updatedCase = await updateCase(workingCase.id, { ...update })

      if (updatedCase) {
        await sendNotification(workingCase.id, NotificationType.MODIFIED)
      }

      setWorkingCase({
        ...workingCase,
        ...update,
      })

      setIsCaseModificationConfirmed(true)
    }
  }

  const createCaseModifiedExplanation = (reason?: string) => {
    const now = new Date()

    return `${
      workingCase.caseModifiedExplanation ? '<br/><br/>' : ''
    }${capitalize(formatDate(now, 'PPPP', true) || '')} kl. ${formatDate(
      now,
      constants.TIME_FORMAT,
    )} - ${user?.name} ${user?.title}, ${
      user?.institution?.name
    }<br/>Ástæða: ${reason}`
  }

  const handleCaseModifiedExplanationChange = (reason: string) => {
    const { isValid } = validate(reason, 'empty')

    setCaseModifiedExplanation(reason)

    if (isValid) {
      setCaseModifiedExplanationErrorMessage('')
    }
  }

  const handleCaseModifiedExplanationBlur = (reason: string) => {
    const { isValid, errorMessage } = validate(reason, 'empty')

    if (isValid) {
      setCaseModifiedExplanation(reason)
    } else {
      setCaseModifiedExplanationErrorMessage(errorMessage)
    }
  }

  const isCaseModificationInvalid = () => {
    return (
      !caseModifiedExplanation ||
      !caseModifiedExplanation.trim() ||
      !modifiedValidToDate?.isValid ||
      (workingCase.isCustodyIsolation && !modifiedIsolationToDate?.isValid) ||
      (!validToDateChanged && !isolationToDateChanged)
    )
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={2}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader title={formatMessage(titles.shared.signedVerdictOverview)} />
      <FormContentContainer>
        <Box marginBottom={5}>
          <Box marginBottom={3}>
            <Button
              variant="text"
              preTextIcon="arrowBack"
              onClick={() => router.push(constants.CASE_LIST_ROUTE)}
            >
              Til baka
            </Button>
          </Box>
          <Box display="flex" justifyContent="spaceBetween" marginBottom={3}>
            <Box>
              <Box marginBottom={1}>
                <Text as="h1" variant="h1">
                  {titleForCase(workingCase)}
                </Text>
              </Box>
              <Box>
                <Text variant="h5">
                  {formatMessage(m.rulingDateLabel, {
                    courtEndTime: `${formatDate(
                      workingCase.courtEndTime,
                      'PPP',
                    )} kl. ${formatDate(
                      workingCase.courtEndTime,
                      constants.TIME_FORMAT,
                    )}`,
                  })}
                </Text>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column">
              <RestrictionTags workingCase={workingCase} />
            </Box>
          </Box>
          {isRestrictionCase(workingCase.type) &&
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
              title={formatMessage(m.sections.modifyDatesInfo.titleV2, {
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
                value: workingCase.policeCaseNumber,
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
            defendants={workingCase.defendants ?? []}
            defender={{
              name: workingCase.defenderName ?? '',
              defenderNationalId: workingCase.defenderNationalId,
              email: workingCase.defenderEmail,
              phoneNumber: workingCase.defenderPhoneNumber,
            }}
            sessionArrangement={workingCase.sessionArrangements}
          />
        </Box>
        {(workingCase.accusedAppealDecision === CaseAppealDecision.POSTPONE ||
          workingCase.accusedAppealDecision === CaseAppealDecision.APPEAL ||
          workingCase.prosecutorAppealDecision ===
            CaseAppealDecision.POSTPONE ||
          workingCase.prosecutorAppealDecision === CaseAppealDecision.APPEAL) &&
          (user?.role === UserRole.JUDGE ||
            user?.role === UserRole.REGISTRAR) &&
          user?.institution?.type !== InstitutionType.HIGH_COURT && (
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
        {user?.role !== UserRole.STAFF && (
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
                  <Text variant="h4">{workingCase?.judge?.name}</Text>
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
              {user?.role !== UserRole.STAFF && (
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
                {workingCase.courtRecordSignatory ? (
                  <SignedDocument
                    signatory={workingCase.courtRecordSignatory.name}
                    signingDate={workingCase.courtRecordSignatureDate}
                  />
                ) : user?.role === UserRole.JUDGE ||
                  user?.role === UserRole.REGISTRAR ? (
                  <Button
                    variant="ghost"
                    loading={isRequestingCourtRecordSignature}
                    onClick={(event) => {
                      event.stopPropagation()
                      handleRequestCourtRecordSignature()
                    }}
                  >
                    {formatMessage(m.signButton)}
                  </Button>
                ) : (
                  <Text>{formatMessage(m.unsignedDocument)}</Text>
                )}
              </PdfButton>
              {user?.role !== UserRole.STAFF && (
                <PdfButton
                  renderAs="row"
                  caseId={workingCase.id}
                  title={formatMessage(core.pdfButtonRuling)}
                  pdfType={'ruling'}
                >
                  <SignedDocument
                    signatory={workingCase.judge?.name}
                    signingDate={workingCase.rulingDate}
                  />
                  {user?.role === UserRole.JUDGE && (
                    <Button
                      variant="ghost"
                      data-testid="modifyRulingButton"
                      onClick={(event) => {
                        event.stopPropagation()
                        router.push(
                          isRestrictionCase(workingCase.type)
                            ? `${constants.MODIFY_RULING_ROUTE}/${workingCase.id}`
                            : `${constants.IC_MODIFY_RULING_ROUTE}/${workingCase.id}`,
                        )
                      }}
                    >
                      {capitalize(formatMessage(core.modify))}
                    </Button>
                  )}
                </PdfButton>
              )}
            </Stack>
          </Box>
          <Divider />
        </Box>
        {user?.role === UserRole.PROSECUTOR &&
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
          previousUrl={constants.CASE_LIST_ROUTE}
          hideNextButton={
            user?.role !== UserRole.PROSECUTOR ||
            workingCase.decision ===
              CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
            workingCase.state === CaseState.REJECTED ||
            workingCase.state === CaseState.DISMISSED ||
            workingCase.isValidToDateInThePast ||
            Boolean(workingCase.childCase)
          }
          nextButtonText={formatMessage(m.sections.caseExtension.buttonLabel, {
            caseType: workingCase.type,
          })}
          onNextButtonClick={() => handleCaseExtension()}
          nextIsLoading={isExtendingCase}
          infoBoxText={getExtensionInfoText(workingCase, formatMessage)}
        />
      </FormContentContainer>
      {shareCaseModal?.open && (
        <Modal
          title={shareCaseModal.title}
          text={shareCaseModal.text}
          primaryButtonText={formatMessage(
            m.sections.shareCaseModal.buttonClose,
          )}
          handlePrimaryButtonClick={() => setSharedCaseModal(undefined)}
        />
      )}
      <AnimatePresence exitBeforeEnter>
        {isModifyingDates &&
          (!isCaseModificationConfirmed ? (
            <motion.div
              key="dateModifyingModal"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <Modal
                title={formatMessage(m.sections.modifyDatesModal.titleV2, {
                  caseType: workingCase.type,
                })}
                text={formatMessage(m.sections.modifyDatesModal.textV2, {
                  caseType: workingCase.type,
                })}
                primaryButtonText={formatMessage(
                  m.sections.modifyDatesModal.primaryButtonText,
                )}
                isPrimaryButtonDisabled={isCaseModificationInvalid()}
                handlePrimaryButtonClick={() => handleDateModification()}
                isPrimaryButtonLoading={isSendingNotification || isUpdatingCase}
                secondaryButtonText={formatMessage(
                  m.sections.modifyDatesModal.secondaryButtonText,
                )}
                handleSecondaryButtonClick={() => {
                  setCaseModifiedExplanation(undefined)

                  if (workingCase.validToDate) {
                    setModifiedValidToDate({
                      value: new Date(workingCase.validToDate),
                      isValid: true,
                    })
                  }

                  if (workingCase.isolationToDate) {
                    setModifiedIsolationToDate({
                      value: new Date(workingCase.isolationToDate),
                      isValid: true,
                    })
                  }
                  setIsModifyingDates(false)
                }}
              >
                <Box marginBottom={5}>
                  <Box marginBottom={3}>
                    <Text variant="h3" as="h2">
                      {formatMessage(
                        m.sections.modifyDatesModal.reasonForChangeTitle,
                      )}
                    </Text>
                  </Box>
                  <Input
                    name="reason"
                    label={formatMessage(
                      m.sections.modifyDatesModal.reasonForChangeLabel,
                    )}
                    placeholder={formatMessage(
                      m.sections.modifyDatesModal.reasonForChangePlaceholderV2,
                      { caseType: workingCase.type },
                    )}
                    onChange={(event) => {
                      handleCaseModifiedExplanationChange(event.target.value)
                    }}
                    onBlur={(event) =>
                      handleCaseModifiedExplanationBlur(event.target.value)
                    }
                    hasError={caseModifiedExplanationErrorMessage !== ''}
                    errorMessage={caseModifiedExplanationErrorMessage}
                    textarea
                    rows={9}
                    required
                  />
                </Box>
                <Box marginBottom={6}>
                  <BlueBox>
                    <DateTime
                      name="modifiedValidToDate"
                      size="sm"
                      datepickerLabel={formatMessage(
                        m.sections.modifyDatesModal.modifiedValidToDateLabelV2,
                        {
                          caseType: workingCase.type,
                        },
                      )}
                      selectedDate={modifiedValidToDate?.value}
                      onChange={(value, valid) => {
                        handleValidToDateModification(value, valid)
                      }}
                      minDate={
                        workingCase.rulingDate
                          ? new Date(workingCase.rulingDate)
                          : undefined
                      }
                      blueBox={false}
                      required
                    />
                    {workingCase.isCustodyIsolation && (
                      <Box marginTop={2}>
                        <DateTime
                          name="modifiedIsolationToDate"
                          size="sm"
                          datepickerLabel={formatMessage(
                            m.sections.modifyDatesModal
                              .modifiedIsolationToDateLabel,
                          )}
                          selectedDate={modifiedIsolationToDate?.value}
                          onChange={(value, valid) => {
                            setModifiedIsolationToDate({
                              value: value ?? modifiedIsolationToDate?.value,
                              isValid: valid,
                            })

                            setIsolationToDateChanged(
                              value !== undefined &&
                                workingCase.isolationToDate !== undefined &&
                                compareAsc(
                                  new Date(workingCase.isolationToDate),
                                  value,
                                ) !== 0,
                            )
                          }}
                          minDate={
                            workingCase.rulingDate
                              ? new Date(workingCase.rulingDate)
                              : undefined
                          }
                          maxDate={modifiedValidToDate?.value}
                          blueBox={false}
                          required
                        />
                      </Box>
                    )}
                  </BlueBox>
                </Box>
              </Modal>
            </motion.div>
          ) : (
            <motion.div
              key="dateModifyingModalSuccess"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <Modal
                title={formatMessage(
                  m.sections.modifyDatesModal.successTitleV2,
                  { caseType: workingCase.type },
                )}
                text={getModificationSuccessText()}
                secondaryButtonText={formatMessage(
                  m.sections.modifyDatesModal.secondaryButtonTextSuccess,
                )}
                handleSecondaryButtonClick={() => {
                  setCaseModifiedExplanation(undefined)
                  setValidToDateChanged(undefined)
                  setIsolationToDateChanged(undefined)
                  setIsModifyingDates(false)
                  setIsCaseModificationConfirmed(false)
                }}
              />
            </motion.div>
          ))}
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
              ? formatMessage(m.sections.courtRecordSignatureModal.closeButon)
              : ''
          }
          handlePrimaryButtonClick={() => {
            setRequestCourtRecordSignatureResponse(undefined)
            setCourtRecordSignatureConfirmationResponse(undefined)
          }}
        />
      )}
    </PageLayout>
  )
}

export default SignedVerdictOverview
