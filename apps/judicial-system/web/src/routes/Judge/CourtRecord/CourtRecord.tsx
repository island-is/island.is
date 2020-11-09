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
import { isNextDisabled } from '../../../utils/stepHelper'
import { validate } from '../../../utils/validate'
import * as Constants from '../../../utils/constants'
import { TIME_FORMAT } from '@island.is/judicial-system/formatters'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  parseString,
  parseTime,
} from '@island.is/judicial-system-web/src/utils/formatters'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components/PageLayout/PageLayout'
import { useParams } from 'react-router-dom'
import { Case, UpdateCase } from '@island.is/judicial-system/types'
import { useMutation, useQuery } from '@apollo/client'
import {
  CaseQuery,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/src/graphql'
import {
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'

export const CourtRecord: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>(null)
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
  const { id } = useParams<{ id: string }>()
  const { data } = useQuery(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const resCase = data?.case
  const [updateCaseMutation] = useMutation(UpdateCaseMutation)
  const updateCase = async (id: string, updateCase: UpdateCase) => {
    const { data } = await updateCaseMutation({
      variables: { input: { id, ...updateCase } },
    })
    const resCase = data?.updateCase
    if (resCase) {
      // Do something with the result. In particular, we want th modified timestamp passed between
      // the client and the backend so that we can handle multiple simultanious updates.
    }
    return resCase
  }

  useEffect(() => {
    document.title = 'Þingbók - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    const getCurrentCase = async () => {
      setIsLoading(true)
      setWorkingCase(resCase)
      setIsLoading(false)
    }
    if (id && !workingCase && resCase) {
      getCurrentCase()
    }
  }, [id, setIsLoading, workingCase, setWorkingCase, resCase])

  return (
    <PageLayout
      activeSection={Sections.JUDGE}
      activeSubSection={JudgeSubsections.COURT_RECORD}
      isLoading={isLoading}
    >
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
                  label="Þinghald hófst"
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

                      setWorkingCase({
                        ...workingCase,
                        courtStartTime: courtStartTimeMinutes,
                      })

                      if (
                        courtStartTimeMinutes !== workingCase.courtStartTime
                      ) {
                        updateCase(
                          workingCase.id,
                          parseString('courtStartTime', courtStartTimeMinutes),
                        )
                      }
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
                data-testid="courtEndTime"
                name="courtEndTime"
                label="Þinghaldi lauk"
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

                    setWorkingCase({
                      ...workingCase,
                      courtEndTime: courtEndTimeMinutes,
                    })

                    if (courtEndTimeMinutes !== workingCase.courtEndTime) {
                      updateCase(
                        workingCase.id,
                        parseString('courtEndTime', courtEndTimeMinutes),
                      )
                    }
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
                data-testid="courtAttendees"
                name="courtAttendees"
                label="Viðstaddir og hlutverk þeirra"
                defaultValue={workingCase?.courtAttendees}
                placeholder="Skrifa hér..."
                onBlur={(evt) => {
                  const validateEmpty = validate(evt.target.value, 'empty')

                  setWorkingCase({
                    ...workingCase,
                    courtAttendees: evt.target.value,
                  })

                  if (
                    validateEmpty.isValid &&
                    workingCase.courtAttendees !== evt.target.value
                  ) {
                    updateCase(
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
                const validateEmpty = validate(evt.target.value, 'empty')
                setWorkingCase({
                  ...workingCase,
                  policeDemands: evt.target.value,
                })

                if (
                  validateEmpty.isValid &&
                  workingCase.policeDemands !== evt.target.value
                ) {
                  updateCase(
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
                const validateEmpty = validate(evt.target.value, 'empty')
                setWorkingCase({
                  ...workingCase,
                  accusedPlea: evt.target.value,
                })

                if (
                  validateEmpty.isValid &&
                  workingCase.accusedPlea !== evt.target.value
                ) {
                  updateCase(
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
                const validateEmpty = validate(evt.target.value, 'empty')
                setWorkingCase({
                  ...workingCase,
                  litigationPresentations: evt.target.value,
                })

                if (
                  validateEmpty.isValid &&
                  workingCase.litigationPresentations !== evt.target.value
                ) {
                  updateCase(
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
            nextUrl={`${Constants.RULING_STEP_ONE_ROUTE}/${id}`}
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
