import React, { useState } from 'react'
import { Case, Institution } from '@island.is/judicial-system/types'
import { Box, Text, Tooltip } from '@island.is/island-ui/core'
import { newSetAndSendDateToServer } from '@island.is/judicial-system-web/src/utils/formHelper'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  DateTime,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import SelectProsecutor from '../../SharedComponents/SelectProsecutor/SelectProsecutor'
import SelectCourt from '../../SharedComponents/SelectCourt/SelectCourt'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  prosecutors: ReactSelectOption[]
  courts: Institution[]
  handleNextButtonClick: () => Promise<void>
  transitionLoading: boolean
}

const StepTwoForm: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    prosecutors,
    courts,
    handleNextButtonClick,
    transitionLoading,
  } = props
  const [arrestDateIsValid, setArrestDateIsValid] = useState(true)
  const [
    requestedCourtDateIsValid,
    setRequestedCourtDateIsValid,
  ] = useState<boolean>(workingCase.requestedCourtDate !== null)

  const { updateCase } = useCase()

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Óskir um fyrirtöku
          </Text>
        </Box>
        <Box component="section" marginBottom={5}>
          <SelectProsecutor
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            prosecutors={prosecutors}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <SelectCourt
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            courts={courts}
          />
        </Box>
        {!workingCase.parentCase && (
          <Box component="section" marginBottom={5}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                Tími handtöku
              </Text>
            </Box>
            <DateTime
              name="arrestDate"
              maxDate={new Date()}
              selectedDate={
                workingCase.arrestDate
                  ? new Date(workingCase.arrestDate)
                  : undefined
              }
              onChange={(date: Date | undefined, valid: boolean) => {
                newSetAndSendDateToServer(
                  'arrestDate',
                  date,
                  valid,
                  workingCase,
                  setWorkingCase,
                  setArrestDateIsValid,
                  updateCase,
                )
              }}
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
          previousUrl={`${Constants.STEP_ONE_ROUTE}/${workingCase.id}`}
          onNextButtonClick={async () => await handleNextButtonClick()}
          nextIsDisabled={
            transitionLoading ||
            !arrestDateIsValid ||
            !requestedCourtDateIsValid
          }
          nextIsLoading={transitionLoading}
        />
      </FormContentContainer>
    </>
  )
}

export default StepTwoForm
