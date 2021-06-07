import React, { useState } from 'react'
import { Box, Input, Text } from '@island.is/island-ui/core'
import {
  DateTime,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'
import { Case } from '@island.is/judicial-system/types'
import {
  newSetAndSendDateToServer,
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  FormSettings,
  useCaseFormHelper,
} from '@island.is/judicial-system-web/src/utils/useFormHelper'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
}

const PoliceDemandsForm: React.FC<Props> = (props) => {
  const validations: FormSettings = {
    // TODO: Add police demands
    // policeDemands: {
    //   validations: ['empty'],
    // },
    lawsBroken: {
      validations: ['empty'],
    },
    // TODO: Add custodyProvisions freetext
  }
  const { workingCase, setWorkingCase } = props
  const { updateCase } = useCase()
  const [, setRequestedValidToDateIsValid] = useState<boolean>(true)
  const [policeDemandsEM, setPoliceDemandsEM] = useState<string>('')
  const [lawsBrokenEM, setLawsBrokenEM] = useState<string>('')
  const { isValid } = useCaseFormHelper(
    workingCase,
    setWorkingCase,
    validations,
  )

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Dómkröfur og lagagrundvöllur
          </Text>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              Gildistími heimildar
            </Text>
          </Box>
          <DateTime
            name="reqValidToDate"
            datepickerLabel="Heimild gildir til:"
            minDate={new Date()}
            selectedDate={
              workingCase.requestedValidToDate
                ? new Date(workingCase.requestedValidToDate)
                : undefined
            }
            onChange={(date: Date | undefined, valid: boolean) => {
              newSetAndSendDateToServer(
                'requestedValidToDate',
                date,
                valid,
                workingCase,
                setWorkingCase,
                setRequestedValidToDateIsValid,
                updateCase,
              )
            }}
          />
        </Box>

        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              Dómkröfur
            </Text>
          </Box>
          <Input
            data-testid="police-demands"
            name="police-demands"
            label="Krafa lögreglu"
            placeholder="Krafa ákæranda"
            defaultValue={workingCase?.policeDemands}
            errorMessage={policeDemandsEM}
            hasError={policeDemandsEM !== ''}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'policeDemands',
                event,
                ['empty'],
                workingCase,
                setWorkingCase,
                policeDemandsEM,
                setPoliceDemandsEM,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'policeDemands',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setPoliceDemandsEM,
              )
            }
            required
            textarea
            rows={7}
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
            errorMessage={lawsBrokenEM}
            hasError={lawsBrokenEM !== ''}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'lawsBroken',
                event,
                ['empty'],
                workingCase,
                setWorkingCase,
                lawsBrokenEM,
                setLawsBrokenEM,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'lawsBroken',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setLawsBrokenEM,
              )
            }
            required
            textarea
            rows={7}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.R_CASE_HEARING_ARRANGEMENTS_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.R_CASE_POLICE_REPORT_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isValid}
          nextIsLoading={false}
        />
      </FormContentContainer>
    </>
  )
}

export default PoliceDemandsForm
