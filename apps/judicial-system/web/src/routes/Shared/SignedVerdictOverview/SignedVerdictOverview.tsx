import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import formatISO from 'date-fns/formatISO'
import { ValueType } from 'react-select/src/types'
import { useIntl } from 'react-intl'

import {
  CaseDecision,
  CaseState,
  CaseType,
  InstitutionType,
  isRestrictionCase,
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
import {
  parseNull,
  parseString,
} from '@island.is/judicial-system-web/src/utils/formatters'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  CaseData,
  ReactSelectOption,
} from '@island.is/judicial-system-web/src/types'
import { Box, Input, Text } from '@island.is/island-ui/core'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  capitalize,
  formatDate,
  TIME_FORMAT,
} from '@island.is/judicial-system/formatters'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import { signedVerdictOverview as m } from '@island.is/judicial-system-web/messages/Core/signedVerdictOverview'

import { CourtRecordSignatureConfirmationQuery } from './courtRecordSignatureConfirmationGql'
import SignedVerdictOverviewForm from './SignedVerdictOverviewForm'

export const SignedVerdictOverview: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const [shareCaseModal, setSharedCaseModal] = useState<{
    open: boolean
    title: string
    text: ReactNode
  }>()
  const [isModifyingDates, setIsModifyingDates] = useState<boolean>(false)
  const [modifiedValidToDate, setModifiedValidToDate] = useState<{
    value?: Date
    isValid: boolean
  }>()
  const [modifiedIsolationToDate, setModifiedIsolationToDate] = useState<{
    value?: Date
    isValid: boolean
  }>()
  const [
    selectedSharingInstitutionId,
    setSelectedSharingInstitutionId,
  ] = useState<ValueType<ReactSelectOption>>()
  const [
    requestCourtRecordSignatureResponse,
    setRequestCourtRecordSignatureResponse,
  ] = useState<RequestSignatureResponse>()
  const [
    courtRecordSignatureConfirmationResponse,
    setCourtRecordSignatureConfirmationResponse,
  ] = useState<SignatureConfirmationResponse>()
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

  const router = useRouter()
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const {
    updateCase,
    requestCourtRecordSignature,
    isRequestingCourtRecordSignature,
    extendCase,
    isExtendingCase,
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
    document.title = 'Yfirlit staðfestrar kröfu - Réttarvörslugátt'
  }, [])

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
    requestCourtRecordSignature(workingCase.id)
      .then((requestCourtRecordSignatureResponse) => {
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
      })
      .catch((reason) => {
        // TODO: Handle error
        console.log(reason)
      })
  }

  const handleNextButtonClick = async () => {
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
        await extendCase(workingCase.id)
          .then((extendedCase) => {
            if (extendedCase) {
              if (isRestrictionCase(extendedCase.type)) {
                router.push(`${Constants.STEP_ONE_ROUTE}/${extendedCase.id}`)
              } else {
                router.push(
                  `${Constants.IC_DEFENDANT_ROUTE}/${extendedCase.id}`,
                )
              }
            }
          })
          .catch((reason) => {
            // TODO: Handle error
            console.log(reason)
          })
      }
    }
  }

  const getInfoText = (workingCase: Case): string | undefined => {
    if (user?.role !== UserRole.PROSECUTOR) {
      // Only prosecutors should see the explanation.
      return undefined
    } else if (
      workingCase.state === CaseState.REJECTED ||
      workingCase.state === CaseState.DISMISSED
    ) {
      return `Ekki hægt að framlengja ${
        workingCase.type === CaseType.CUSTODY
          ? 'gæsluvarðhald'
          : workingCase.type === CaseType.TRAVEL_BAN
          ? 'farbann'
          : 'heimild'
      } sem var ${
        workingCase.state === CaseState.REJECTED ? 'hafnað' : 'vísað frá'
      }.`
    } else if (
      workingCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
    ) {
      return 'Ekki hægt að framlengja kröfu þegar dómari hefur úrskurðað um annað en dómkröfur sögðu til um.'
    } else if (workingCase.childCase) {
      return 'Framlengingarkrafa hefur þegar verið útbúin.'
    } else if (workingCase.isValidToDateInThePast) {
      // This must be after the rejected and alternatice decision cases as the custody
      // end date only applies to cases that were accepted by the judge. This must also
      // be after the already extended case as the custody end date may expire after
      // the case has been extended.
      return `Ekki hægt að framlengja ${
        workingCase.type === CaseType.CUSTODY
          ? 'gæsluvarðhald'
          : workingCase.type === CaseType.TRAVEL_BAN
          ? 'farbann'
          : 'heimild'
      } sem er lokið.`
    } else {
      return undefined
    }
  }

  const setAccusedAppealDate = (date?: Date) => {
    if (workingCase && date) {
      setWorkingCase({
        ...workingCase,
        accusedPostponedAppealDate: formatISO(date),
      })

      updateCase(
        workingCase.id,
        parseString('accusedPostponedAppealDate', formatISO(date)),
      )
    }
  }

  const setProsecutorAppealDate = (date?: Date) => {
    if (workingCase && date) {
      setWorkingCase({
        ...workingCase,
        prosecutorPostponedAppealDate: formatISO(date),
      })

      updateCase(
        workingCase.id,
        parseString('prosecutorPostponedAppealDate', formatISO(date)),
      )
    }
  }

  const withdrawAccusedAppealDate = () => {
    if (workingCase) {
      setWorkingCase({
        ...workingCase,
        accusedPostponedAppealDate: undefined,
      })

      updateCase(workingCase.id, parseNull('accusedPostponedAppealDate'))
    }
  }

  const withdrawProsecutorAppealDate = () => {
    if (workingCase) {
      setWorkingCase({
        ...workingCase,
        prosecutorPostponedAppealDate: undefined,
      })

      updateCase(workingCase.id, parseNull('prosecutorPostponedAppealDate'))
    }
  }

  const shareCaseWithAnotherInstitution = (
    institution?: ValueType<ReactSelectOption>,
  ) => {
    if (workingCase) {
      if (workingCase.sharedWithProsecutorsOffice) {
        setSharedCaseModal({
          open: true,
          title: `Mál ${workingCase.courtCaseNumber} er nú lokað öðrum en upprunalegu embætti`,
          text: (
            <Text>
              <Text fontWeight="semiBold" as="span">
                {workingCase.sharedWithProsecutorsOffice.name}
              </Text>{' '}
              hefur ekki lengur aðgang að málinu.
            </Text>
          ),
        })

        setWorkingCase({
          ...workingCase,
          sharedWithProsecutorsOffice: undefined,
        })
        setSelectedSharingInstitutionId(null)

        updateCase(workingCase.id, parseNull('sharedWithProsecutorsOfficeId'))
      } else {
        setSharedCaseModal({
          open: true,
          title: `Mál ${workingCase.courtCaseNumber} hefur verið opnað fyrir öðru embætti`,
          text: (
            <Text>
              <Text fontWeight="semiBold" as="span">
                {(institution as ReactSelectOption).label}
              </Text>{' '}
              hefur nú fengið aðgang að málinu.
            </Text>
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
        })

        updateCase(
          workingCase.id,
          parseString(
            'sharedWithProsecutorsOfficeId',
            (institution as ReactSelectOption).value as string,
          ),
        )
      }
    }
  }

  const handleDateModification = async () => {
    const formattedValidToDate = modifiedValidToDate?.value
      ? formatISO(modifiedValidToDate.value, { representation: 'complete' })
      : undefined

    const formattedIsolationToDate = modifiedIsolationToDate?.value
      ? formatISO(modifiedIsolationToDate.value, { representation: 'complete' })
      : undefined

    const update = {
      validToDate: formattedValidToDate,
      isolationToDate: formattedIsolationToDate,
      caseModifiedExplanation: `${
        workingCase.caseModifiedExplanation
          ? workingCase.caseModifiedExplanation
          : ''
      }${createCaseModifiedExplanation(caseModifiedExplanation)}`,
    }

    if (
      formattedValidToDate ||
      formattedIsolationToDate ||
      caseModifiedExplanation
    ) {
      setWorkingCase({
        ...workingCase,
        ...update,
      })

      await updateCase(workingCase.id, { ...update })
      setIsCaseModificationConfirmed(true)
    }
  }

  const createCaseModifiedExplanation = (reason?: string) => {
    const now = new Date()

    return `${
      workingCase.caseModifiedExplanation ? '<br/><br/>' : ''
    }${capitalize(formatDate(now, 'PPPP', true) || '')} kl. ${formatDate(
      now,
      TIME_FORMAT,
    )} - ${user?.name}<br/>Ástæða: ${reason}`
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

  const isCaseModificationValid = () => {
    return (
      caseModifiedExplanation &&
      caseModifiedExplanation.trim() &&
      modifiedValidToDate?.isValid &&
      modifiedIsolationToDate?.isValid
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
          previousUrl={Constants.REQUEST_LIST_ROUTE}
          hideNextButton={
            user?.role !== UserRole.PROSECUTOR ||
            workingCase.decision ===
              CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
            workingCase.state === CaseState.REJECTED ||
            workingCase.state === CaseState.DISMISSED ||
            workingCase.isValidToDateInThePast ||
            Boolean(workingCase.childCase)
          }
          nextButtonText={`Framlengja ${
            workingCase.type === CaseType.CUSTODY
              ? 'gæslu'
              : workingCase.type === CaseType.TRAVEL_BAN
              ? 'farbann'
              : 'heimild'
          }`}
          onNextButtonClick={() => handleNextButtonClick()}
          nextIsLoading={isExtendingCase}
          infoBoxText={getInfoText(workingCase)}
        />
      </FormContentContainer>
      {shareCaseModal?.open && (
        <Modal
          title={shareCaseModal.title}
          text={shareCaseModal.text}
          primaryButtonText="Loka glugga"
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
                title={formatMessage(m.sections.modifyDatesModal.title)}
                text={formatMessage(m.sections.modifyDatesModal.text)}
                primaryButtonText={formatMessage(
                  m.sections.modifyDatesModal.primaryButtonText,
                )}
                isPrimaryButtonDisabled={!isCaseModificationValid()}
                handlePrimaryButtonClick={() => handleDateModification()}
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
                      m.sections.modifyDatesModal.reasonForChangePlaceholder,
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
                        m.sections.modifyDatesModal.modifiedValidToDateLabel,
                      )}
                      selectedDate={modifiedValidToDate?.value}
                      onChange={(value, valid) => {
                        setModifiedValidToDate({
                          value: value ?? modifiedValidToDate?.value,
                          isValid: valid,
                        })
                      }}
                      minDate={modifiedIsolationToDate?.value}
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
                          }}
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
                title={formatMessage(m.sections.modifyDatesModal.successTitle)}
                text={formatMessage(m.sections.modifyDatesModal.successText)}
                primaryButtonText={formatMessage(
                  m.sections.modifyDatesModal.primaryButtonText,
                )}
                handlePrimaryButtonClick={() => setIsModifyingDates(false)}
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
