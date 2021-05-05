import React, { useState } from 'react'
import { Box, Text, Input } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { Case, CaseType } from '@island.is/judicial-system/types'
import {
  BlueBox,
  DateTime,
} from '@island.is/judicial-system-web/src/shared-components'
import {
  newSetAndSendDateToServer,
  removeTabsValidateAndSet,
  setCheckboxAndSendToServer,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import CheckboxList from '@island.is/judicial-system-web/src/shared-components/CheckboxList/CheckboxList'
import {
  custodyProvisions,
  travelBanProvisions,
} from '@island.is/judicial-system-web/src/utils/laws'

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
  const [lawsBrokenErrorMessage, setLawsBrokenErrorMessage] = useState<string>(
    '',
  )

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
      <Box component="section" marginBottom={7}>
        <Box marginBottom={3}>
          <Text as="h3" variant="h3">
            Lagaákvæði sem brot varða við
          </Text>
        </Box>
        <Input
          data-testid="lawsBroken"
          name="lawsBroken"
          label="Lagaákvæði sem ætluð brot kærða þykja varða við"
          placeholder="Skrá inn þau lagaákvæði sem brotið varðar við, til dæmis 1. mgr. 244 gr. almennra hegningarlaga nr. 19/1940..."
          defaultValue={workingCase?.lawsBroken}
          errorMessage={lawsBrokenErrorMessage}
          hasError={lawsBrokenErrorMessage !== ''}
          onChange={(event) =>
            removeTabsValidateAndSet(
              'lawsBroken',
              event,
              ['empty'],
              workingCase,
              setWorkingCase,
              lawsBrokenErrorMessage,
              setLawsBrokenErrorMessage,
            )
          }
          onBlur={(event) =>
            validateAndSendToServer(
              'lawsBroken',
              event.target.value,
              ['empty'],
              workingCase,
              updateCase,
              setLawsBrokenErrorMessage,
            )
          }
          required
          textarea
          rows={7}
        />
      </Box>
      <Box component="section" marginBottom={5}>
        <Box marginBottom={3}>
          <Text as="h3" variant="h3">
            Lagaákvæði sem krafan er byggð á{' '}
            <Text as="span" color={'red600'} fontWeight="semiBold">
              *
            </Text>
          </Text>
        </Box>
        <BlueBox>
          <CheckboxList
            checkboxes={
              workingCase.type === CaseType.CUSTODY
                ? custodyProvisions
                : travelBanProvisions
            }
            selected={workingCase.custodyProvisions}
            onChange={(id) =>
              setCheckboxAndSendToServer(
                'custodyProvisions',
                id,
                workingCase,
                setWorkingCase,
                updateCase,
              )
            }
          />
        </BlueBox>
      </Box>
    </>
  )
}

export default StepThreeForm
