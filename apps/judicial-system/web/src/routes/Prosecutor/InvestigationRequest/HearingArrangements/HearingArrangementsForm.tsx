import React, { useState } from 'react'
import { Case, Institution } from '@island.is/judicial-system/types'
import {
  DateTime,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'
import { Box, Text, Tooltip } from '@island.is/island-ui/core'
import SelectProsecutor from '../../SharedComponents/SelectProsecutor/SelectProsecutor'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import SelectCourt from '../../SharedComponents/SelectCourt/SelectCourt'
import {
  FormSettings,
  useCaseFormHelper,
} from '@island.is/judicial-system-web/src/utils/useFormHelper'
import { newSetAndSendDateToServer } from '@island.is/judicial-system-web/src/utils/formHelper'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  prosecutors: ReactSelectOption[]
  courts: Institution[]
  isLoading: boolean
}

const HearingArrangementsForms: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, prosecutors, courts, isLoading } = props
  const validations: FormSettings = {
    requestedCourtDate: {
      validations: ['empty'],
    },
    prosecutor: {
      validations: ['empty'],
    },
    court: {
      validations: ['empty'],
    },
  }
  const [, setRequestedCourtDateIsValid] = useState<boolean>(
    workingCase.requestedCourtDate !== null,
  )
  const { isValid } = useCaseFormHelper(
    workingCase,
    setWorkingCase,
    validations,
  )

  const { updateCase } = useCase()

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Óskir um fyrirtöku
          </Text>
        </Box>
        {prosecutors && (
          <Box component="section" marginBottom={5}>
            <SelectProsecutor
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
              prosecutors={prosecutors}
            />
          </Box>
        )}
        {courts && (
          <Box component="section" marginBottom={5}>
            <SelectCourt
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
              courts={courts}
            />
          </Box>
        )}
        <Box component="section" marginBottom={10}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              Ósk um fyrirtökudag og tíma{' '}
              <Box data-testid="requested-court-date-tooltip" component="span">
                <Tooltip text="Dómstóll hefur þennan tíma til hliðsjónar þegar fyrirtökutíma er úthlutað og mun leitast við að taka málið fyrir í tæka tíð en ekki fyrir þennan tíma." />
              </Box>
            </Text>
          </Box>
          <DateTime
            name="reqCourtDate"
            selectedDate={
              workingCase.requestedCourtDate
                ? new Date(workingCase.requestedCourtDate)
                : undefined
            }
            onChange={(date: Date | undefined, valid: boolean) =>
              newSetAndSendDateToServer(
                'requestedCourtDate',
                date,
                valid,
                workingCase,
                setWorkingCase,
                setRequestedCourtDateIsValid,
                updateCase,
              )
            }
            timeLabel="Ósk um tíma (kk:mm)"
            locked={workingCase.courtDate !== null}
            minDate={new Date()}
            required
          />
          {workingCase.courtDate && (
            <Box marginTop={1}>
              <Text variant="eyebrow">
                Fyrirtökudegi og tíma hefur verið úthlutað
              </Text>
            </Box>
          )}
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.R_CASE_DEFENDANT_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.R_CASE_POLICE_DEMANDS_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isValid}
          nextIsLoading={isLoading}
        />
      </FormContentContainer>
    </>
  )
}

export default HearingArrangementsForms
