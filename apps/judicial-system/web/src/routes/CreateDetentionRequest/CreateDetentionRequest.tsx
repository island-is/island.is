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
import { WorkingCase } from '../../types'
import * as api from '../../api'
import { isValid as isValidField } from '../../utils/validate'
import { setHours, setMinutes, isValid } from 'date-fns'
import { isNull } from 'lodash'

export const CreateDetentionRequest: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<WorkingCase>({
    id: '',
    case: {
      policeCaseNumber: '',
      suspectNationalId: '',
      suspectName: '',
      suspectAddress: '',
      court: '',
      arrestDate: null,
      requestedCourtDate: null,
    },
  })
  const [, setAutoSaveSucceded] = useState<boolean>(true)
  const [isPoliceCaseNumberValid, setIsPoliceCaseNumberValid] = useState<
    boolean
  >(true)
  const [isNationalIdValid, setIsNationalIdValid] = useState<boolean>(true)
  const [isSuspectNameValid, setIsSuspectNameValid] = useState<boolean>(true)
  const [isSuspectAddressValid, setIsSuspectAddressValid] = useState<boolean>(
    true,
  )
  const [isArrestDateValid, setIsArrestDateValid] = useState<boolean>(true)
  const [isArrestTimeValid, setIsArrestTimeValid] = useState<boolean>(true)

  const [stepIsValid, setStepIsValid] = useState<boolean>(false)

  const policeCaseNumberRef = useRef<HTMLInputElement>()
  const suspectNationalIdRef = useRef<HTMLInputElement>()

  const createCaseIfPossible = async () => {
    setStepIsValid(policeCaseNumberRef.current.value !== '')
    const isPossibleToSave =
      workingCase.id === '' &&
      policeCaseNumberRef.current.value !== '' &&
      suspectNationalIdRef.current.value !== ''

    if (isPossibleToSave) {
      const caseId = await api.createCase({
        policeCaseNumber: policeCaseNumberRef.current.value,
        suspectNationalId: suspectNationalIdRef.current.value,
      })

      setWorkingCase({ id: caseId, case: workingCase.case })
    }
  }

  const autoSave = async (caseField: string, caseFieldValue: string | Date) => {
    // Only save if the field has changes and the case exists
    if (
      workingCase.case[caseField] !== caseFieldValue &&
      workingCase.id !== ''
    ) {
      // Copy the working case
      const copyOfWorkingCase = Object.assign({}, workingCase)

      // Save the case
      const response = await api.saveCase(
        workingCase.id,
        caseField,
        caseFieldValue,
      )

      if (response === 200) {
        // Assign new value to the field the user is changing
        copyOfWorkingCase.case[caseField] = caseFieldValue

        // Update the working case
        setWorkingCase(copyOfWorkingCase)
      } else {
        setAutoSaveSucceded(false)

        // TODO: Do something when autosave fails
      }
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
                errorMessage="Reitur má ekki vera tómur"
                hasError={!isPoliceCaseNumberValid}
                onBlur={(evt) => {
                  if (isValidField(evt.target.value, 'empty')) {
                    createCaseIfPossible()
                  } else {
                    setIsPoliceCaseNumberValid(false)
                  }
                }}
                onFocus={() => setIsPoliceCaseNumberValid(true)}
                required
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
                  hasError={!isNationalIdValid}
                  onBlur={(evt) => {
                    if (isValidField(evt.target.value, 'empty')) {
                      createCaseIfPossible()
                    } else {
                      setIsNationalIdValid(false)
                    }
                  }}
                  onFocus={() => setIsNationalIdValid(true)}
                  required
                />
              </Box>
              <Box marginBottom={3}>
                <Input
                  name="suspectName"
                  label="Fullt nafn kærða"
                  hasError={!isSuspectNameValid}
                  onBlur={(evt) => {
                    if (isValidField(evt.target.value, 'empty')) {
                      autoSave('suspectName', evt.target.value)
                    } else {
                      setIsSuspectNameValid(false)
                    }
                  }}
                  onFocus={() => setIsSuspectNameValid(true)}
                  required
                />
              </Box>
              <Box marginBottom={3}>
                <Input
                  name="suspectAddress"
                  label="Lögheimili/dvalarstaður"
                  hasError={!isSuspectAddressValid}
                  onBlur={(evt) => {
                    if (isValidField(evt.target.value, 'empty')) {
                      autoSave('suspectAddress', evt.target.value)
                    } else {
                      setIsSuspectAddressValid(false)
                    }
                  }}
                  onFocus={() => setIsSuspectAddressValid(true)}
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
                  autoSave('court', label)
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
                    name="arrestDate"
                    locale="is"
                    minDate={new Date()}
                    hasError={!isArrestDateValid}
                    handleChange={(date) => {
                      const copyOfWorkingCase = Object.assign({}, workingCase)
                      copyOfWorkingCase.case.arrestDate = date

                      setWorkingCase(copyOfWorkingCase)
                    }}
                    handleCloseCalander={(date: Date) => {
                      console.log(isNull(date))
                      if (isNull(date) || !isValid(date)) {
                        setIsArrestDateValid(false)
                      }
                    }}
                    handleOpenCalander={() => setIsArrestDateValid(true)}
                    required
                  />
                </GridColumn>
                <GridColumn span="3/8">
                  <Input
                    name="arrestTime"
                    label="Tímasetning"
                    placeholder="Settu inn tíma"
                    disabled={!workingCase.case.arrestDate}
                    hasError={!isArrestTimeValid}
                    onBlur={(evt) => {
                      const passesValidation =
                        isValidField(evt.target.value, 'empty') &&
                        isValidField(evt.target.value, 'time')

                      if (passesValidation) {
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

                        autoSave('requestedCourtDate', arrestDateMinutes)
                      } else {
                        setIsArrestTimeValid(false)
                      }
                    }}
                    onFocus={() => setIsArrestTimeValid(true)}
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
                    name="requestedCourtDate"
                    locale="is"
                    minDate={new Date()}
                    handleChange={(date) => {
                      const copyOfWorkingCase = Object.assign({}, workingCase)
                      copyOfWorkingCase.case.requestedCourtDate = date

                      setWorkingCase(copyOfWorkingCase)
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

                      autoSave('requestedCourtDate', requestedCourtDateMinutes)
                    }}
                  />
                </GridColumn>
              </GridRow>
            </Box>
            <Box display="flex" justifyContent="spaceBetween" marginBottom={30}>
              <Button variant="ghost" href="/">
                Til baka
              </Button>
              <Button icon="arrowRight" disabled={!stepIsValid}>
                Halda áfram
              </Button>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export default CreateDetentionRequest
