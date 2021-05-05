import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { Case, CaseType } from '@island.is/judicial-system/types'
import { DateTime } from '@island.is/judicial-system-web/src/shared-components'
import { newSetAndSendDateToServer } from '@island.is/judicial-system-web/src/utils/formHelper'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  setRequestedCustodyEndDateIsValid: React.Dispatch<
    React.SetStateAction<boolean>
  >
}

const StepThreeForm: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    setRequestedCustodyEndDateIsValid,
  } = props
  const { updateCase } = useCase()

  return (
    <>
      <Box marginBottom={7}>
        <Text as="h1" variant="h1">
          Dómkröfur og lagagrundvöllur
        </Text>
      </Box>
      <Box component="section" marginBottom={5}>
        <Box marginBottom={3}>
          <Text as="h3" variant="h3">
            Dómkröfur
          </Text>
          {workingCase.parentCase && (
            <Box marginTop={1}>
              <Text>
                Fyrri gæsla var/er til{' '}
                <Text as="span" fontWeight="semiBold">
                  {formatDate(
                    workingCase.parentCase.custodyEndDate,
                    'PPPPp',
                  )?.replace('dagur,', 'dagsins')}
                </Text>
              </Text>
            </Box>
          )}
        </Box>
        <DateTime
          name="reqCustodyEndDate"
          datepickerLabel={`${
            workingCase.type === CaseType.CUSTODY ? 'Gæsluvarðhald' : 'Farbann'
          } til`}
          minDate={new Date()}
          selectedDate={
            workingCase.requestedCustodyEndDate
              ? new Date(workingCase.requestedCustodyEndDate)
              : undefined
          }
          onChange={(date: Date | undefined, valid: boolean) => {
            newSetAndSendDateToServer(
              'requestedCustodyEndDate',
              date,
              valid,
              workingCase,
              setWorkingCase,
              setRequestedCustodyEndDateIsValid,
              updateCase,
            )
          }}
          required
        />
      </Box>
    </>
  )
}

export default StepThreeForm
