import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import type { Case, Institution, User } from '@island.is/judicial-system/types'
import { Box, Input, Text, Checkbox } from '@island.is/island-ui/core'
import { newSetAndSendDateToServer } from '@island.is/judicial-system-web/src/utils/formHelper'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  DateTime,
  FormContentContainer,
  FormFooter,
  BlueBox,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { rcRequestedHearingArrangements } from '@island.is/judicial-system-web/messages'
import SelectProsecutor from '../../SharedComponents/SelectProsecutor/SelectProsecutor'
import SelectCourt from '../../SharedComponents/SelectCourt/SelectCourt'
import RequestCourtDate from '../../SharedComponents/RequestCourtDate/RequestCourtDate'
import { useCaseFormHelper } from '@island.is/judicial-system-web/src/utils/useFormHelper'
import { isHearingArrangementsStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import { ValueType } from 'react-select/src/types'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  prosecutors: ReactSelectOption[]
  courts: Institution[]
  handleNextButtonClick: () => Promise<void>
  onProsecutorChange: (selectedOption: ValueType<ReactSelectOption>) => boolean
  transitionLoading: boolean
  user?: User
}

const StepTwoForm: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    prosecutors,
    courts,
    handleNextButtonClick,
    onProsecutorChange,
    transitionLoading,
    user,
  } = props
  const [, setArrestDateIsValid] = useState(true)
  const [, setRequestedCourtDateIsValid] = useState<boolean>(
    workingCase.requestedCourtDate !== null,
  )
  const [, setSelectedCourt] = useState<string>()
  const { formatMessage } = useIntl()
  const { updateCase } = useCase()
  const {
    validateAndSendToServer,
    setField,
    setAndSendToServer,
  } = useCaseFormHelper(workingCase, setWorkingCase, {})

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(rcRequestedHearingArrangements.heading)}
          </Text>
        </Box>
        <Box component="section" marginBottom={5}>
          <BlueBox>
            <Box marginBottom={2}>
              <SelectProsecutor
                workingCase={workingCase}
                prosecutors={prosecutors}
                onChange={onProsecutorChange}
              />
            </Box>
            <Checkbox
              name="isHeightenedSecurityLevel"
              label={formatMessage(
                rcRequestedHearingArrangements.sections.prosecutor
                  .heightenSecurityLevelLabel,
              )}
              tooltip={formatMessage(
                rcRequestedHearingArrangements.sections.prosecutor
                  .heightenSecurityLevelInfo,
              )}
              disabled={
                user?.id !== workingCase.creatingProsecutor?.id &&
                user?.id !==
                  (((workingCase as unknown) as { prosecutorId: string })
                    .prosecutorId ?? workingCase.prosecutor?.id)
              }
              checked={workingCase.isHeightenedSecurityLevel}
              onChange={(event) => setAndSendToServer(event.target)}
              large
              filled
            />
          </BlueBox>
        </Box>
        <Box component="section" marginBottom={5}>
          <SelectCourt
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            setSelectedCourt={setSelectedCourt}
            courts={courts}
          />
        </Box>
        {!workingCase.parentCase && (
          <Box component="section" marginBottom={5}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                {formatMessage(
                  rcRequestedHearingArrangements.sections.arrestDate.heading,
                )}
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
        <Box component="section" marginBottom={5}>
          <RequestCourtDate
            workingCase={workingCase}
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
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(
                rcRequestedHearingArrangements.sections.translator.heading,
              )}
            </Text>
          </Box>
          <Input
            data-testid="translator"
            name="translator"
            autoComplete="off"
            label={formatMessage(
              rcRequestedHearingArrangements.sections.translator.label,
            )}
            placeholder={formatMessage(
              rcRequestedHearingArrangements.sections.translator.placeholder,
            )}
            defaultValue={workingCase.translator}
            onChange={(event) => setField(event.target)}
            onBlur={(event) => validateAndSendToServer(event.target)}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.STEP_ONE_ROUTE}/${workingCase.id}`}
          onNextButtonClick={async () => await handleNextButtonClick()}
          nextIsDisabled={
            !isHearingArrangementsStepValidRC(workingCase) || transitionLoading
          }
          nextIsLoading={transitionLoading}
        />
      </FormContentContainer>
    </>
  )
}

export default StepTwoForm
