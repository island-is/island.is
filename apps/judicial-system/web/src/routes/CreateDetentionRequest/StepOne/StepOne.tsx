import React, { useRef, useState } from 'react'

import { Logo } from '@island.is/judicial-system-web/src/shared-components/Logo/Logo'
import {
  Typography,
  GridContainer,
  GridRow,
  GridColumn,
  Input,
  Box,
  Select,
  Option,
  Button,
  DatePicker,
} from '@island.is/island-ui/core'
import { CreateDetentionReqStepOneCase } from '../../../types'
import * as api from '../../../api'
import { validate } from '../../../utils/validate'
import { updateState, autoSave } from '../../../utils/stepHelper'
import { setHours, setMinutes, isValid } from 'date-fns'
import { isNull } from 'lodash'

export const StepOne: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<CreateDetentionReqStepOneCase>(
    {
      id: '',
      case: {
        policeCaseNumber: '',
        suspectNationalId: '',
        suspectName: '',
        suspectAddress: '',
        court: '',
        arrestDate: null,
        arrestTime: '',
        requestedCourtDate: null,
      },
    },
  )
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
  const [someInputIsDirty, setSomeInputIsDirty] = useState<boolean>(false)

  const policeCaseNumberRef = useRef<HTMLInputElement>()
  const suspectNationalIdRef = useRef<HTMLInputElement>()

  const requiredFields = [
    workingCase.case.policeCaseNumber,
    workingCase.case.suspectNationalId,
    workingCase.case.suspectName,
    workingCase.case.suspectAddress,
    workingCase.case.arrestDate,
    workingCase.case.arrestTime,
  ]

  const filledRequiredFields = requiredFields.filter(
    (requiredField) => requiredField !== '' && !isNull(requiredField),
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
      window.localStorage.setItem('caseId', caseId)
      setWorkingCase({ id: caseId, case: workingCase.case })
    }
  }

  return (
    <Box marginTop={7}>
      <GridContainer>
        <GridRow>
          <GridColumn span={'3/12'}>
            <Logo />
          </GridColumn>
          <GridColumn span={'8/12'} offset={'1/12'}>
            <Typography as="h1">Krafa um gæsluvarðhald</Typography>
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
                name="policeCaseNumber"
                label="Slá inn LÖKE málsnúmer"
                ref={policeCaseNumberRef}
                errorMessage={policeCaseNumberErrorMessage}
                hasError={policeCaseNumberErrorMessage !== ''}
                onBlur={(evt) => {
                  setSomeInputIsDirty(true)
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
                    setPoliceCaseNumberErrorMessage(validateField.errorMessage)
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
                  name="nationalId"
                  label="Kennitala"
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
                  name="suspectName"
                  label="Fullt nafn kærða"
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
                  name="suspectAddress"
                  label="Lögheimili/dvalarstaður"
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
                      setSuspectAddressErrorMessage(validateField.errorMessage)
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
                  label: 'Héraðsdómur Reykjavíkur',
                  value: 0,
                }}
                options={[
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
                ]}
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
                    minDate={new Date()}
                    errorMessage={arrestDateErrorMessage}
                    hasError={arrestDateErrorMessage !== ''}
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
                    name="arrestTime"
                    label="Tímasetning"
                    placeholder="Settu inn tíma"
                    disabled={!workingCase.case.arrestDate}
                    errorMessage={arrestTimeErrorMessage}
                    hasError={arrestTimeErrorMessage !== ''}
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
                          workingCase.case.arrestDate,
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
                        updateState(
                          workingCase,
                          'arrestTime',
                          evt.target.value,
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
                    name="courtDate"
                    label="Tímasetning"
                    placeholder="Settu inn tíma"
                    disabled={!workingCase.case.requestedCourtDate}
                    onBlur={(evt) => {
                      const timeWithoutColon = evt.target.value.replace(':', '')

                      const requestedCourtDateHours = setHours(
                        workingCase.case.requestedCourtDate,
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
                    }}
                  />
                </GridColumn>
              </GridRow>
            </Box>
            <Box display="flex" justifyContent="spaceBetween" marginBottom={30}>
              <Button variant="ghost" href="/">
                Til baka
              </Button>
              <Button
                icon="arrowRight"
                disabled={
                  !someInputIsDirty ||
                  filledRequiredFields.length !== requiredFields.length
                }
                href="/stofna-krofu/lagaakvaedi"
              >
                Halda áfram
              </Button>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export default StepOne
