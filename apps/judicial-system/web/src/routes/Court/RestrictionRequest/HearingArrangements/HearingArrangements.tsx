import React, { useEffect, useState } from 'react'
import InputMask from 'react-input-mask'
import { useIntl } from 'react-intl'

import {
  AlertMessage,
  Box,
  Input,
  Select,
  Text,
  Option,
  Tooltip,
} from '@island.is/island-ui/core'
import {
  FormFooter,
  PageLayout,
  CaseNumbers,
  BlueBox,
  FormContentContainer,
  Modal,
} from '@island.is/judicial-system-web/src/shared-components'
import { isNextDisabled } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { Validation } from '@island.is/judicial-system-web/src/utils/validate'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  Case,
  CaseState,
  CaseType,
  NotificationType,
  UserRole,
} from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import {
  CaseData,
  JudgeSubsections,
  ReactSelectOption,
  Sections,
  UserData,
} from '@island.is/judicial-system-web/src/types'
import {
  validateAndSendToServer,
  removeTabsValidateAndSet,
  setAndSendToServer,
  newSetAndSendDateToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { ValueType } from 'react-select/src/types'
import { useRouter } from 'next/router'
import DateTime from '@island.is/judicial-system-web/src/shared-components/DateTime/DateTime'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { rcHearingArrangements } from '@island.is/judicial-system-web/messages'

export const HearingArrangements: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [isStepIllegal, setIsStepIllegal] = useState<boolean>(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [defenderEmailErrorMessage, setDefenderEmailErrorMessage] = useState('')
  const [
    defenderPhoneNumberErrorMessage,
    setDefenderPhoneNumberErrorMessage,
  ] = useState('')
  const [courtDateIsValid, setCourtDateIsValid] = useState(true)

  const router = useRouter()
  const id = router.query.id

  const {
    updateCase,
    autofill,
    sendNotification,
    isSendingNotification,
  } = useCase()
  const { formatMessage } = useIntl()

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const { data: userData, loading: userLoading } = useQuery<UserData>(
    UsersQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const judges = (userData?.users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.JUDGE &&
        user.institution?.id === workingCase?.court?.id,
    )
    .map((judge: User) => {
      return { label: judge.name, value: judge.id }
    })

  const registrars = (userData?.users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.REGISTRAR &&
        user.institution?.id === workingCase?.court?.id,
    )
    .map((registrar: User) => {
      return { label: registrar.name, value: registrar.id }
    })

  const defaultJudge = judges?.find(
    (judge: Option) => judge.value === workingCase?.judge?.id,
  )

  const defaultRegistrar = registrars?.find(
    (registrar: Option) => registrar.value === workingCase?.registrar?.id,
  )

  useEffect(() => {
    document.title = 'Fyrirtaka - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      const theCase = data.case

      if (theCase.requestedCourtDate) {
        autofill('courtDate', theCase.requestedCourtDate, theCase)
      }

      setWorkingCase(theCase)
    }
  }, [setWorkingCase, workingCase, autofill, data])

  useEffect(() => {
    const requiredFields: { value: string; validations: Validation[] }[] = [
      {
        value: workingCase?.defenderEmail ?? '',
        validations: ['email-format'],
      },
      {
        value: workingCase?.defenderPhoneNumber ?? '',
        validations: ['phonenumber'],
      },
    ]

    if (workingCase) {
      setIsStepIllegal(
        isNextDisabled(requiredFields) ||
          !workingCase.judge ||
          !workingCase.registrar,
      )
    }
  }, [workingCase, isStepIllegal])

  const setJudge = (id: string) => {
    if (workingCase) {
      setAndSendToServer('judgeId', id, workingCase, setWorkingCase, updateCase)

      const judge = userData?.users.find((j) => j.id === id)

      setWorkingCase({ ...workingCase, judge: judge })
    }
  }

  const setRegistrar = (id: string) => {
    if (workingCase) {
      setAndSendToServer(
        'registrarId',
        id,
        workingCase,
        setWorkingCase,
        updateCase,
      )

      const registrar = userData?.users.find((r) => r.id === id)

      setWorkingCase({ ...workingCase, registrar: registrar })
    }
  }

  const handleNextButtonClick = () => {
    if (
      workingCase?.notifications?.find(
        (notification) => notification.type === NotificationType.COURT_DATE,
      )
    ) {
      router.push(`${Constants.IC_COURT_RECORD_ROUTE}/${workingCase.id}`)
    } else {
      setModalVisible(true)
    }
  }

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.HEARING_ARRANGEMENTS}
      isLoading={loading || userLoading}
      notFound={data?.case === undefined}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
      caseId={workingCase?.id}
    >
      {workingCase ? (
        <>
          <FormContentContainer>
            <Box marginBottom={10}>
              <Text as="h1" variant="h1">
                Fyrirtaka
              </Text>
            </Box>
            {workingCase.state === CaseState.DRAFT && (
              <Box marginBottom={8}>
                <AlertMessage
                  type="info"
                  title="Krafa hefur ekki verið staðfest af ákæranda"
                  message="Þú getur úthlutað fyrirtökutíma, dómsal og verjanda en ekki er hægt að halda áfram fyrr en ákærandi hefur staðfest kröfuna."
                />
              </Box>
            )}
            <Box component="section" marginBottom={7}>
              <Text variant="h2">{`Mál nr. ${workingCase.courtCaseNumber}`}</Text>
              <CaseNumbers workingCase={workingCase} />
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={3}>
                <Text as="h3" variant="h3">
                  Dómari{' '}
                  <Tooltip
                    text={formatMessage(
                      rcHearingArrangements.sections.setJudge.tooltip,
                    )}
                  />
                </Text>
              </Box>
              <Select
                name="judge"
                label="Veldu dómara"
                placeholder="Velja héraðsdómara"
                defaultValue={defaultJudge}
                options={judges}
                onChange={(selectedOption: ValueType<ReactSelectOption>) =>
                  setJudge(
                    (selectedOption as ReactSelectOption).value.toString(),
                  )
                }
                required
              />
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={3}>
                <Text as="h3" variant="h3">
                  Dómritari{' '}
                  <Tooltip
                    text={formatMessage(
                      rcHearingArrangements.sections.setRegistrar.tooltip,
                    )}
                  />
                </Text>
              </Box>
              <Select
                name="registrar"
                label="Veldu dómritara"
                placeholder="Velja dómritara"
                defaultValue={defaultRegistrar}
                options={registrars}
                onChange={(selectedOption: ValueType<ReactSelectOption>) =>
                  setRegistrar(
                    (selectedOption as ReactSelectOption).value.toString(),
                  )
                }
                required
              />
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  Skrá fyrirtökutíma
                </Text>
              </Box>
              <Box marginBottom={3}>
                <BlueBox>
                  <Box marginBottom={2}>
                    <DateTime
                      name="courtDate"
                      selectedDate={
                        workingCase.courtDate
                          ? new Date(workingCase.courtDate)
                          : undefined
                      }
                      minDate={new Date()}
                      onChange={(date: Date | undefined, valid: boolean) => {
                        newSetAndSendDateToServer(
                          'courtDate',
                          date,
                          valid,
                          workingCase,
                          setWorkingCase,
                          setCourtDateIsValid,
                          updateCase,
                        )
                      }}
                      blueBox={false}
                      required
                    />
                  </Box>
                  <Input
                    data-testid="courtroom"
                    name="courtroom"
                    label="Dómsalur"
                    autoComplete="off"
                    defaultValue={workingCase.courtRoom}
                    placeholder="Skráðu inn dómsal"
                    onChange={(event) =>
                      removeTabsValidateAndSet(
                        'courtRoom',
                        event,
                        [],
                        workingCase,
                        setWorkingCase,
                      )
                    }
                    onBlur={(event) =>
                      validateAndSendToServer(
                        'courtRoom',
                        event.target.value,
                        [],
                        workingCase,
                        updateCase,
                      )
                    }
                  />
                </BlueBox>
              </Box>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  Skipaður verjandi
                </Text>
              </Box>
              <BlueBox>
                <Box marginBottom={3}>
                  <Input
                    name="defenderName"
                    label="Nafn verjanda"
                    autoComplete="off"
                    defaultValue={workingCase.defenderName}
                    placeholder="Fullt nafn"
                    onChange={(event) =>
                      removeTabsValidateAndSet(
                        'defenderName',
                        event,
                        [],
                        workingCase,
                        setWorkingCase,
                      )
                    }
                    onBlur={(event) =>
                      validateAndSendToServer(
                        'defenderName',
                        event.target.value,
                        [],
                        workingCase,
                        updateCase,
                      )
                    }
                  />
                </Box>
                <Box marginBottom={3}>
                  <Input
                    name="defenderEmail"
                    label="Netfang verjanda"
                    autoComplete="off"
                    defaultValue={workingCase.defenderEmail}
                    placeholder="Netfang"
                    errorMessage={defenderEmailErrorMessage}
                    hasError={defenderEmailErrorMessage !== ''}
                    onChange={(event) =>
                      removeTabsValidateAndSet(
                        'defenderEmail',
                        event,
                        ['email-format'],
                        workingCase,
                        setWorkingCase,
                        defenderEmailErrorMessage,
                        setDefenderEmailErrorMessage,
                      )
                    }
                    onBlur={(event) =>
                      validateAndSendToServer(
                        'defenderEmail',
                        event.target.value,
                        ['email-format'],
                        workingCase,
                        updateCase,
                        setDefenderEmailErrorMessage,
                      )
                    }
                  />
                </Box>
                <InputMask
                  mask="999-9999"
                  maskPlaceholder={null}
                  onChange={(event) =>
                    removeTabsValidateAndSet(
                      'defenderPhoneNumber',
                      event,
                      ['phonenumber'],
                      workingCase,
                      setWorkingCase,
                      defenderPhoneNumberErrorMessage,
                      setDefenderPhoneNumberErrorMessage,
                    )
                  }
                  onBlur={(event) =>
                    validateAndSendToServer(
                      'defenderPhoneNumber',
                      event.target.value,
                      ['phonenumber'],
                      workingCase,
                      updateCase,
                      setDefenderPhoneNumberErrorMessage,
                    )
                  }
                >
                  <Input
                    name="defenderPhoneNumber"
                    label="Símanúmer verjanda"
                    autoComplete="off"
                    defaultValue={workingCase.defenderPhoneNumber}
                    placeholder="Símanúmer"
                    errorMessage={defenderPhoneNumberErrorMessage}
                    hasError={defenderPhoneNumberErrorMessage !== ''}
                  />
                </InputMask>
              </BlueBox>
            </Box>
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/${workingCase.id}`}
              onNextButtonClick={handleNextButtonClick}
              nextIsDisabled={
                workingCase.state === CaseState.DRAFT ||
                isStepIllegal ||
                !courtDateIsValid
              }
            />
          </FormContentContainer>
          {modalVisible && (
            <Modal
              title={formatMessage(
                workingCase.type === CaseType.CUSTODY
                  ? rcHearingArrangements.modal.custodyCases.heading
                  : rcHearingArrangements.modal.travelBanCases.heading,
              )}
              text={formatMessage(
                workingCase.type === CaseType.CUSTODY
                  ? rcHearingArrangements.modal.custodyCases.text
                  : rcHearingArrangements.modal.travelBanCases.text,
              )}
              isPrimaryButtonLoading={isSendingNotification}
              handleSecondaryButtonClick={() => {
                router.push(`${Constants.COURT_RECORD_ROUTE}/${id}`)
              }}
              handlePrimaryButtonClick={async () => {
                const notificationSent = await sendNotification(
                  workingCase.id,
                  NotificationType.COURT_DATE,
                )

                if (notificationSent) {
                  router.push(`${Constants.COURT_RECORD_ROUTE}/${id}`)
                }
              }}
              primaryButtonText={formatMessage(
                rcHearingArrangements.modal.shared.primaryButtonText,
              )}
              secondaryButtonText={formatMessage(
                rcHearingArrangements.modal.shared.secondaryButtonText,
              )}
            />
          )}
        </>
      ) : null}
    </PageLayout>
  )
}

export default HearingArrangements
