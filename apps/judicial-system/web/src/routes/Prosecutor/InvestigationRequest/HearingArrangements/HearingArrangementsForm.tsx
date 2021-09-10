import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import type { Case, Institution } from '@island.is/judicial-system/types'
import {
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'
import { Box, Input, Text } from '@island.is/island-ui/core'
import SelectProsecutor from '../../SharedComponents/SelectProsecutor/SelectProsecutor'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import SelectCourt from '../../SharedComponents/SelectCourt/SelectCourt'
import {
  FormSettings,
  useCaseFormHelper,
} from '@island.is/judicial-system-web/src/utils/useFormHelper'
import { newSetAndSendDateToServer } from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import RequestCourtDate from '../../SharedComponents/RequestCourtDate/RequestCourtDate'
import { icRequestedHearingArrangements } from '@island.is/judicial-system-web/messages'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  prosecutors: ReactSelectOption[]
  courts: Institution[]
  isLoading: boolean
  handleNextButtonClick: () => Promise<void>
}

const HearingArrangementsForms: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    prosecutors,
    courts,
    isLoading,
    handleNextButtonClick,
  } = props

  const { formatMessage } = useIntl()

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
  const { isValid, setField, validateAndSendToServer } = useCaseFormHelper(
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
            {formatMessage(icRequestedHearingArrangements.heading)}
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
                icRequestedHearingArrangements.sections.translator.heading,
              )}
            </Text>
          </Box>
          <Input
            data-testid="translator"
            name="translator"
            autoComplete="off"
            label={formatMessage(
              icRequestedHearingArrangements.sections.translator.label,
            )}
            placeholder={formatMessage(
              icRequestedHearingArrangements.sections.translator.placeholder,
            )}
            defaultValue={workingCase.translator}
            onChange={(event) => setField(event.target)}
            onBlur={(event) => validateAndSendToServer(event.target)}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.IC_DEFENDANT_ROUTE}/${workingCase.id}`}
          onNextButtonClick={async () => await handleNextButtonClick()}
          nextIsDisabled={!isValid}
          nextIsLoading={isLoading}
        />
      </FormContentContainer>
    </>
  )
}

export default HearingArrangementsForms
