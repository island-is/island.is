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
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { UpdateDefendantInput } from '@island.is/judicial-system-web/src/graphql/schema'
import { Defendant, UpdateCase } from '@island.is/judicial-system/types'
import useDefendants from '@island.is/judicial-system-web/src/utils/hooks/useDefendants'

import { prosecutorAndDefender as m } from './ProsecutorAndDefender.strings'

interface Props {
  defendant: Defendant
}

const SelectDefender: React.FC<Props> = (props) => {
  const { defendant } = props
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { setAndSendToServer } = useCase()
  const { formatMessage } = useIntl()
  const { createDefendant, updateDefendant, deleteDefendant } = useDefendants()

  const [defenderNotFound, setDefenderNotFound] = useState<boolean>(false)
  const gender = defendant.gender || 'NONE'

  const onRefuseHavingDefender = useCallback(
    (defendant: Defendant) => {
      // TODO: getting around typescript to be able to unset defender
      // should updatee setAndSendToServer to accept UpdateCaseInput
      const updateDefendantInput: UpdateDefendantInput = {
        ...defendant,
        defendantId: defendant.id,
        defenderNationalId: null,
        defenderName: null,
        defenderEmail: '',
        defenderPhoneNumber: '',
        defendantWaivesRightToCounsel: true,
      }

      updateDefendant(updateDefendantInput)
    },
    [workingCase, setWorkingCase, setAndSendToServer],
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
            name="defendantWaivesRightToCounsel"
            label={capitalize(
              formatMessage(m.defendantWaivesRightToCounsel, {
                accused: formatMessage(core.indictmentDefendant, { gender }),
              }),
            )}
            checked={workingCase.defendantWaivesRightToCounsel}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.target.checked) {
                onRefuseHavingDefender(defendant)
              } else {
                setAndSendToServer(
                  [{ defendantWaivesRightToCounsel: false, force: true }],
                  workingCase,
                  setWorkingCase,
                )
              }
            }}
            filled
            large
          />
        </Box>
        <DefenderInput
          disabled={workingCase.defendantWaivesRightToCounsel}
          onDefenderNotFound={setDefenderNotFound}
        />
      </BlueBox>
    </Box>
  )
}

export default SelectDefender
