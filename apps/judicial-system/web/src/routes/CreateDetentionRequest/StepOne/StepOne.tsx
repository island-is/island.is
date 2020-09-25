import React, { useRef, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { ProsecutorLogo } from '../../../shared-components/Logos'
import Modal from '../../../shared-components/Modal/Modal'
import {
  Typography,
  GridContainer,
  GridRow,
  GridColumn,
  Input,
  Box,
  Select,
  Option,
  DatePicker,
} from '@island.is/island-ui/core'
import { Case } from '../../../types'
import * as api from '../../../api'
import { validate } from '../../../utils/validate'
import { updateState, autoSave } from '../../../utils/stepHelper'
import { setHours, setMinutes, isValid, parseISO } from 'date-fns'
import { isNull } from 'lodash'
import { FormFooter } from '../../../shared-components/FormFooter'
import { useParams } from 'react-router-dom'
import * as Constants from '../../../utils/constants'
import { formatDate } from '@island.is/judicial-system-web/src/utils/formatters'

export const StepOne: React.FC = () => {
  if (!window.localStorage.getItem('workingCase')) {
    window.localStorage.setItem('workingCase', JSON.stringify({}))
  }

  const history = useHistory()
  const caseDraft = window.localStorage.getItem('workingCase')
  const caseDraftJSON = JSON.parse(caseDraft)

  const [workingCase, setWorkingCase] = useState<Case>({
    id: caseDraftJSON.id ?? '',
    created: new Date(),
    modified: new Date(),
    state: caseDraftJSON.state ?? '',
    policeCaseNumber: caseDraftJSON.policeCaseNumber ?? '',
    suspectNationalId: caseDraftJSON.suspectNationalId ?? '',
    suspectName: caseDraftJSON.suspectName ?? '',
    suspectAddress: caseDraftJSON.suspectAddress ?? '',
    court: caseDraftJSON.court ?? 'Héraðsdómur Reykjavíkur',
    arrestDate: caseDraftJSON.arrestDate ?? null,
    requestedCourtDate: caseDraftJSON.requestedCourtDate ?? null,
    requestedCustodyEndDate: caseDraftJSON.requestedCustodyEndDate ?? null,
    lawsBroken: caseDraftJSON.lawsBroken ?? '',
    custodyProvisions: caseDraftJSON.caseCustodyProvisions ?? [],
    custodyRestrictions: caseDraftJSON.restrictions ?? [],
    caseFacts: caseDraftJSON.caseFacts ?? '',
    witnessAccounts: caseDraftJSON.witnessAccounts ?? '',
    investigationProgress: caseDraftJSON.investigationProgress ?? '',
    legalArguments: caseDraftJSON.legalArguments ?? '',
    comments: caseDraftJSON.comments ?? '',
  })
  const [
    policeCaseNumberErrorMessage,
    setPoliceCaseNumberErrorMessage,
  ] = useState<string>('')
  const [nationalIdErrorMessage, setNationalIdErrorMessage] = useState<string>(
    '',
  )
  const [suspectNameErrorMessage, setSuspectNameErrorMessage] = useState<
    string
  >('')
  const [suspectAddressErrorMessage, setSuspectAddressErrorMessage] = useState<
    string
  >('')
  const [arrestDateErrorMessage, setArrestDateErrorMessage] = useState<string>(
    '',
  )
  const [arrestTimeErrorMessage, setArrestTimeErrorMessage] = useState<string>(
    '',
  )
  const [modalVisible, setModalVisible] = useState(false)
  const [isSendingNotification, setIsSendingNotification] = useState(false)

  const { id } = useParams<{ id: string }>()

  const policeCaseNumberRef = useRef<HTMLInputElement>()
  const suspectNationalIdRef = useRef<HTMLInputElement>()
  const arrestTimeRef = useRef<HTMLInputElement>()

  const requiredFields = [
    workingCase.policeCaseNumber,
    workingCase.suspectNationalId,
    workingCase.suspectName,
    workingCase.suspectAddress,
    workingCase.arrestDate,
  ]

  const filledRequiredFields = requiredFields.filter(
    (requiredField) => requiredField !== '' && !isNull(requiredField),
  )

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
    (court) => court.label === workingCase.court,
  )

  const createCaseIfPossible = async () => {
    const isPossibleToSave =
      workingCase.id === '' &&
      policeCaseNumberRef.current.value !== '' &&
      suspectNationalIdRef.current.value !== ''

    if (isPossibleToSave) {
      const caseId = await api.createCase({
        policeCaseNumber: policeCaseNumberRef.current.value,
        suspectNationalId: suspectNationalIdRef.current.value,
      })

      window.localStorage.setItem(
        'workingCase',
        JSON.stringify({
          ...workingCase,
          id: caseId,
          suspectNationalId: suspectNationalIdRef.current.value,
          policeCaseNumber: policeCaseNumberRef.current.value,
        }),
      )
      setWorkingCase({
        ...workingCase,
        id: caseId,
        suspectNationalId: suspectNationalIdRef.current.value,
        policeCaseNumber: policeCaseNumberRef.current.value,
      })
    }
  }

  useEffect(() => {
    const getCurrentCase = async () => {
      const currentCase = await api.getCaseById(id)
      window.localStorage.setItem(
        'workingCase',
        JSON.stringify(currentCase.case),
      )
    }

    if (id) {
      getCurrentCase()
    }
  }, [])

  return (
    <>
      <Box marginTop={7} marginBottom={30}>
        <GridContainer>
          <GridRow>
            <GridColumn span={'3/12'}>
              <ProsecutorLogo />
            </GridColumn>
            <GridColumn span={'8/12'} offset={'1/12'}>
              <Typography as="h1" variant="h1">
                Krafa um gæsluvarðhald
              </Typography>
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['12/12', '3/12']}>
              <Typography>Hliðarstika</Typography>
            </GridColumn>
            <GridColumn span={['12/12', '7/12']} offset={['0', '1/12']}>
              <Box component="section" marginBottom={7}>
                <Box marginBottom={2}>
                  <Typography as="h3" variant="h3">
                    LÖKE málsnúmer
                  </Typography>
                </Box>
                <Input
                  data-testid="policeCaseNumber"
                  name="policeCaseNumber"
                  label="Slá inn LÖKE málsnúmer"
                  defaultValue={workingCase.policeCaseNumber}
                  ref={policeCaseNumberRef}
                  errorMessage={policeCaseNumberErrorMessage}
                  hasError={policeCaseNumberErrorMessage !== ''}
                  onBlur={(evt) => {
                    const validateField = validate(evt.target.value, 'empty')
                    if (validateField.isValid) {
                      createCaseIfPossible()
                      updateState(
                        workingCase,
                        'policeCaseNumber',
                        evt.target.value,
                        setWorkingCase,
                      )
                    } else {
                      setPoliceCaseNumberErrorMessage(
                        validateField.errorMessage,
                      )
                    }
                  }}
                  onFocus={() => setPoliceCaseNumberErrorMessage('')}
                  required
                  autoFocus
                />
              </Box>
              <Box component="section" marginBottom={7}>
                <Box marginBottom={2}>
                  <Typography as="h3" variant="h3">
                    Ákærði
                  </Typography>
                </Box>
                <Box marginBottom={3}>
                  <Input
                    data-testid="nationalId"
                    name="nationalId"
                    label="Kennitala"
                    defaultValue={workingCase.suspectNationalId}
                    ref={suspectNationalIdRef}
                    errorMessage={nationalIdErrorMessage}
                    hasError={nationalIdErrorMessage !== ''}
                    onBlur={(evt) => {
                      const validateField = validate(evt.target.value, 'empty')

                      if (validateField.isValid) {
                        createCaseIfPossible()
                        updateState(
                          workingCase,
                          'suspectNationalId',
                          evt.target.value,
                          setWorkingCase,
                        )
                      } else {
                        setNationalIdErrorMessage(validateField.errorMessage)
                      }
                    }}
                    onFocus={() => setNationalIdErrorMessage('')}
                    required
                  />
                </Box>
                <Box marginBottom={3}>
                  <Input
                    data-testid="suspectName"
                    name="suspectName"
                    label="Fullt nafn kærða"
                    defaultValue={workingCase.suspectName}
                    errorMessage={suspectNameErrorMessage}
                    hasError={suspectNameErrorMessage !== ''}
                    onBlur={(evt) => {
                      const validateField = validate(evt.target.value, 'empty')

                      if (validateField.isValid) {
                        autoSave(
                          workingCase,
                          'suspectName',
                          evt.target.value,
                          setWorkingCase,
                        )
                      } else {
                        setSuspectNameErrorMessage(validateField.errorMessage)
                      }
                    }}
                    onFocus={() => setSuspectNameErrorMessage('')}
                    required
                  />
                </Box>
                <Box marginBottom={3}>
                  <Input
                    data-testid="suspectAddress"
                    name="suspectAddress"
                    label="Lögheimili/dvalarstaður"
                    defaultValue={workingCase.suspectAddress}
                    errorMessage={suspectAddressErrorMessage}
                    hasError={suspectAddressErrorMessage !== ''}
                    onBlur={(evt) => {
                      const validateField = validate(evt.target.value, 'empty')

                      if (validateField.isValid) {
                        autoSave(
                          workingCase,
                          'suspectAddress',
                          evt.target.value,
                          setWorkingCase,
                        )
                      } else {
                        setSuspectAddressErrorMessage(
                          validateField.errorMessage,
                        )
                      }
                    }}
                    onFocus={() => setSuspectAddressErrorMessage('')}
                    required
                  />
                </Box>
              </Box>
              <Box component="section" marginBottom={7}>
                <Box marginBottom={2}>
                  <Typography as="h3" variant="h3">
                    Dómstóll
                  </Typography>
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
                  <Typography as="h3" variant="h3">
                    Tími handtöku
                  </Typography>
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
                        caseDraftJSON.arrestDate
                          ? parseISO(caseDraftJSON.arrestDate.toString())
                          : null
                      }
                      handleChange={(date) => {
                        updateState(
                          workingCase,
                          'arrestDate',
                          date,
                          setWorkingCase,
                        )
                      }}
                      handleCloseCalander={(date: Date) => {
                        if (isNull(date) || !isValid(date)) {
                          setArrestDateErrorMessage('Reitur má ekki vera tómur')
                        }
                      }}
                      handleOpenCalander={() => setArrestDateErrorMessage('')}
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
                      defaultValue={formatDate(
                        workingCase.arrestDate,
                        Constants.TIME_FORMAT,
                      )}
                      ref={arrestTimeRef}
                      onBlur={(evt) => {
                        const validateTimeEmpty = validate(
                          evt.target.value,
                          'empty',
                        )
                        const validateTimeFormat = validate(
                          evt.target.value,
                          'time-format',
                        )

                        if (
                          validateTimeEmpty.isValid &&
                          validateTimeFormat.isValid
                        ) {
                          const timeWithoutColon = evt.target.value.replace(
                            ':',
                            '',
                          )

                          const arrestDateHours = setHours(
                            new Date(workingCase.arrestDate),
                            parseInt(timeWithoutColon.substr(0, 2)),
                          )

                          const arrestDateMinutes = setMinutes(
                            arrestDateHours,
                            parseInt(timeWithoutColon.substr(2, 4)),
                          )

                          autoSave(
                            workingCase,
                            'arrestDate',
                            arrestDateMinutes,
                            setWorkingCase,
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
                  <Typography as="h3" variant="h3">
                    Ósk um fyrirtökudag og tíma
                  </Typography>
                </Box>
                <GridRow>
                  <GridColumn span="5/8">
                    <DatePicker
                      label="Veldu dagsetningu"
                      placeholderText="Veldu dagsetningu"
                      locale="is"
                      minDate={new Date()}
                      selected={
                        caseDraftJSON.requestedCourtDate
                          ? parseISO(
                              caseDraftJSON.requestedCourtDate.toString(),
                            )
                          : null
                      }
                      handleChange={(date) => {
                        updateState(
                          workingCase,
                          'requestedCourtDate',
                          date,
                          setWorkingCase,
                        )
                      }}
                    />
                  </GridColumn>
                  <GridColumn span="3/8">
                    <Input
                      data-testid="courtDate"
                      name="courtDate"
                      label="Tímasetning"
                      placeholder="Settu inn tíma"
                      defaultValue={caseDraftJSON.requestedCourtTime}
                      disabled={!workingCase.requestedCourtDate}
                      onBlur={(evt) => {
                        const timeWithoutColon = evt.target.value.replace(
                          ':',
                          '',
                        )

                        const requestedCourtDateHours = setHours(
                          new Date(workingCase.requestedCourtDate),
                          parseInt(timeWithoutColon.substr(0, 2)),
                        )

                        const requestedCourtDateMinutes = setMinutes(
                          requestedCourtDateHours,
                          parseInt(timeWithoutColon.substr(2, 4)),
                        )

                        autoSave(
                          workingCase,
                          'requestedCourtDate',
                          requestedCourtDateMinutes,
                          setWorkingCase,
                        )

                        updateState(
                          workingCase,
                          'requestedCourtTime',
                          evt.target.value,
                          setWorkingCase,
                        )
                      }}
                    />
                  </GridColumn>
                </GridRow>
              </Box>
              <FormFooter
                previousUrl="/"
                nextUrl={Constants.STEP_TWO_ROUTE}
                onNextButtonClick={() => setModalVisible(true)}
                nextIsDisabled={
                  !arrestTimeRef.current
                    ? true
                    : !validate(arrestTimeRef.current.value, 'empty').isValid ||
                      !validate(arrestTimeRef.current.value, 'time-format')
                        .isValid
                    ? true
                    : filledRequiredFields.length !== requiredFields.length
                    ? true
                    : false
                }
                previousIsDisabled
              />
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      {modalVisible && (
        <Modal
          title="Viltu senda tilkynningu?"
          text="Með því að senda tilkynningu á dómara á vakt um að krafa um gæsluvarðhald sé í vinnslu flýtir það fyrir málsmeðferð og allir aðilar eru upplýstir um stöðu mála."
          primaryButtonText="Senda tilkynningu"
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
    </>
  )
}

export default StepOne
