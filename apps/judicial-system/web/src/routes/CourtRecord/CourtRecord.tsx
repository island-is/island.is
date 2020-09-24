import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  Typography,
} from '@island.is/island-ui/core'
import { format, isValid, parseISO, setHours, setMinutes } from 'date-fns'
import React, { useEffect, useState } from 'react'
import CourtDocument from '../../shared-components/CourtDocument/CourtDocument'
import { FormFooter } from '../../shared-components/FormFooter'
import { Logo } from '../../shared-components/Logo/Logo'
import { GetCaseByIdResponse } from '../../types'
import useWorkingCase from '../../utils/hooks/useWorkingCase'
import { autoSave } from '../../utils/stepHelper'
import { validate } from '../../utils/validate'
import * as Constants from '../../utils/constants'
import { formatDate } from '../../utils/formatters'

export const CourtRecord: React.FC = () => {
  const [workingCase, setWorkingCase] = useWorkingCase()
  const [
    courtDocumentStartErrorMessage,
    setCourtDocumentStartErrorMessage,
  ] = useState('')
  const [
    courtDocumentEndErrorMessage,
    setCourtDocumentEndErrorMessage,
  ] = useState('')

  useEffect(() => {
    const wc: GetCaseByIdResponse = JSON.parse(
      window.localStorage.getItem('workingCase'),
    )

    if (wc.httpStatusCode === 200) {
      setWorkingCase(wc.case)
    }
  }, [])

  return workingCase ? (
    <Box marginTop={7} marginBottom={30}>
      <GridContainer>
        <GridRow>
          <GridColumn span={'3/12'}>
            <Logo />
          </GridColumn>
          <GridColumn span={'8/12'} offset={'1/12'}>
            <Box marginBottom={10}>
              <Typography as="h1" variant="h1">
                Krafa um gæsluvarðhald
              </Typography>
            </Box>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12', '3/12']}>
            <Typography>Hliðarstika</Typography>
          </GridColumn>
          <GridColumn span={['12/12', '7/12']} offset={['0', '1/12']}>
            <Box component="section" marginBottom={7}>
              <Typography variant="h2">{`Mál nr. ${workingCase.courtCaseNumber}`}</Typography>
              <Typography fontWeight="semiBold">{`LÖKE málsnr. ${workingCase.policeCaseNumber}`}</Typography>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Þingbók
                </Typography>
              </Box>
              <Box display="flex" marginBottom={3}>
                <Box marginRight={3}>
                  <Input
                    name="courtStartTime"
                    label="Þinghald hefst"
                    placeholder="Veldu tíma"
                    defaultValue={formatDate(
                      workingCase.courtStartTime,
                      Constants.TIME_FORMAT,
                    )}
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

                        const courtStartTimeHours = setHours(
                          new Date(),
                          parseInt(timeWithoutColon.substr(0, 2)),
                        )

                        const courtStartTimeMinutes = setMinutes(
                          courtStartTimeHours,
                          parseInt(timeWithoutColon.substr(2, 4)),
                        )

                        autoSave(
                          workingCase,
                          'courtStartTime',
                          courtStartTimeMinutes,
                          setWorkingCase,
                        )
                      } else {
                        setCourtDocumentStartErrorMessage(
                          validateTimeEmpty.errorMessage ||
                            validateTimeFormat.errorMessage,
                        )
                      }
                    }}
                    errorMessage={courtDocumentStartErrorMessage}
                    hasError={courtDocumentStartErrorMessage !== ''}
                    onFocus={() => setCourtDocumentStartErrorMessage('')}
                    required
                  />
                </Box>
                <Input
                  name="courtEndTime"
                  label="Þinghald lýkur"
                  placeholder="Veldu tíma"
                  defaultValue={formatDate(
                    workingCase.courtEndTime,
                    Constants.TIME_FORMAT,
                  )}
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
                      const timeWithoutColon = evt.target.value.replace(':', '')

                      const courtEndTimeHours = setHours(
                        new Date(),
                        parseInt(timeWithoutColon.substr(0, 2)),
                      )

                      const courtEndTimeMinutes = setMinutes(
                        courtEndTimeHours,
                        parseInt(timeWithoutColon.substr(2, 4)),
                      )

                      autoSave(
                        workingCase,
                        'courtEndTime',
                        courtEndTimeMinutes,
                        setWorkingCase,
                      )
                    } else {
                      setCourtDocumentEndErrorMessage(
                        validateTimeEmpty.errorMessage ||
                          validateTimeFormat.errorMessage,
                      )
                    }
                  }}
                  errorMessage={courtDocumentEndErrorMessage}
                  hasError={courtDocumentEndErrorMessage !== ''}
                  onFocus={() => setCourtDocumentEndErrorMessage('')}
                  required
                />
              </Box>
              <Box marginBottom={3}>
                <Input
                  name="courtAttendees"
                  label="Viðstaddir og hlutverk þeirra"
                  defaultValue={workingCase.courtAttendees}
                  placeholder="Skrifa hér..."
                  onBlur={(evt) => {
                    autoSave(
                      workingCase,
                      'courtAttendees',
                      evt.target.value,
                      setWorkingCase,
                    )
                  }}
                  textarea
                  rows={3}
                />
              </Box>
              <Input
                name="policeDemands"
                label="Krafa lögreglu"
                defaultValue={workingCase.policeDemands}
                placeholder="Skrifa hér..."
                onBlur={(evt) => {
                  autoSave(
                    workingCase,
                    'policeDemands',
                    evt.target.value,
                    setWorkingCase,
                  )
                }}
                textarea
                rows={3}
              />
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Dómskjöl
                </Typography>
              </Box>
              <GridRow>
                <GridColumn span="6/7">
                  <CourtDocument
                    title="Krafa lögreglu"
                    tagText="Þingmerkt nr. 1"
                    tagVariant="blue"
                    text="Rannsóknargögn málsins liggja frammi."
                  />
                </GridColumn>
              </GridRow>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Réttindi kærða
                </Typography>
              </Box>
              <Box marginBottom={2}>
                <Typography>
                  Kærða er bent á að honum sé óskylt að svara spurningum er
                  varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113.
                  gr. laga nr. 88/2008. Kærði er enn fremur áminntur um
                  sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr.
                  114. gr. sömu laga
                </Typography>
              </Box>
              <Input
                name="suspectPlea"
                label="Afstaða kærða"
                defaultValue={workingCase.suspectPlea}
                placeholder="Skrifa hér..."
                onBlur={(evt) => {
                  autoSave(
                    workingCase,
                    'suspectPlea',
                    evt.target.value,
                    setWorkingCase,
                  )
                }}
                textarea
                rows={3}
              />
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Málflutningur
                </Typography>
              </Box>
              <Input
                name="litigationPresentations"
                label="Málflutningsræður"
                defaultValue={workingCase.litigationPresentations}
                placeholder="Skrifa hér..."
                onBlur={(evt) => {
                  autoSave(
                    workingCase,
                    'litigationPresentations',
                    evt.target.value,
                    setWorkingCase,
                  )
                }}
                textarea
                rows={3}
              />
            </Box>
            <FormFooter
              previousUrl="/"
              nextUrl="/"
              nextIsDisabled={
                !workingCase.courtStartTime || !workingCase.courtEndTime
              }
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  ) : null
}

export default CourtRecord
