import {
  Box,
  GridColumn,
  GridRow,
  Input,
  Text,
} from '@island.is/island-ui/core'
import React, { useEffect, useState } from 'react'
import CourtDocument from '../../../shared-components/CourtDocument/CourtDocument'
import { FormFooter } from '../../../shared-components/FormFooter'
import { Case } from '../../../types'
import useWorkingCase from '../../../utils/hooks/useWorkingCase'
import {
  autoSave,
  isNextDisabled,
  updateState,
} from '../../../utils/stepHelper'
import { validate } from '../../../utils/validate'
import * as Constants from '../../../utils/constants'
import { TIME_FORMAT } from '@island.is/judicial-system/formatters'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  parseString,
  parseTime,
} from '@island.is/judicial-system-web/src/utils/formatters'
import * as api from '../../../api'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components/PageLayout/PageLayout'

export const CourtRecord: React.FC = () => {
  const [workingCase, setWorkingCase] = useWorkingCase()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [
    courtDocumentStartErrorMessage,
    setCourtDocumentStartErrorMessage,
  ] = useState('')
  const [
    courtDocumentEndErrorMessage,
    setCourtDocumentEndErrorMessage,
  ] = useState('')
  const [courtAttendeesErrorMessage, setCourtAttendeesMessage] = useState('')
  const [policeDemandsErrorMessage, setPoliceDemandsMessage] = useState('')
  const [accusedPleaErrorMessage, setAccusedPleaMessage] = useState('')
  const [
    litigationPresentationsErrorMessage,
    setLitigationPresentationsMessage,
  ] = useState('')

  useEffect(() => {
    document.title = 'Þingbók - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    const wc: Case = JSON.parse(window.sessionStorage.getItem('workingCase'))

    if (wc && !workingCase) {
      setWorkingCase(wc)
    }

    setIsLoading(false)
  }, [workingCase, setWorkingCase, setIsLoading])

  return (
    <PageLayout activeSection={1} activeSubSection={1} isLoading={isLoading}>
      {workingCase ? (
        <>
          <Box marginBottom={10}>
            <Text as="h1" variant="h1">
              Þingbók
            </Text>
          </Box>
          <Box component="section" marginBottom={7}>
            <Text variant="h2">{`Mál nr. ${workingCase.courtCaseNumber}`}</Text>
            <Text fontWeight="semiBold">{`LÖKE málsnr. ${workingCase.policeCaseNumber}`}</Text>
          </Box>
          <Box component="section" marginBottom={8}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Þinghald
              </Text>
            </Box>
            <Box display="flex" marginBottom={3}>
              <Box marginRight={3}>
                <Input
                  data-testid="courtStartTime"
                  name="courtStartTime"
                  label="Þinghald hefst"
                  placeholder="Veldu tíma"
                  defaultValue={formatDate(
                    workingCase.courtStartTime,
                    TIME_FORMAT,
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
                      const courtStartTimeMinutes = parseTime(
                        new Date().toString(),
                        evt.target.value,
                      )
                      if (
                        courtStartTimeMinutes !== workingCase.courtStartTime
                      ) {
                        autoSave(
                          workingCase,
                          'courtStartTime',
                          courtStartTimeMinutes,
                          setWorkingCase,
                        )
                      }
                    } else {
                      updateState(
                        workingCase,
                        'courtStartTime',
                        evt.target.value,
                        setWorkingCase,
                      )

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
                data-testid="courtEndTime"
                name="courtEndTime"
                label="Þinghald lýkur"
                placeholder="Veldu tíma"
                defaultValue={formatDate(workingCase.courtEndTime, TIME_FORMAT)}
                onBlur={(evt) => {
                  const validateTimeEmpty = validate(evt.target.value, 'empty')
                  const validateTimeFormat = validate(
                    evt.target.value,
                    'time-format',
                  )

                  if (validateTimeEmpty.isValid && validateTimeFormat.isValid) {
                    const courtEndTimeMinutes = parseTime(
                      new Date().toString(),
                      evt.target.value,
                    )
                    if (courtEndTimeMinutes !== workingCase.courtEndTime) {
                      autoSave(
                        workingCase,
                        'courtEndTime',
                        courtEndTimeMinutes,
                        setWorkingCase,
                      )
                    }
                  } else {
                    updateState(
                      workingCase,
                      'courtEndTime',
                      evt.target.value,
                      setWorkingCase,
                    )

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
                data-testid="courtAttendees"
                name="courtAttendees"
                label="Viðstaddir og hlutverk þeirra"
                defaultValue={workingCase?.courtAttendees}
                placeholder="Skrifa hér..."
                onBlur={(evt) => {
                  updateState(
                    workingCase,
                    'courtAttendees',
                    evt.target.value,
                    setWorkingCase,
                  )
                  const validateEmpty = validate(evt.target.value, 'empty')

                  if (
                    validateEmpty.isValid &&
                    workingCase.courtAttendees !== evt.target.value
                  ) {
                    api.saveCase(
                      workingCase.id,
                      parseString('courtAttendees', evt.target.value),
                    )
                  } else {
                    setCourtAttendeesMessage(validateEmpty.errorMessage)
                  }
                }}
                errorMessage={courtAttendeesErrorMessage}
                hasError={courtAttendeesErrorMessage !== ''}
                onFocus={() => setCourtAttendeesMessage('')}
                textarea
                rows={7}
                required
              />
            </Box>
            <Input
              data-testid="policeDemands"
              name="policeDemands"
              label="Krafa lögreglu"
              defaultValue={workingCase?.policeDemands}
              placeholder="Hvað hafði ákæruvaldið að segja?"
              onBlur={(evt) => {
                updateState(
                  workingCase,
                  'policeDemands',
                  evt.target.value,
                  setWorkingCase,
                )
                const validateEmpty = validate(evt.target.value, 'empty')

                if (
                  validateEmpty.isValid &&
                  workingCase.policeDemands !== evt.target.value
                ) {
                  api.saveCase(
                    workingCase.id,
                    parseString('policeDemands', evt.target.value),
                  )
                } else {
                  setPoliceDemandsMessage(validateEmpty.errorMessage)
                }
              }}
              errorMessage={policeDemandsErrorMessage}
              hasError={policeDemandsErrorMessage !== ''}
              onFocus={() => setPoliceDemandsMessage('')}
              textarea
              rows={7}
              required
            />
          </Box>
          <Box component="section" marginBottom={8}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Dómskjöl
              </Text>
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
              <Text as="h3" variant="h3">
                Réttindi kærða
              </Text>
            </Box>
            <Box marginBottom={2}>
              <Text>
                Kærða er bent á að honum sé óskylt að svara spurningum er varða
                brot það sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga
                nr. 88/2008. Kærði er enn fremur áminntur um sannsögli kjósi
                hann að tjá sig um sakarefnið, sbr. 1. mgr. 114. gr. sömu laga
              </Text>
            </Box>
            <Input
              data-testid="accusedPlea"
              name="accusedPlea"
              label="Afstaða kærða"
              defaultValue={workingCase.accusedPlea}
              placeholder="Hvað hafði kærði að segja um kröfuna? Mótmælti eða samþykkti?"
              onBlur={(evt) => {
                updateState(
                  workingCase,
                  'accusedPlea',
                  evt.target.value,
                  setWorkingCase,
                )
                const validateEmpty = validate(evt.target.value, 'empty')

                if (
                  validateEmpty.isValid &&
                  workingCase.accusedPlea !== evt.target.value
                ) {
                  api.saveCase(
                    workingCase.id,
                    parseString('accusedPlea', evt.target.value),
                  )
                } else {
                  setAccusedPleaMessage(validateEmpty.errorMessage)
                }
              }}
              errorMessage={accusedPleaErrorMessage}
              hasError={accusedPleaErrorMessage !== ''}
              onFocus={() => setAccusedPleaMessage('')}
              textarea
              rows={7}
              required
            />
          </Box>
          <Box component="section" marginBottom={8}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Málflutningur
              </Text>
            </Box>
            <Input
              data-testid="litigationPresentations"
              name="litigationPresentations"
              label="Málflutningsræður"
              defaultValue={workingCase.litigationPresentations}
              placeholder="Almennar málflutningsræður skráðar hér..."
              onBlur={(evt) => {
                updateState(
                  workingCase,
                  'litigationPresentations',
                  evt.target.value,
                  setWorkingCase,
                )
                const validateEmpty = validate(evt.target.value, 'empty')

                if (
                  validateEmpty.isValid &&
                  workingCase.litigationPresentations !== evt.target.value
                ) {
                  api.saveCase(
                    workingCase.id,
                    parseString('litigationPresentations', evt.target.value),
                  )
                } else {
                  setLitigationPresentationsMessage(validateEmpty.errorMessage)
                }
              }}
              errorMessage={litigationPresentationsErrorMessage}
              hasError={litigationPresentationsErrorMessage !== ''}
              onFocus={() => setLitigationPresentationsMessage('')}
              textarea
              rows={7}
              required
            />
          </Box>
          <FormFooter
            nextUrl={Constants.RULING_STEP_ONE_ROUTE}
            nextIsDisabled={isNextDisabled([
              {
                value: formatDate(workingCase?.courtStartTime, TIME_FORMAT),
                validations: ['empty', 'time-format'],
              },
              {
                value: formatDate(workingCase?.courtEndTime, TIME_FORMAT),
                validations: ['empty', 'time-format'],
              },
              {
                value: workingCase?.courtAttendees,
                validations: ['empty'],
              },
              {
                value: workingCase?.policeDemands,
                validations: ['empty'],
              },
              { value: workingCase?.accusedPlea, validations: ['empty'] },
              {
                value: workingCase?.litigationPresentations,
                validations: ['empty'],
              },
            ])}
          />
        </>
      ) : null}
    </PageLayout>
  )
}

export default CourtRecord
