import React, { useRef, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import Modal from '../../../../shared-components/Modal/Modal'
import {
  Text,
  GridContainer,
  GridRow,
  GridColumn,
  Input,
  Box,
  Select,
  Option,
  DatePicker,
} from '@island.is/island-ui/core'
import { Case } from '../../../../types'
import * as api from '../../../../api'
import { validate, Validation } from '../../../../utils/validate'
import {
  updateState,
  autoSave,
  isNextDisabled,
} from '../../../../utils/stepHelper'
import { isValid, parseISO, formatISO } from 'date-fns'
import { isNull } from 'lodash'
import { FormFooter } from '../../../../shared-components/FormFooter'
import { useParams } from 'react-router-dom'
import * as Constants from '../../../../utils/constants'
import { TIME_FORMAT } from '@island.is/judicial-system/formatters'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  parseString,
  parseTime,
} from '@island.is/judicial-system-web/src/utils/formatters'
import { ProcessPageLayout } from '@island.is/judicial-system-web/src/shared-components/PageLayout/PageLayout'

export const StepOne: React.FC = () => {
  const history = useHistory()
  const [workingCase, setWorkingCase] = useState<Case>(null)
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
  const [arrestDateErrorMessage, setArrestDateErrorMessage] = useState<string>(
    '',
  )
  const [arrestTimeErrorMessage, setArrestTimeErrorMessage] = useState<string>(
    '',
  )
  const [
    requestedCourtTimeErrorMessage,
    setRequestedCourtTimeErrorMessage,
  ] = useState<string>('')
  const [modalVisible, setModalVisible] = useState(false)
  const [isSendingNotification, setIsSendingNotification] = useState(false)

  const { id } = useParams<{ id: string }>()

  const policeCaseNumberRef = useRef<HTMLInputElement>()
  const accusedNationalIdRef = useRef<HTMLInputElement>()
  const arrestTimeRef = useRef<HTMLInputElement>()
  const requestedCourtTimeRef = useRef<HTMLInputElement>()

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

  const createCaseIfPossible = async () => {
    const isPossibleToSave =
      workingCase.id === '' &&
      policeCaseNumberRef.current.value !== '' &&
      accusedNationalIdRef.current.value !== ''

    if (isPossibleToSave) {
      const caseId = await api.createCase({
        policeCaseNumber: policeCaseNumberRef.current.value,
        accusedNationalId: accusedNationalIdRef.current.value.replace('-', ''),
        court: workingCase.court,
      })

      window.localStorage.setItem(
        'workingCase',
        JSON.stringify({
          ...workingCase,
          id: caseId,
          accusedNationalId: accusedNationalIdRef.current.value.replace(
            '-',
            '',
          ),
          policeCaseNumber: policeCaseNumberRef.current.value,
        }),
      )

      setWorkingCase({
        ...workingCase,
        id: caseId,
        accusedNationalId: accusedNationalIdRef.current.value.replace('-', ''),
        policeCaseNumber: policeCaseNumberRef.current.value,
      })
    }
  }

  useEffect(() => {
    document.title = 'Grunnupplýsingar - Réttarvörslugátt'
  }, [])

  // Run if id is not in url, i.e. if the user is creating a request.
  useEffect(() => {
    const caseDraft = window.localStorage.getItem('workingCase')

    if (caseDraft !== 'undefined' && !workingCase && !id) {
      const caseDraftJSON = JSON.parse(caseDraft || '{}')

      setWorkingCase({
        id: caseDraftJSON.id ?? '',
        created: caseDraftJSON.created ?? '',
        modified: caseDraftJSON.modified ?? '',
        state: caseDraftJSON.state ?? '',
        policeCaseNumber: caseDraftJSON.policeCaseNumber ?? '',
        accusedNationalId: caseDraftJSON.accusedNationalId ?? '',
        accusedName: caseDraftJSON.accusedName ?? '',
        accusedAddress: caseDraftJSON.accusedAddress ?? '',
        court: caseDraftJSON.court ?? 'Héraðsdómur Reykjavíkur',
        arrestDate: caseDraftJSON.arrestDate ?? null,
        requestedCourtDate: caseDraftJSON.requestedCourtDate ?? null,
        requestedCustodyEndDate: caseDraftJSON.requestedCustodyEndDate ?? null,
        lawsBroken: caseDraftJSON.lawsBroken ?? '',
        custodyProvisions: caseDraftJSON.custodyProvisions ?? [],
        requestedCustodyRestrictions:
          caseDraftJSON.requestedCustodyRestrictions ?? [],
        caseFacts: caseDraftJSON.caseFacts ?? '',
        witnessAccounts: caseDraftJSON.witnessAccounts ?? '',
        investigationProgress: caseDraftJSON.investigationProgress ?? '',
        legalArguments: caseDraftJSON.legalArguments ?? '',
        comments: caseDraftJSON.comments ?? '',
        notifications: caseDraftJSON.Notification ?? [],
        courtCaseNumber: caseDraftJSON.courtCaseNumber ?? '',
        courtStartTime: caseDraftJSON.courtStartTime ?? '',
        courtEndTime: caseDraftJSON.courtEndTime ?? '',
        courtAttendees: caseDraftJSON.courtAttendees ?? '',
        policeDemands: caseDraftJSON.policeDemands ?? '',
        accusedPlea: caseDraftJSON.accusedPlea ?? '',
        litigationPresentations: caseDraftJSON.litigationPresentations ?? '',
        ruling: caseDraftJSON.ruling ?? '',
        custodyEndDate: caseDraftJSON.custodyEndDate ?? '',
        custodyRestrictions: caseDraftJSON.custodyRestrictions ?? [],
        accusedAppealDecision: caseDraftJSON.accusedAppealDecision ?? '',
        prosecutorAppealDecision: caseDraftJSON.prosecutorAppealDecision ?? '',
        prosecutorId: caseDraftJSON.prosecutorId ?? null,
        prosecutor: caseDraftJSON.prosecutor ?? null,
        judgeId: caseDraftJSON.judgeId ?? null,
        judge: caseDraftJSON.judge ?? null,
      })
    }
  }, [workingCase, setWorkingCase, id])

  /**
   * Run this if id is in url, i.e. if user is opening an existing request.
   *
   * This can't be done in the render function because the time refs will always be null
   * until the user clicks the time inputs and then the continue button becomes enabled.
   *  */

  useEffect(() => {
    const getCurrentCase = async () => {
      const currentCase = await api.getCaseById(id)

      window.localStorage.setItem(
        'workingCase',
        JSON.stringify(currentCase.case),
      )

      if (!workingCase) {
        setWorkingCase(currentCase.case)
      }
    }

    if (id) {
      getCurrentCase()
    }
  }, [id, workingCase, setWorkingCase])

  // Run this to validate form after each change
  useEffect(() => {
    const requiredFields: { value: string; validations: Validation[] }[] = [
      {
        value: workingCase?.policeCaseNumber,
        validations: ['empty', 'police-casenumber-format'],
      },
      {
        value: workingCase?.accusedNationalId,
        validations: ['empty', 'national-id'],
      },
      { value: workingCase?.accusedName, validations: ['empty'] },
      { value: workingCase?.accusedAddress, validations: ['empty'] },
      { value: workingCase?.arrestDate, validations: ['empty'] },
      {
        value: arrestTimeRef.current?.value,
        validations: ['empty', 'time-format'],
      },
      { value: workingCase?.requestedCourtDate, validations: ['empty'] },
      {
        value: requestedCourtTimeRef.current?.value,
        validations: ['empty', 'time-format'],
      },
    ]
    if (workingCase) {
      setIsStepIllegal(isNextDisabled(requiredFields))
    }
  }, [
    workingCase,
    setIsStepIllegal,
    arrestTimeRef.current?.value,
    requestedCourtTimeRef.current?.value,
  ])

  return (
    workingCase && (
      <ProcessPageLayout activeSection={0} activeSubSection={0}>
        <Text as="h1" variant="h1">
          Krafa um gæsluvarðhald
        </Text>
        <Box component="section" marginBottom={7}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              LÖKE málsnúmer
            </Text>
          </Box>
          <Input
            data-testid="policeCaseNumber"
            name="policeCaseNumber"
            label="Slá inn LÖKE málsnúmer"
            placeholder="007-2020-X"
            defaultValue={workingCase.policeCaseNumber}
            ref={policeCaseNumberRef}
            errorMessage={policeCaseNumberErrorMessage}
            hasError={policeCaseNumberErrorMessage !== ''}
            onBlur={(evt) => {
              if (workingCase.policeCaseNumber !== evt.target.value) {
                updateState(
                  workingCase,
                  'policeCaseNumber',
                  evt.target.value,
                  setWorkingCase,
                )

                const validateField = validate(evt.target.value, 'empty')
                const validateFieldFormat = validate(
                  evt.target.value,
                  'police-casenumber-format',
                )
                if (validateField.isValid && validateFieldFormat.isValid) {
                  if (workingCase.id !== '') {
                    api.saveCase(
                      workingCase.id,
                      parseString('policeCaseNumber', evt.target.value),
                    )
                  } else {
                    createCaseIfPossible()
                  }
                } else {
                  setPoliceCaseNumberErrorMessage(
                    validateField.errorMessage ||
                      validateFieldFormat.errorMessage,
                  )
                }
              }
            }}
            onFocus={() => setPoliceCaseNumberErrorMessage('')}
            required
          />
        </Box>
        <Box component="section" marginBottom={7}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Sakborningur
            </Text>
          </Box>
          <Box marginBottom={3}>
            <Input
              data-testid="nationalId"
              name="nationalId"
              label="Kennitala"
              placeholder="Kennitala"
              defaultValue={workingCase.accusedNationalId}
              ref={accusedNationalIdRef}
              errorMessage={nationalIdErrorMessage}
              hasError={nationalIdErrorMessage !== ''}
              onBlur={(evt) => {
                if (workingCase.accusedNationalId !== evt.target.value) {
                  updateState(
                    workingCase,
                    'accusedNationalId',
                    evt.target.value.replace('-', ''),
                    setWorkingCase,
                  )

                  const validateField = validate(evt.target.value, 'empty')
                  const validateFieldFormat = validate(
                    evt.target.value,
                    'national-id',
                  )

                  if (validateField.isValid && validateFieldFormat.isValid) {
                    if (workingCase.id !== '') {
                      api.saveCase(
                        workingCase.id,
                        parseString('accusedNationalId', evt.target.value),
                      )
                    } else {
                      createCaseIfPossible()
                    }
                  } else {
                    setNationalIdErrorMessage(
                      validateField.errorMessage ||
                        validateFieldFormat.errorMessage,
                    )
                  }
                }
              }}
              onFocus={() => setNationalIdErrorMessage('')}
              required
            />
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
              onBlur={(evt) => {
                if (workingCase.accusedName !== evt.target.value) {
                  updateState(
                    workingCase,
                    'accusedName',
                    evt.target.value,
                    setWorkingCase,
                  )

                  const validateField = validate(evt.target.value, 'empty')

                  if (validateField.isValid) {
                    api.saveCase(
                      workingCase.id,
                      parseString('accusedName', evt.target.value),
                    )
                  } else {
                    setAccusedNameErrorMessage(validateField.errorMessage)
                  }
                }
              }}
              onFocus={() => setAccusedNameErrorMessage('')}
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
              onBlur={(evt) => {
                if (workingCase.accusedAddress !== evt.target.value) {
                  updateState(
                    workingCase,
                    'accusedAddress',
                    evt.target.value,
                    setWorkingCase,
                  )

                  const validateField = validate(evt.target.value, 'empty')

                  if (validateField.isValid) {
                    api.saveCase(
                      workingCase.id,
                      parseString('accusedAddress', evt.target.value),
                    )
                  } else {
                    setAccusedAddressErrorMessage(validateField.errorMessage)
                  }
                }
              }}
              onFocus={() => setAccusedAddressErrorMessage('')}
              required
            />
          </Box>
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
            onChange={({ label }: Option) => {
              autoSave(workingCase, 'court', label, setWorkingCase)
            }}
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
                label="Veldu dagsetningu"
                placeholderText="Veldu dagsetningu"
                locale="is"
                errorMessage={arrestDateErrorMessage}
                hasError={arrestDateErrorMessage !== ''}
                selected={
                  workingCase.arrestDate
                    ? parseISO(workingCase.arrestDate.toString())
                    : null
                }
                handleChange={(date) => {
                  updateState(
                    workingCase,
                    'arrestDate',
                    formatISO(date, { representation: 'date' }),
                    setWorkingCase,
                  )
                }}
                handleCloseCalendar={(date: Date) => {
                  if (isNull(date) || !isValid(date)) {
                    setArrestDateErrorMessage('Reitur má ekki vera tómur')
                  }
                }}
                handleOpenCalendar={() => setArrestDateErrorMessage('')}
                required
              />
            </GridColumn>
            <GridColumn span="3/8">
              <Input
                data-testid="arrestTime"
                name="arrestTime"
                label="Tímasetning"
                placeholder="Settu inn tíma"
                disabled={!workingCase.arrestDate}
                errorMessage={arrestTimeErrorMessage}
                hasError={arrestTimeErrorMessage !== ''}
                defaultValue={
                  workingCase.arrestDate?.indexOf('T') > -1
                    ? formatDate(workingCase.arrestDate, TIME_FORMAT)
                    : null
                }
                ref={arrestTimeRef}
                onBlur={(evt) => {
                  const validateTimeEmpty = validate(evt.target.value, 'empty')
                  const validateTimeFormat = validate(
                    evt.target.value,
                    'time-format',
                  )
                  if (validateTimeEmpty.isValid && validateTimeFormat.isValid) {
                    const arrestDateMinutes = parseTime(
                      workingCase.arrestDate,
                      evt.target.value,
                    )

                    updateState(
                      workingCase,
                      'arrestDate',
                      arrestDateMinutes,
                      setWorkingCase,
                    )

                    api.saveCase(
                      workingCase.id,
                      parseString('arrestDate', arrestDateMinutes),
                    )
                  } else {
                    setArrestTimeErrorMessage(
                      validateTimeEmpty.errorMessage ||
                        validateTimeFormat.errorMessage,
                    )
                  }
                }}
                onFocus={() => setArrestTimeErrorMessage('')}
                required
              />
            </GridColumn>
          </GridRow>
        </Box>
        <Box component="section" marginBottom={7}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Ósk um fyrirtökudag og tíma
            </Text>
          </Box>
          <GridRow>
            <GridColumn span="5/8">
              <DatePicker
                label="Veldu dagsetningu"
                placeholderText="Veldu dagsetningu"
                locale="is"
                minDate={new Date()}
                selected={
                  workingCase.requestedCourtDate
                    ? parseISO(workingCase.requestedCourtDate.toString())
                    : null
                }
                handleChange={(date) => {
                  updateState(
                    workingCase,
                    'requestedCourtDate',
                    formatISO(date, { representation: 'date' }),
                    setWorkingCase,
                  )
                }}
                required
              />
            </GridColumn>
            <GridColumn span="3/8">
              <Input
                data-testid="requestedCourtDate"
                name="requestedCourtDate"
                label="Tímasetning"
                placeholder="Settu inn tíma"
                errorMessage={requestedCourtTimeErrorMessage}
                hasError={requestedCourtTimeErrorMessage !== ''}
                defaultValue={
                  workingCase.requestedCourtDate?.indexOf('T') > -1
                    ? formatDate(workingCase.requestedCourtDate, TIME_FORMAT)
                    : null
                }
                disabled={!workingCase.requestedCourtDate}
                ref={requestedCourtTimeRef}
                onBlur={(evt) => {
                  const validateTimeEmpty = validate(evt.target.value, 'empty')
                  const validateTimeFormat = validate(
                    evt.target.value,
                    'time-format',
                  )

                  if (validateTimeEmpty.isValid && validateTimeFormat.isValid) {
                    const requestedCourtDateMinutes = parseTime(
                      workingCase.requestedCourtDate,
                      evt.target.value,
                    )

                    updateState(
                      workingCase,
                      'requestedCourtDate',
                      requestedCourtDateMinutes,
                      setWorkingCase,
                    )

                    api.saveCase(
                      workingCase.id,
                      parseString(
                        'requestedCourtDate',
                        requestedCourtDateMinutes,
                      ),
                    )
                  } else {
                    setRequestedCourtTimeErrorMessage(
                      validateTimeEmpty.errorMessage ||
                        validateTimeFormat.errorMessage,
                    )
                  }
                }}
                onFocus={() => setRequestedCourtTimeErrorMessage('')}
                required
              />
            </GridColumn>
          </GridRow>
        </Box>
        <FormFooter
          nextUrl={Constants.STEP_TWO_ROUTE}
          onNextButtonClick={() => setModalVisible(true)}
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
              history.push(Constants.STEP_TWO_ROUTE)
            }
            handlePrimaryButtonClick={async () => {
              setIsSendingNotification(true)
              await api.sendNotification(workingCase.id)
              setIsSendingNotification(false)
              history.push(Constants.STEP_TWO_ROUTE)
            }}
            isPrimaryButtonLoading={isSendingNotification}
          />
        )}
      </ProcessPageLayout>
    )
  )
}

export default StepOne
