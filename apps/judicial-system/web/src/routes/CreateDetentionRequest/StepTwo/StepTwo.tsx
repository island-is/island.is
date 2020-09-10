import React, { useState, useEffect } from 'react'

import { Logo } from '@island.is/judicial-system-web/src/shared-components/Logo/Logo'
import {
  Typography,
  GridContainer,
  GridRow,
  GridColumn,
  Box,
  DatePicker,
  Input,
} from '@island.is/island-ui/core'
import { CreateDetentionReqStepTwoCase } from '@island.is/judicial-system-web/src/types'
import { updateState, autoSave } from '../../../utils/stepHelper'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'
import { setHours, setMinutes, isValid } from 'date-fns'
import { isNull } from 'lodash'

export const StepTwo: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<CreateDetentionReqStepTwoCase>(
    {
      id: '',
      case: {
        courtClaimDate: null,
        courtClaimTime: 'string',
        offense: '',
        offenseParagraph: '',
      },
    },
  )
  const [courtClaimDateErrorMessage, setCourtClaimDateErrorMessage] = useState<
    string
  >('')
  const [courtClaimTimeErrorMessage, setCourtClaimTimeErrorMessage] = useState<
    string
  >('')
  const [offenceErrorMessage, setOffenceErrorMessage] = useState<string>('')

  useEffect(() => {
    updateState(
      workingCase,
      'id',
      window.localStorage.getItem('caseId'),
      setWorkingCase,
    )
  }, [])

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
                  Dómkröfur
                </Typography>
              </Box>
              <GridRow>
                <GridColumn span="5/8">
                  <DatePicker
                    label="Veldu dagsetningu"
                    placeholderText="Veldu dagsetningu"
                    locale="is"
                    minDate={new Date()}
                    hasError={courtClaimDateErrorMessage !== ''}
                    errorMessage={courtClaimDateErrorMessage}
                    handleChange={(date) => {
                      updateState(
                        workingCase,
                        'courtClaimDate',
                        date,
                        setWorkingCase,
                      )
                    }}
                    handleCloseCalander={(date: Date) => {
                      if (isNull(date) || !isValid(date)) {
                        setCourtClaimDateErrorMessage(
                          'Reitur má ekki vera tómur',
                        )
                      }
                    }}
                    handleOpenCalander={() => setCourtClaimDateErrorMessage('')}
                  />
                </GridColumn>
                <GridColumn span="3/8">
                  <Input
                    name="courtClaimTime"
                    label="Tímasetning"
                    placeholder="Settu inn tíma"
                    disabled={!workingCase.case.courtClaimDate}
                    errorMessage={courtClaimTimeErrorMessage}
                    hasError={courtClaimTimeErrorMessage !== ''}
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

                        const courtClaimtDateHours = setHours(
                          workingCase.case.courtClaimDate,
                          parseInt(timeWithoutColon.substr(0, 2)),
                        )

                        const courtClaimDateMinutes = setMinutes(
                          courtClaimtDateHours,
                          parseInt(timeWithoutColon.substr(2, 4)),
                        )

                        autoSave(
                          workingCase,
                          'courtClaimDate',
                          courtClaimDateMinutes,
                          setWorkingCase,
                        )
                        updateState(
                          workingCase,
                          'courtClaimTime',
                          evt.target.value,
                          setWorkingCase,
                        )
                      } else {
                        setCourtClaimTimeErrorMessage(
                          validateTimeEmpty.errorMessage ||
                            validateTimeFormat.errorMessage,
                        )
                      }
                    }}
                    onFocus={() => setCourtClaimTimeErrorMessage('')}
                  />
                </GridColumn>
              </GridRow>
            </Box>
            <Box component="section" marginBottom={7}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Lagaákvæði sem brot varða við
                </Typography>
              </Box>
              <Input
                name="offence"
                label="Lagaákvæði sem ætluð brot kærða þykja varða við"
                errorMessage={offenceErrorMessage}
                hasError={offenceErrorMessage !== ''}
                onBlur={(evt) => {
                  const validateField = validate(evt.target.value, 'empty')
                  if (validateField.isValid) {
                    updateState(
                      workingCase,
                      'offence',
                      evt.target.value,
                      setWorkingCase,
                    )
                  } else {
                    setOffenceErrorMessage(validateField.errorMessage)
                  }
                }}
                onFocus={() => setOffenceErrorMessage('')}
                required
              />
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export default StepTwo
