import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Checkbox, Text } from '@island.is/island-ui/core'
import {
  BlueBox,
  DefenderInput,
  DefenderNotFound,
} from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { core } from '@island.is/judicial-system-web/messages'
import { capitalize } from '@island.is/judicial-system/formatters'
import { Defendant, UpdateDefendant } from '@island.is/judicial-system/types'
import useDefendants from '@island.is/judicial-system-web/src/utils/hooks/useDefendants'

import { prosecutorAndDefender as m } from './ProsecutorAndDefender.strings'

interface Props {
  defendant: Defendant
}

const SelectDefender: React.FC<Props> = (props) => {
  const { defendant } = props
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
      const updateDefendantInput: UpdateDefendant = {
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
        defendantWaivesRightToCounsel,
      }

      setAndSendDefendantToServer(
        caseId,
        defendant.id,
        updateDefendantInput,
        setWorkingCase,
      )
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
              formatMessage(m.defendantWaivesRightToCounsel, {
                accused: formatMessage(core.indictmentDefendant, { gender }),
              }),
            )}
            checked={defendant.defendantWaivesRightToCounsel}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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
        <DefenderInput
          disabled={defendant.defendantWaivesRightToCounsel}
          onDefenderNotFound={setDefenderNotFound}
          defendantId={defendant.id}
        />
      </BlueBox>
    </Box>
  )
}

export default SelectDefender
