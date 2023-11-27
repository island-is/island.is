import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Checkbox, Text } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import { isAcceptingCaseDecision } from '@island.is/judicial-system/types'

import { CaseDecision, CaseType } from '../../graphql/schema'
import { TempCase as Case } from '../../types'
import BlueBox from '../BlueBox/BlueBox'
import DateTime from '../DateTime/DateTime'
import { restrictionLength as strings } from './RestrictionLength.strings'

interface Props {
  workingCase: Case
  handleIsolationChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleIsolationDateChange: (date: Date | undefined, valid: boolean) => void
  handleValidToDateChange: (date: Date | undefined, valid: boolean) => void
}

const RestrictionLength: React.FC<Props> = (props) => {
  const {
    workingCase,
    handleIsolationChange,
    handleIsolationDateChange,
    handleValidToDateChange,
  } = props
  const { formatMessage } = useIntl()

  return (
    <Box component="section" marginBottom={5} data-testid="caseDecisionSection">
      <Box marginBottom={5}>
        <Text as="h3" variant="h3" marginBottom={3}>
          {capitalize(
            formatMessage(strings.caseType, {
              caseType:
                workingCase.decision ===
                CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                  ? CaseType.TRAVEL_BAN
                  : workingCase.type,
            }),
          )}
        </Text>
        <DateTime
          name="validToDate"
          datepickerLabel={formatMessage(strings.validToDateLabel, {
            caseType: capitalize(
              formatMessage(strings.caseType, {
                caseType:
                  workingCase.decision ===
                  CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                    ? CaseType.TRAVEL_BAN
                    : workingCase.type,
              }),
            ),
          })}
          selectedDate={workingCase.validToDate}
          minDate={new Date()}
          onChange={(date: Date | undefined, valid: boolean) => {
            handleValidToDateChange(date, valid)
          }}
          required
        />
      </Box>
      {(workingCase.type === CaseType.CUSTODY ||
        workingCase.type === CaseType.ADMISSION_TO_FACILITY) &&
        isAcceptingCaseDecision(workingCase.decision) && (
          <Box
            component="section"
            marginBottom={5}
            dataTestId="isolation-fields"
          >
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                {formatMessage(strings.title)}
              </Text>
            </Box>
            <BlueBox>
              <Box marginBottom={3}>
                <Checkbox
                  name="isCustodyIsolation"
                  label={formatMessage(strings.isolation)}
                  checked={workingCase.isCustodyIsolation}
                  onChange={handleIsolationChange}
                  filled
                  large
                />
              </Box>
              <DateTime
                name="isolationToDate"
                datepickerLabel={formatMessage(strings.isolationDateLable)}
                disabled={!workingCase.isCustodyIsolation}
                selectedDate={workingCase.isolationToDate}
                // Isolation can never be set in the past.
                minDate={new Date()}
                maxDate={
                  workingCase.validToDate
                    ? new Date(workingCase.validToDate)
                    : undefined
                }
                onChange={(date: Date | undefined, valid: boolean) =>
                  handleIsolationDateChange(date, valid)
                }
                blueBox={false}
                backgroundColor={
                  workingCase.isCustodyIsolation ? 'white' : 'blue'
                }
              />
            </BlueBox>
          </Box>
        )}
    </Box>
  )
}

export default RestrictionLength
