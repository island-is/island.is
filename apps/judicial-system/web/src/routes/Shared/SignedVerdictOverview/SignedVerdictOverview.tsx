import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { ValueType } from 'react-select/src/types'
import { IntlShape, useIntl } from 'react-intl'
import compareAsc from 'date-fns/compareAsc'
import formatISO from 'date-fns/formatISO'
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'
import subMilliseconds from 'date-fns/subMilliseconds'

import {
  CaseDecision,
  CaseState,
  InstitutionType,
  isRestrictionCase,
  NotificationType,
  RequestSignatureResponse,
  SignatureConfirmationResponse,
  UserRole,
} from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import {
  FormFooter,
  PageLayout,
  FormContentContainer,
  Modal,
  DateTime,
  BlueBox,
} from '@island.is/judicial-system-web/src/components'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  CaseData,
  ReactSelectOption,
} from '@island.is/judicial-system-web/src/types'
import { Box, Input, Text } from '@island.is/island-ui/core'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import { signedVerdictOverview as m } from '@island.is/judicial-system-web/messages'
import MarkdownWrapper from '@island.is/judicial-system-web/src/components/MarkdownWrapper/MarkdownWrapper'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { titles } from '@island.is/judicial-system-web/messages/Core/titles'
import * as Constants from '@island.is/judicial-system/consts'

import { CourtRecordSignatureConfirmationQuery } from './courtRecordSignatureConfirmationGql'
import SignedVerdictOverviewForm from './SignedVerdictOverviewForm'

interface ModalControls {
  open: boolean
  title: string
  text: ReactNode
}

interface DateTime {
  value?: Date
  isValid: boolean
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
          if (workingCase) {
            reloadCase({ variables: { input: { id: workingCase.id } } })
          }
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

  const [reloadCase] = useLazyQuery<CaseData>(CaseQuery, {
    fetchPolicy: 'no-cache',
    onCompleted: (caseData) => {
      if (caseData?.case) {
        setWorkingCase(caseData.case)
      }
    },
  })

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
          router.push(`${Constants.STEP_ONE_ROUTE}/${workingCase.childCase.id}`)
        } else {
          router.push(
            `${Constants.IC_DEFENDANT_ROUTE}/${workingCase.childCase.id}`,
          )
        }
      } else {
        await extendCase(workingCase.id).then((extendedCase) => {
          if (extendedCase) {
            if (isRestrictionCase(extendedCase.type)) {
              router.push(`${Constants.STEP_ONE_ROUTE}/${extendedCase.id}`)
            } else {
              router.push(`${Constants.IC_DEFENDANT_ROUTE}/${extendedCase.id}`)
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
          date: `${formatDate(modifiedValidToDate?.value, 'PPPP')?.replace(
            'dagur,',
            'dagsins',
          )} kl. ${formatDate(
            modifiedValidToDate?.value,
            Constants.TIME_FORMAT,
          )}`,
        },
      )
    } else if (validToDateChanged || isolationToDateChanged) {
      if (validToDateChanged) {
        modification = formatMessage(
          m.sections.modifyDatesModal.validToDateChanged,
          {
            date: `${formatDate(modifiedValidToDate?.value, 'PPPP')?.replace(
              'dagur,',
              'dagsins',
            )} kl. ${formatDate(
              modifiedValidToDate?.value,
              Constants.TIME_FORMAT,
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
              Constants.TIME_FORMAT,
            )}`,
          },
        )
        modification = `${modification} ${isolationText}`
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
    if (
      value &&
      workingCase.isCustodyIsolation &&
      workingCase.isolationToDate
    ) {
      const validToDateIsBeforeIsolationToDate =
        compareAsc(value, new Date(workingCase.isolationToDate)) === -1

      const validToIsolationToDiff = validToDateIsBeforeIsolationToDate
        ? differenceInMilliseconds(value, new Date(workingCase.isolationToDate))
        : 0

      if (validToDateIsBeforeIsolationToDate) {
        setModifiedIsolationToDate({
          value: subMilliseconds(value, Math.abs(validToIsolationToDiff)),
          isValid: valid,
        })

        setIsolationToDateChanged(true)
      }
    }

    setModifiedValidToDate({
      value: value ?? modifiedValidToDate?.value,
      isValid: valid,
    })

    setValidToDateChanged(
      value !== undefined &&
        workingCase.validToDate !== undefined &&
        compareAsc(value, new Date(workingCase.validToDate)) !== 0,
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
      Constants.TIME_FORMAT,
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

  /**
   * We assume that the signed verdict page is only opened for
   * cases in state REJECTED or ACCEPTED.
   *
   * Based on the judge's decision the signed verdict page can
   * be in one of five states:
   *
   * 1. Rejected
   *    - state === REJECTED and decision === REJECTING
   * 2. Alternative travel ban accepted and the travel ban end date is in the past
   *    - state === ACCEPTED and decision === ACCEPTING_ALTERNATIVE_TRAVEL_BAN and validToDate < today
   * 3. Accepted and the custody end date is in the past
   *    - state === ACCEPTED and decision === ACCEPTING/ACCEPTING_PARTIALLY and validToDate < today
   * 5. Alternative travel ban accepted and the travel ban end date is not in the past
   *    - state === ACCEPTED and decision === ACCEPTING_ALTERNATIVE_TRAVEL_BAN and validToDate > today
   * 3. Accepted and the custody end date is not in the past
   *    - state === ACCEPTED and decision === ACCEPTING/ACCEPTING_PARTIALLY and validToDate > today
   */
  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={2}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader title={formatMessage(titles.shared.signedVerdictOverview)} />
      <SignedVerdictOverviewForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        setAccusedAppealDate={setAccusedAppealDate}
        setProsecutorAppealDate={setProsecutorAppealDate}
        withdrawAccusedAppealDate={withdrawAccusedAppealDate}
        withdrawProsecutorAppealDate={withdrawProsecutorAppealDate}
        shareCaseWithAnotherInstitution={shareCaseWithAnotherInstitution}
        selectedSharingInstitutionId={selectedSharingInstitutionId}
        setSelectedSharingInstitutionId={setSelectedSharingInstitutionId}
        isRequestingCourtRecordSignature={isRequestingCourtRecordSignature}
        handleRequestCourtRecordSignature={handleRequestCourtRecordSignature}
        handleOpenDateModificationModal={() =>
          setIsModifyingDates(!isModifyingDates)
        }
      />
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={Constants.CASE_LIST_ROUTE}
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
