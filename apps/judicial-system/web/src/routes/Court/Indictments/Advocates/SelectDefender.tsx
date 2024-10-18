import { ChangeEvent, FC, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Checkbox, Text } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  DefenderNotFound,
  FormContext,
  InputAdvocate,
} from '@island.is/judicial-system-web/src/components'
import {
  Defendant,
  DefenderChoice,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useDefendants } from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './Advocates.strings'

interface Props {
  defendant: Defendant
}

const SelectDefender: FC<Props> = ({ defendant }) => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const { setAndSendDefendantToServer } = useDefendants()

  const [defenderNotFound, setDefenderNotFound] = useState<boolean>(false)
  const gender = defendant.gender || 'NONE'

  const toggleDefendantWaivesRightToCounsel = useCallback(
    (
      caseId: string,
      defendant: Defendant,
      defendantWaivesRightToCounsel: boolean,
    ) => {
      const updateDefendantInput = {
        caseId,
        defendantId: defendant.id,
        defenderNationalId: defendantWaivesRightToCounsel
          ? ''
          : defendant.defenderNationalId,
        defenderName: defendantWaivesRightToCounsel
          ? ''
          : defendant.defenderName,
        defenderEmail: defendantWaivesRightToCounsel
          ? ''
          : defendant.defenderEmail,
        defenderPhoneNumber: defendantWaivesRightToCounsel
          ? ''
          : defendant.defenderPhoneNumber,
        defenderChoice:
          defendantWaivesRightToCounsel === true
            ? DefenderChoice.WAIVE
            : undefined,
      }

      setAndSendDefendantToServer(updateDefendantInput, setWorkingCase)
    },
    [setWorkingCase, setAndSendDefendantToServer],
  )

  return (
    <Box component="section" marginBottom={5}>
      {defenderNotFound && !workingCase.defendantWaivesRightToCounsel && (
        <DefenderNotFound />
      )}
      <BlueBox>
        <Box marginBottom={2}>
          <Text variant="h4">
            {`${capitalize(
              formatMessage(core.indictmentDefendant, { gender }),
            )} ${defendant.name}`}
          </Text>
        </Box>
        <Box marginBottom={2}>
          <Checkbox
            dataTestId={`defendantWaivesRightToCounsel-${defendant.id}`}
            name={`defendantWaivesRightToCounsel-${defendant.id}`}
            label={capitalize(
              formatMessage(strings.defendantWaivesRightToCounsel, {
                accused: formatMessage(core.indictmentDefendant, { gender }),
              }),
            )}
            checked={Boolean(defendant.defenderChoice === DefenderChoice.WAIVE)}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              toggleDefendantWaivesRightToCounsel(
                workingCase.id,
                defendant,
                event.target.checked,
              )
            }}
            filled
            large
          />
        </Box>
        <InputAdvocate
          disabled={defendant.defenderChoice === DefenderChoice.WAIVE}
          onAdvocateNotFound={setDefenderNotFound}
          clientId={defendant.id}
        />
      </BlueBox>
    </Box>
  )
}

export default SelectDefender
