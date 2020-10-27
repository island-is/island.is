import React, { useEffect, useRef, useState } from 'react'
import { isNextDisabled, updateState } from '../../../utils/stepHelper'
import { FormFooter } from '../../../shared-components/FormFooter'
import * as Constants from '../../../utils/constants'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components/PageLayout/PageLayout'
import { Case } from '@island.is/judicial-system-web/src/types'
import {
  Box,
  DatePicker,
  GridColumn,
  GridRow,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { formatDate, TIME_FORMAT } from '@island.is/judicial-system/formatters'
import { formatISO, parseISO } from 'date-fns'
import * as api from '../../../api'
import {
  parseString,
  parseTime,
} from '@island.is/judicial-system-web/src/utils/formatters'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'

export const HearingArrangements: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [
    requestedCourtTimeErrorMessage,
    setRequestedCourtTimeErrorMessage,
  ] = useState<string>('')
  const requestedCourtTimeRef = useRef<HTMLInputElement>()

  useEffect(() => {
    document.title = 'Fyrirtaka - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    const wc: Case = JSON.parse(window.localStorage.getItem('workingCase'))

    if (wc && !workingCase) {
      setWorkingCase(wc)
    }
  }, [workingCase, setWorkingCase])

  return workingCase ? (
    <PageLayout activeSection={1} activeSubSection={1}>
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
        <GridRow>
          <GridColumn span="5/8">
            <DatePicker
              label="Veldu dagsetningu"
              placeholderText="Veldu dagsetningu"
              locale="is"
              minDate={new Date()}
              selected={
                // TODO: Change to something else
                workingCase.requestedCourtDate
                  ? parseISO(workingCase.requestedCourtDate.toString())
                  : null
              }
              handleChange={(date) => {
                const formattedDate = formatISO(date, {
                  representation:
                    workingCase.requestedCourtDate?.indexOf('T') > -1
                      ? 'complete'
                      : 'date',
                })

                updateState(
                  workingCase,
                  'requestedCourtDate',
                  formattedDate,
                  setWorkingCase,
                )

                api.saveCase(
                  workingCase.id,
                  parseString('requestedCourtDate', formattedDate),
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
                const requestedCourtDateMinutes = parseTime(
                  workingCase.requestedCourtDate,
                  evt.target.value,
                )
                const validateTimeEmpty = validate(evt.target.value, 'empty')
                const validateTimeFormat = validate(
                  evt.target.value,
                  'time-format',
                )

                updateState(
                  workingCase,
                  'requestedCourtDate',
                  requestedCourtDateMinutes,
                  setWorkingCase,
                )

                if (validateTimeEmpty.isValid && validateTimeFormat.isValid) {
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
        nextUrl={Constants.COURT_DOCUMENT_ROUTE}
        nextIsDisabled={isNextDisabled([
          { value: workingCase.courtCaseNumber, validations: ['empty'] },
        ])}
      />
    </PageLayout>
  ) : null
}

export default HearingArrangements
