import {
  Box,
  DatePicker,
  GridColumn,
  GridRow,
  Input,
  Text,
} from '@island.is/island-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { FormFooter } from '../../../shared-components/FormFooter'
import { isNextDisabled } from '../../../utils/stepHelper'
import { validate, Validation } from '../../../utils/validate'
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
import parseISO from 'date-fns/parseISO'
import formatISO from 'date-fns/formatISO'
import isNull from 'lodash/isNull'
import isValid from 'date-fns/isValid'

interface CaseData {
  case: Case
}

export const HearingArrangements: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>(null)
  const [isStepIllegal, setIsStepIllegal] = useState<boolean>(true)
  const [courtDateErrorMessage, setCourtDateErrorMessage] = useState('')
  const [courtTimeErrorMessage, setCourtTimeErrorMessage] = useState('')
  const [courtroomErrorMessage, setCourtroomErrorMessage] = useState('')

  const courtTimeRef = useRef<HTMLInputElement>()
  
  const { id } = useParams<{ id: string }>()
  
  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })
  
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
    document.title = 'Fyrirtökutími - Réttarvörslugátt'
  }, [])


  useEffect(() => {
    if (data && workingCase === null) {
      let theCase = data.case
      
      if(!theCase.courtDate) {
        
        theCase = {... theCase, courtDate: theCase.requestedCourtDate}

        updateCase(
          theCase.id,
          parseString('courtDate', theCase.requestedCourtDate),
        )
      }

      setWorkingCase(theCase)
    }
  }, [setWorkingCase, data])

  useEffect(() => {
    const requiredFields: { value: string; validations: Validation[] }[] = [
      {
        value: workingCase?.courtDate,
        validations: ['empty'],
      },
      {
        value: courtTimeRef.current?.value,
        validations: ['empty', 'time-format'],
      },
      {
        value: workingCase?.courtRoom,
        validations: ['empty'],
      },
    ]

    if (workingCase) {
      setIsStepIllegal(isNextDisabled(requiredFields))
    }
  }, [workingCase, isStepIllegal])

  return (
    <PageLayout activeSection={1} activeSubSection={1} isLoading={loading}>
      {workingCase ? (
        <>
          <Box marginBottom={10}>
            <Text as="h1" variant="h1">
              Fyrirtökutími
            </Text>
          </Box>
          <Box component="section" marginBottom={7}>
            <Text variant="h2">{`Mál nr. ${workingCase.courtCaseNumber}`}</Text>
            <Text fontWeight="semiBold">{`LÖKE málsnr. ${workingCase.policeCaseNumber}`}</Text>
          </Box>
          <Box component="section" marginBottom={8}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Skrá fyrirtökutíma
              </Text>
            </Box>
            <Box marginBottom={3}>
              <GridRow>
                <GridColumn span="7/12">
                  <DatePicker
                    label="Veldu dagsetningu"
                    placeholderText="Veldu dagsetningu"
                    locale="is"
                    errorMessage={courtDateErrorMessage}
                    hasError={courtDateErrorMessage !== ''}
                    minDate={new Date()}
                    selected={
                      workingCase.courtDate
                        ? parseISO(workingCase.courtDate.toString())
                        : null
                    }
                    handleChange={(date) => {
                      const formattedDate = formatISO(date, {
                        representation:
                          workingCase.courtDate?.indexOf('T') > -1
                            ? 'complete'
                            : 'date',
                      })

                      setWorkingCase({
                        ...workingCase,
                        courtDate: formattedDate,
                      })

                      updateCase(
                        workingCase.id,
                        parseString('courtDate', formattedDate),
                      )
                    }}
                    handleCloseCalendar={(date: Date) => {
                      if (isNull(date) || !isValid(date)) {
                        setCourtDateErrorMessage('Reitur má ekki vera tómur')
                      }
                    }}
                    handleOpenCalendar={() => setCourtDateErrorMessage('')}
                    required
                  />
                </GridColumn>
                <GridColumn span="5/12">
                  <Input
                    name="courtTime"
                    label="Tímasetning"
                    placeholder="Settu inn tíma"
                    errorMessage={courtTimeErrorMessage}
                    hasError={courtTimeErrorMessage !== ''}
                    defaultValue={
                      workingCase.courtDate?.indexOf('T') > -1
                        ? formatDate(workingCase.courtDate, TIME_FORMAT)
                        : null
                    }
                    disabled={!workingCase.courtDate}
                    ref={courtTimeRef}
                    onBlur={(evt) => {
                      const courtDateMinutes = parseTime(
                        workingCase.courtDate,
                        evt.target.value,
                      )
                      const validateTimeEmpty = validate(
                        evt.target.value,
                        'empty',
                      )
                      const validateTimeFormat = validate(
                        evt.target.value,
                        'time-format',
                      )

                      setWorkingCase({
                        ...workingCase,
                        courtDate: courtDateMinutes,
                      })

                      if (
                        validateTimeEmpty.isValid &&
                        validateTimeFormat.isValid
                      ) {
                        updateCase(
                          workingCase.id,
                          parseString('courtDate', courtDateMinutes),
                        )
                      } else {
                        setCourtTimeErrorMessage(
                          validateTimeEmpty.errorMessage ||
                            validateTimeFormat.errorMessage,
                        )
                      }
                    }}
                    onFocus={() => setCourtTimeErrorMessage('')}
                    required
                  />
                </GridColumn>
              </GridRow>
            </Box>
            <Input
              name="courtroom"
              label="Dómsalur"
              defaultValue={workingCase?.courtRoom}
              placeholder="Skráðu inn dómsal"
              onBlur={(evt) => {
                const validateEmpty = validate(evt.target.value, 'empty')

                setWorkingCase({
                  ...workingCase,
                  courtRoom: evt.target.value,
                })

                if (
                  validateEmpty.isValid &&
                  workingCase.courtAttendees !== evt.target.value
                ) {
                  updateCase(
                    workingCase.id,
                    parseString('courtRoom', evt.target.value),
                  )
                } else {
                  setCourtroomErrorMessage(validateEmpty.errorMessage)
                }
              }}
              errorMessage={courtroomErrorMessage}
              hasError={courtroomErrorMessage !== ''}
              onFocus={() => setCourtroomErrorMessage('')}
              required
            />
          </Box>
          <Box component="section" marginBottom={8}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Verjandi
              </Text>
            </Box>
            <Box marginBottom={3}>
              <Input
                name="defenderName"
                label="Nafn verjanda"
                defaultValue={workingCase.defenderName}
                placeholder="Fullt nafn"
                onBlur={(evt) => {
                  if (evt.target.value !== workingCase.defenderName) {
                    setWorkingCase({
                      ...workingCase,
                      defenderName: evt.target.value,
                    })

                    updateCase(
                      workingCase.id,
                      parseString('defenderName', evt.target.value),
                    )
                  }
                }}
              />
            </Box>
            <Input
              name="defenderEmail"
              label="Netfang verjanda"
              defaultValue={workingCase.defenderEmail}
              placeholder="Netfang"
              onBlur={(evt) => {
                if (evt.target.value !== workingCase.defenderEmail) {
                  setWorkingCase({
                    ...workingCase,
                    defenderEmail: evt.target.value,
                  })

                  updateCase(
                    workingCase.id,
                    parseString('defenderEmail', evt.target.value),
                  )
                }
              }}
            />
          </Box>
          <FormFooter
            nextUrl={`${Constants.COURT_DOCUMENT_ROUTE}/${id}`}
            nextIsDisabled={isStepIllegal}
          />
        </>
      ) : null}
    </PageLayout>
  )
}

export default HearingArrangements
