import React, { useRef, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import Modal from '../../../../shared-components/Modal/Modal'
import {
  Text,
  GridRow,
  GridColumn,
  Input,
  Box,
  Select,
  DatePicker,
  GridContainer,
  RadioButton,
  Tooltip,
} from '@island.is/island-ui/core'
import { validate, Validation } from '../../../../utils/validate'
import { isDirty, isNextDisabled } from '../../../../utils/stepHelper'
import isValid from 'date-fns/isValid'
import parseISO from 'date-fns/parseISO'
import formatISO from 'date-fns/formatISO'
import { FormFooter } from '../../../../shared-components/FormFooter'
import { useParams } from 'react-router-dom'
import * as Constants from '../../../../utils/constants'
import { TIME_FORMAT } from '@island.is/judicial-system/formatters'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  padTimeWithZero,
  parseString,
  parseTime,
  parseTransition,
  replaceTabsOnChange,
} from '@island.is/judicial-system-web/src/utils/formatters'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components/PageLayout/PageLayout'
import {
  Case,
  UpdateCase,
  CaseState,
  NotificationType,
  CaseGender,
  TransitionCase,
  CaseTransition,
} from '@island.is/judicial-system/types'
import { gql, useMutation, useQuery } from '@apollo/client'
import {
  CaseQuery,
  SendNotificationMutation,
  TransitionCaseMutation,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/src/graphql'
import {
  ProsecutorSubsections,
  ReactSelectOption,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { ValueType } from 'react-select/src/types'
import * as styles from './StepOne.treat'
import TimeInputField from '@island.is/judicial-system-web/src/shared-components/TimeInputField/TimeInputField'
import InputMask from 'react-input-mask'
import {
  setAndSendDateToServer,
  setAndSendToServer,
  validateAndSendTimeToServer,
  validateAndSendToServer,
  removeTabsValidateAndSet,
  validateAndSetTime,
} from '@island.is/judicial-system-web/src/utils/formHelper'

export const CreateCaseMutation = gql`
  mutation CreateCaseMutation($input: CreateCaseInput!) {
    createCase(input: $input) {
      id
      created
      modified
      state
      policeCaseNumber
      accusedNationalId
      accusedName
      accusedAddress
      accusedGender
      requestedDefenderName
      requestedDefenderEmail
      court
      arrestDate
      requestedCourtDate
      requestedCustodyEndDate
      lawsBroken
      custodyProvisions
      requestedCustodyRestrictions
      caseFacts
      witnessAccounts
      investigationProgress
      legalArguments
      comments
      prosecutor {
        name
        title
      }
      courtCaseNumber
      courtDate
      isCourtDateInThePast
      courtRoom
      defenderName
      defenderEmail
      courtStartTime
      courtEndTime
      courtAttendees
      policeDemands
      accusedPlea
      litigationPresentations
      ruling
      rejecting
      custodyEndDate
      isCustodyEndDateInThePast
      custodyRestrictions
      accusedAppealDecision
      accusedAppealAnnouncement
      prosecutorAppealDecision
      prosecutorAppealAnnouncement
      judge {
        name
        title
      }
    }
  }
`

interface CaseData {
  case?: Case
}

export const StepOne: React.FC = () => {
  const history = useHistory()
  const [workingCase, setWorkingCase] = useState<Case>()
  const [isStepIllegal, setIsStepIllegal] = useState<boolean>(true)

  const [
    policeCaseNumberErrorMessage,
    setPoliceCaseNumberErrorMessage,
  ] = useState<string>('')

  const [nationalIdErrorMessage, setNationalIdErrorMessage] = useState<string>(
    '',
  )

  const [accusedNameErrorMessage, setAccusedNameErrorMessage] = useState<
    string
  >('')

  const [accusedAddressErrorMessage, setAccusedAddressErrorMessage] = useState<
    string
  >('')

  const [
    requestedDefenderEmailErrorMessage,
    setRequestedDefenderEmailErrorMessage,
  ] = useState<string>('')

  const [arrestDateErrorMessage, setArrestDateErrorMessage] = useState<string>(
    '',
  )

  const [arrestTimeErrorMessage, setArrestTimeErrorMessage] = useState<string>(
    '',
  )

  const [
    requestedCourtDateErrorMessage,
    setRequestedCourtDateErrorMessage,
  ] = useState<string>('')

  const [
    requestedCourtTimeErrorMessage,
    setRequestedCourtTimeErrorMessage,
  ] = useState<string>('')

  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const { id } = useParams<{ id: string }>()

  const policeCaseNumberRef = useRef<HTMLInputElement>(null)
  const accusedNationalIdRef = useRef<HTMLInputElement>(null)
  const defenderEmailRef = useRef<HTMLInputElement>(null)
  const arrestTimeRef = useRef<HTMLInputElement>(null)
  const requestedCourtTimeRef = useRef<HTMLInputElement>(null)
  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const courts = [
    {
      label: 'Héraðsdómur Reykjavíkur',
      value: 0,
    },
    {
      label: 'Héraðsdómur Vesturlands',
      value: 1,
    },
    {
      label: 'Héraðsdómur Vestfjarða',
      value: 2,
    },
    {
      label: 'Héraðsdómur Norðurlands vestra',
      value: 3,
    },
    {
      label: 'Héraðsdómur Norðurlands eystra',
      value: 4,
    },
    {
      label: 'Héraðsdómur Austurlands',
      value: 5,
    },
    {
      label: 'Héraðsdómur Reykjaness',
      value: 6,
    },
  ]

  const defaultCourt = courts.filter(
    (court) => court.label === workingCase?.court,
  )

  const [createCaseMutation, { loading: createLoading }] = useMutation(
    CreateCaseMutation,
  )

  const createCaseIfPossible = async () => {
    const isPossibleToSave =
      createLoading === false &&
      workingCase?.id === '' &&
      policeCaseNumberRef.current?.value !== '' &&
      accusedNationalIdRef.current?.value !== ''

    if (isPossibleToSave) {
      const { data } = await createCaseMutation({
        variables: {
          input: {
            policeCaseNumber: policeCaseNumberRef.current?.value,
            accusedNationalId: accusedNationalIdRef.current?.value.replace(
              '-',
              '',
            ),
            court: workingCase?.court,
            accusedName: workingCase?.accusedName,
            accusedAddress: workingCase?.accusedAddress,
            requestedDefenderName: workingCase?.requestedDefenderName,
            requestedDefenderEmail: workingCase?.requestedDefenderEmail,
            accusedGender: workingCase?.accusedGender,
            arrestDate: workingCase?.arrestDate,
            requestedCourtDate: workingCase?.requestedCourtDate,
          },
        },
      })

      const resCase: Case = data?.createCase

      if (resCase) {
        history.replace(`${Constants.SINGLE_REQUEST_BASE_ROUTE}/${resCase.id}`)

        setWorkingCase({
          ...workingCase,
          id: resCase.id,
          accusedNationalId:
            accusedNationalIdRef.current?.value.replace('-', '') || '',
          policeCaseNumber: policeCaseNumberRef.current?.value || '',
          created: resCase.created,
          modified: resCase.modified,
          state: resCase.state,
        })
      }
    }
  }

  const [updateCaseMutation] = useMutation(UpdateCaseMutation)

  const updateCase = async (id: string, updateCase: UpdateCase) => {
    // Only update if id has been set
    if (!id) {
      return null
    }
    const { data } = await updateCaseMutation({
      variables: { input: { id, ...updateCase } },
    })

    const resCase = data?.updateCase

    if (resCase) {
      // Do smoething with the result. In particular, we want th modified timestamp passed between
      // the client and the backend so that we can handle multiple simultanious updates.
    }

    return resCase
  }

  const [transitionCaseMutation] = useMutation(TransitionCaseMutation)

  const transitionCase = async (id: string, transitionCase: TransitionCase) => {
    const { data } = await transitionCaseMutation({
      variables: { input: { id, ...transitionCase } },
    })

    return data?.transitionCase
  }

  const [
    sendNotificationMutation,
    { loading: isSendingNotification },
  ] = useMutation(SendNotificationMutation)

  const sendNotification = async (id: string) => {
    const { data } = await sendNotificationMutation({
      variables: {
        input: {
          caseId: id,
          type: NotificationType.HEADS_UP,
        },
      },
    })

    return data?.sendNotification?.notificationSent
  }

  const handleNextButtonClick: () => Promise<boolean> = async () => {
    if (!workingCase) {
      return false
    }

    switch (workingCase.state) {
      case CaseState.NEW:
        try {
          // Parse the transition request
          const transitionRequest = parseTransition(
            workingCase.modified,
            CaseTransition.OPEN,
          )

          // Transition the case
          const resCase = await transitionCase(
            workingCase.id ?? id,
            transitionRequest,
          )

          if (!resCase) {
            return false
          }

          setWorkingCase({
            ...workingCase,
            state: resCase.state,
            prosecutor: resCase.prosecutor,
          })

          return true
        } catch (e) {
          console.log(e)

          return false
        }
      case CaseState.DRAFT:
      case CaseState.SUBMITTED:
        return true
      default:
        return false
    }
  }

  useEffect(() => {
    document.title = 'Grunnupplýsingar - Réttarvörslugátt'
  }, [])

  // Run this if id is in url, i.e. if user is opening an existing request.
  useEffect(() => {
    if (id && !workingCase && data?.case) {
      setWorkingCase(data?.case)
    } else if (!id && !workingCase) {
      setWorkingCase({
        id: '',
        created: '',
        modified: '',
        state: CaseState.DRAFT,
        policeCaseNumber: '',
        accusedNationalId: '',
        accusedName: '',
        accusedAddress: '',
        requestedDefenderName: '',
        requestedDefenderEmail: '',
        accusedGender: undefined,
        court: 'Héraðsdómur Reykjavíkur',
        arrestDate: undefined,
        requestedCourtDate: undefined,
      })
    }
  }, [id, workingCase, setWorkingCase, data])

  /**
   * Run this to validate form after each change
   *
   * This can't be done in the render function because the time refs will always be null
   * until the user clicks the time inputs and then the continue button becomes enabled.
   *  */
  useEffect(() => {
    if (workingCase) {
      setIsStepIllegal(
        isNextDisabled([
          {
            value: workingCase.policeCaseNumber,
            validations: ['empty', 'police-casenumber-format'],
          },
          {
            value: workingCase.accusedNationalId || '',
            validations: ['empty', 'national-id'],
          },
          { value: workingCase.accusedName || '', validations: ['empty'] },
          { value: workingCase.accusedAddress || '', validations: ['empty'] },
          {
            value: workingCase.requestedDefenderEmail || '',
            validations: ['email-format'],
          },
          { value: workingCase.arrestDate || '', validations: ['empty'] },
          {
            value: arrestTimeRef.current?.value || '',
            validations: ['empty', 'time-format'],
          },
          {
            value: workingCase.requestedCourtDate || '',
            validations: ['empty'],
          },
          {
            value: requestedCourtTimeRef.current?.value || '',
            validations: ['empty', 'time-format'],
          },
        ]),
      )
    } else {
      setIsStepIllegal(true)
    }
  }, [
    workingCase,
    setIsStepIllegal,
    arrestTimeRef.current?.value,
    requestedCourtTimeRef.current?.value,
  ])

  const onBlurCreate = (
    field: string,
    text: string,
    validations: Validation[],
    setErrorMessage: (value: React.SetStateAction<string>) => void,
  ) => {
    if (!workingCase) {
      return
    }

    const error = validations
      .map((v) => validate(text, v))
      .find((v) => v.isValid === false)

    if (error) {
      setErrorMessage(error.errorMessage)
      return
    }

    if (workingCase.id !== '') {
      updateCase(workingCase.id, parseString(field, text))
    } else {
      createCaseIfPossible()
    }
  }

  return (
    <PageLayout
      activeSection={Sections.PROSECUTOR}
      activeSubSection={ProsecutorSubsections.CREATE_DETENTION_REQUEST_STEP_ONE}
      isLoading={loading}
      notFound={id !== undefined && data?.case === undefined}
    >
      {workingCase ? (
        <>
          <Box marginBottom={10}>
            <Text as="h1" variant="h1">
              Krafa um gæsluvarðhald
            </Text>
          </Box>
          <Box component="section" marginBottom={7}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                LÖKE málsnúmer
              </Text>
            </Box>
            <InputMask
              //This is temporary until we start reading LÖKE case numbers from LÖKE
              mask="999-9999-9999999"
              maskPlaceholder={null}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'policeCaseNumber',
                  event,
                  ['empty', 'police-casenumber-format'],
                  workingCase,
                  setWorkingCase,
                  policeCaseNumberErrorMessage,
                  setPoliceCaseNumberErrorMessage,
                )
              }
              onBlur={(event) =>
                onBlurCreate(
                  'policeCaseNumber',
                  event.target.value,
                  ['empty', 'police-casenumber-format'],
                  setPoliceCaseNumberErrorMessage,
                )
              }
            >
              <Input
                data-testid="policeCaseNumber"
                name="policeCaseNumber"
                label="Slá inn LÖKE málsnúmer"
                placeholder="007-2020-X"
                defaultValue={workingCase.policeCaseNumber}
                ref={policeCaseNumberRef}
                errorMessage={policeCaseNumberErrorMessage}
                hasError={policeCaseNumberErrorMessage !== ''}
                required
              />
            </InputMask>
          </Box>
          <Box component="section" marginBottom={3}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Sakborningur
              </Text>
            </Box>
            <Box marginBottom={3}>
              <InputMask
                mask="999999-9999"
                maskPlaceholder={null}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'accusedNationalId',
                    event,
                    ['empty', 'national-id'],
                    workingCase,
                    setWorkingCase,
                    nationalIdErrorMessage,
                    setNationalIdErrorMessage,
                  )
                }
                onBlur={(event) =>
                  onBlurCreate(
                    'accusedNationalId',
                    event.target.value,
                    ['empty', 'national-id'],
                    setNationalIdErrorMessage,
                  )
                }
              >
                <Input
                  data-testid="nationalId"
                  name="nationalId"
                  label="Kennitala"
                  placeholder="Kennitala"
                  defaultValue={workingCase.accusedNationalId}
                  ref={accusedNationalIdRef}
                  errorMessage={nationalIdErrorMessage}
                  hasError={nationalIdErrorMessage !== ''}
                  required
                />
              </InputMask>
            </Box>
            <Box marginBottom={3}>
              <Input
                data-testid="accusedName"
                name="accusedName"
                label="Fullt nafn"
                placeholder="Fullt nafn"
                defaultValue={workingCase.accusedName}
                errorMessage={accusedNameErrorMessage}
                hasError={accusedNameErrorMessage !== ''}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'accusedName',
                    event,
                    ['empty'],
                    workingCase,
                    setWorkingCase,
                    accusedNameErrorMessage,
                    setAccusedNameErrorMessage,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'accusedName',
                    event.target.value,
                    ['empty'],
                    workingCase,
                    updateCase,
                    setAccusedNameErrorMessage,
                  )
                }
                required
              />
            </Box>
            <Box marginBottom={3}>
              <Input
                data-testid="accusedAddress"
                name="accusedAddress"
                label="Lögheimili/dvalarstaður"
                placeholder="Lögheimili eða dvalarstaður"
                defaultValue={workingCase.accusedAddress}
                errorMessage={accusedAddressErrorMessage}
                hasError={accusedAddressErrorMessage !== ''}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'accusedAddress',
                    event,
                    ['empty'],
                    workingCase,
                    setWorkingCase,
                    accusedAddressErrorMessage,
                    setAccusedAddressErrorMessage,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'accusedAddress',
                    event.target.value,
                    ['empty'],
                    workingCase,
                    updateCase,
                    setAccusedAddressErrorMessage,
                  )
                }
                required
              />
            </Box>
          </Box>
          <Box component="section" marginBottom={7}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Kyn{' '}
                <Text as="span" color="red600" fontWeight="semiBold">
                  *
                </Text>
              </Text>
            </Box>
            <GridContainer>
              <GridRow>
                <GridColumn className={styles.genderColumn}>
                  <RadioButton
                    name="accused-gender"
                    id="genderMale"
                    label="Karl"
                    checked={workingCase.accusedGender === CaseGender.MALE}
                    onChange={() =>
                      setAndSendToServer(
                        'accusedGender',
                        CaseGender.MALE,
                        workingCase,
                        setWorkingCase,
                        updateCase,
                      )
                    }
                    large
                  />
                </GridColumn>
                <GridColumn className={styles.genderColumn}>
                  <RadioButton
                    name="accused-gender"
                    id="genderFemale"
                    label="Kona"
                    checked={workingCase.accusedGender === CaseGender.FEMALE}
                    onChange={() =>
                      setAndSendToServer(
                        'accusedGender',
                        CaseGender.FEMALE,
                        workingCase,
                        setWorkingCase,
                        updateCase,
                      )
                    }
                    large
                  />
                </GridColumn>
                <GridColumn className={styles.genderColumn}>
                  <RadioButton
                    name="accused-gender"
                    id="genderOther"
                    label="Annað"
                    checked={workingCase.accusedGender === CaseGender.OTHER}
                    onChange={() =>
                      setAndSendToServer(
                        'accusedGender',
                        CaseGender.OTHER,
                        workingCase,
                        setWorkingCase,
                        updateCase,
                      )
                    }
                    large
                  />
                </GridColumn>
              </GridRow>
            </GridContainer>
          </Box>
          <Box component="section" marginBottom={7}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Verjandi
              </Text>
            </Box>
            <Box marginBottom={3}>
              <Input
                name="requestedDefenderName"
                label="Nafn verjanda"
                placeholder="Fullt nafn"
                defaultValue={workingCase.requestedDefenderName}
                disabled={isDirty(workingCase.defenderName)}
                icon={
                  isDirty(workingCase.defenderName) ? 'lockClosed' : undefined
                }
                iconType="outline"
                onBlur={(evt) => {
                  if (workingCase.requestedDefenderName !== evt.target.value) {
                    setWorkingCase({
                      ...workingCase,
                      requestedDefenderName: evt.target.value,
                    })

                    updateCase(
                      workingCase.id,
                      parseString('requestedDefenderName', evt.target.value),
                    )
                  }
                }}
                onChange={replaceTabsOnChange}
              />
            </Box>
            <Input
              name="requestedDefenderEmail"
              label="Netfang verjanda"
              placeholder="Netfang"
              disabled={isDirty(workingCase.defenderEmail)}
              icon={
                isDirty(workingCase.defenderEmail) ? 'lockClosed' : undefined
              }
              iconType="outline"
              ref={defenderEmailRef}
              defaultValue={workingCase.requestedDefenderEmail}
              errorMessage={requestedDefenderEmailErrorMessage}
              hasError={requestedDefenderEmailErrorMessage !== ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'requestedDefenderEmail',
                  event,
                  ['email-format'],
                  workingCase,
                  setWorkingCase,
                  requestedDefenderEmailErrorMessage,
                  setRequestedDefenderEmailErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'requestedDefenderEmail',
                  event.target.value,
                  ['email-format'],
                  workingCase,
                  updateCase,
                  setRequestedDefenderEmailErrorMessage,
                )
              }
            />
            {(isDirty(workingCase.defenderName) ||
              isDirty(workingCase.defenderEmail)) && (
              <Box marginTop={1}>
                <Text variant="eyebrow">Verjanda hefur verið úthlutað</Text>
              </Box>
            )}
          </Box>
          <Box component="section" marginBottom={7}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Dómstóll
              </Text>
            </Box>
            <Select
              name="court"
              label="Veldu dómstól"
              defaultValue={{
                label:
                  defaultCourt.length > 0
                    ? defaultCourt[0].label
                    : courts[0].label,
                value:
                  defaultCourt.length > 0
                    ? defaultCourt[0].value
                    : courts[0].value,
              }}
              options={courts}
              onChange={(selectedOption: ValueType<ReactSelectOption>) =>
                setAndSendToServer(
                  'court',
                  (selectedOption as ReactSelectOption).label,
                  workingCase,
                  setWorkingCase,
                  updateCase,
                )
              }
            />
          </Box>
          <Box component="section" marginBottom={7}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Tími handtöku
              </Text>
            </Box>
            <GridRow>
              <GridColumn span="5/8">
                <DatePicker
                  id="arrestDate"
                  label="Veldu dagsetningu"
                  placeholderText="Veldu dagsetningu"
                  locale="is"
                  errorMessage={arrestDateErrorMessage}
                  hasError={arrestDateErrorMessage !== ''}
                  selected={
                    workingCase.arrestDate
                      ? new Date(workingCase.arrestDate)
                      : null
                  }
                  handleChange={(date) =>
                    setAndSendDateToServer(
                      'arrestDate',
                      workingCase.arrestDate,
                      date,
                      workingCase,
                      setWorkingCase,
                      updateCase,
                      setArrestDateErrorMessage,
                    )
                  }
                  handleCloseCalendar={(date: Date | null) => {
                    if (date === null || !isValid(date)) {
                      setArrestDateErrorMessage('Reitur má ekki vera tómur')
                    }
                  }}
                  required
                />
              </GridColumn>
              <GridColumn span="3/8">
                <TimeInputField
                  disabled={!workingCase.arrestDate}
                  onChange={(evt) =>
                    validateAndSetTime(
                      'arrestDate',
                      workingCase.arrestDate,
                      evt.target.value,
                      ['empty', 'time-format'],
                      workingCase,
                      setWorkingCase,
                      arrestTimeErrorMessage,
                      setArrestTimeErrorMessage,
                    )
                  }
                  onBlur={(evt) =>
                    validateAndSendTimeToServer(
                      'arrestDate',
                      workingCase.arrestDate,
                      evt.target.value,
                      ['empty', 'time-format'],
                      workingCase,
                      updateCase,
                      setArrestTimeErrorMessage,
                    )
                  }
                >
                  <Input
                    data-testid="arrestTime"
                    name="arrestTime"
                    label="Tímasetning"
                    placeholder="Settu inn tíma"
                    ref={arrestTimeRef}
                    errorMessage={arrestTimeErrorMessage}
                    hasError={arrestTimeErrorMessage !== ''}
                    defaultValue={
                      workingCase.arrestDate?.includes('T')
                        ? formatDate(workingCase.arrestDate, TIME_FORMAT)
                        : undefined
                    }
                    required
                  />
                </TimeInputField>
              </GridColumn>
            </GridRow>
          </Box>
          <Box component="section" marginBottom={7}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Ósk um fyrirtökudag og tíma{' '}
                <Tooltip text='Vinsamlegast sláðu tímann sem þú óskar eftir að málið verður tekið fyrir. Gáttin birtir tímann sem: "Eftir kl." tíminn sem þú slærð inn. Það þarf því ekki að velja nákvæma tímasetningu hvenær óskað er eftir fyrirtöku, heldur bara eftir hvaða tíma myndi henta að taka málið fyrir.' />
              </Text>
            </Box>
            <GridRow>
              <GridColumn span="5/8">
                <DatePicker
                  id="reqCourtDate"
                  label="Veldu dagsetningu"
                  placeholderText="Veldu dagsetningu"
                  locale="is"
                  errorMessage={requestedCourtDateErrorMessage}
                  icon={workingCase.courtDate ? 'lockClosed' : undefined}
                  minDate={new Date()}
                  selected={
                    workingCase.requestedCourtDate
                      ? parseISO(workingCase.requestedCourtDate.toString())
                      : null
                  }
                  disabled={Boolean(workingCase.courtDate)}
                  handleChange={(date) =>
                    setAndSendDateToServer(
                      'requestedCourtDate',
                      workingCase.requestedCourtDate,
                      date,
                      workingCase,
                      setWorkingCase,
                      updateCase,
                      setRequestedCourtDateErrorMessage,
                    )
                  }
                  handleCloseCalendar={(date: Date | null) => {
                    if (date === null || !isValid(date)) {
                      setRequestedCourtDateErrorMessage(
                        'Reitur má ekki vera tómur',
                      )
                    }
                  }}
                  required
                />
              </GridColumn>
              <GridColumn span="3/8">
                <TimeInputField
                  disabled={
                    !workingCase.requestedCourtDate ||
                    Boolean(workingCase.courtDate)
                  }
                  onChange={(evt) =>
                    validateAndSetTime(
                      'requestedCourtDate',
                      workingCase.requestedCourtDate,
                      evt.target.value,
                      ['empty', 'time-format'],
                      workingCase,
                      setWorkingCase,
                      requestedCourtTimeErrorMessage,
                      setRequestedCourtTimeErrorMessage,
                    )
                  }
                  onBlur={(evt) =>
                    validateAndSendTimeToServer(
                      'requestedCourtDate',
                      workingCase.requestedCourtDate,
                      evt.target.value,
                      ['empty', 'time-format'],
                      workingCase,
                      updateCase,
                      setRequestedCourtTimeErrorMessage,
                    )
                  }
                >
                  <Input
                    data-testid="requestedCourtDate"
                    name="requestedCourtDate"
                    label="Ósk um tíma"
                    placeholder="Settu inn tíma dags"
                    errorMessage={requestedCourtTimeErrorMessage}
                    hasError={requestedCourtTimeErrorMessage !== ''}
                    defaultValue={
                      workingCase.requestedCourtDate?.includes('T')
                        ? formatDate(
                            workingCase.requestedCourtDate,
                            TIME_FORMAT,
                          )
                        : undefined
                    }
                    icon={workingCase.courtDate ? 'lockClosed' : undefined}
                    iconType="outline"
                    ref={requestedCourtTimeRef}
                    required
                  />
                </TimeInputField>
              </GridColumn>
            </GridRow>
            {workingCase.courtDate && (
              <Box marginTop={1}>
                <Text variant="eyebrow">
                  Fyrirtökudegi og tíma hefur verið úthlutað
                </Text>
              </Box>
            )}
          </Box>
          <FormFooter
            onNextButtonClick={async () => {
              const caseTransitioned = await handleNextButtonClick()
              if (caseTransitioned) {
                if (
                  workingCase.notifications?.find(
                    (notification) =>
                      notification.type === NotificationType.HEADS_UP,
                  )
                ) {
                  history.push(
                    `${Constants.STEP_TWO_ROUTE}/${workingCase.id ?? id}`,
                  )
                } else {
                  setModalVisible(true)
                }
              } else {
                // TODO: Handle error
              }
            }}
            nextIsDisabled={isStepIllegal}
          />
          {modalVisible && (
            <Modal
              title="Viltu senda tilkynningu?"
              text="Með því að senda tilkynningu á dómara á vakt um að krafa um gæsluvarðhald sé í vinnslu flýtir það fyrir málsmeðferð og allir aðilar eru upplýstir um stöðu mála."
              primaryButtonText="Senda tilkynningu"
              secondaryButtonText="Halda áfram með kröfu"
              handleClose={() => setModalVisible(false)}
              handleSecondaryButtonClick={() =>
                history.push(
                  `${Constants.STEP_TWO_ROUTE}/${workingCase.id ?? id}`,
                )
              }
              handlePrimaryButtonClick={async () => {
                const notificationSent = await sendNotification(
                  workingCase.id ?? id,
                )

                if (notificationSent) {
                  history.push(
                    `${Constants.STEP_TWO_ROUTE}/${workingCase.id ?? id}`,
                  )
                }
              }}
              isPrimaryButtonLoading={isSendingNotification}
            />
          )}
        </>
      ) : null}
    </PageLayout>
  )
}

export default StepOne
