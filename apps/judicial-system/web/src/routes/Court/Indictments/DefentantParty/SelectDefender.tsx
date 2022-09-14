import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Checkbox, Text } from '@island.is/island-ui/core'
import {
  BlueBox,
  SectionHeading,
  DefenderInput,
  DefenderNotFound,
} from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { core } from '@island.is/judicial-system-web/messages'

import { defentantParty as m } from './DefentantParty.strings'
import { capitalize } from '@island.is/judicial-system/formatters'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { UpdateCaseInput } from '@island.is/judicial-system-web/src/graphql/schema'
import { UpdateCase } from '@island.is/judicial-system/types'

const SelectDefender: React.FC = () => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { setAndSendToServer } = useCase()
  const { formatMessage } = useIntl()

  const [defenderNotFound, setDefenderNotFound] = useState<boolean>(false)
  const [noDefenderChecked, setNoDefenderChecked] = useState<boolean>(false)

  const clearDefender = useCallback(() => {
    // TODO: getting around typescript to be able to unset defender
    // should updatee setAndSendToServer to accept UpdateCaseInput
    const updateCaseInput: Omit<UpdateCaseInput, 'id'> = {
      defenderNationalId: null,
      defenderName: null,
      defenderEmail: '',
      defenderPhoneNumber: '',
    }
    setAndSendToServer(
      [
        {
          ...(updateCaseInput as UpdateCase),
          force: true,
        },
      ],
      workingCase,
      setWorkingCase,
    )
  }, [workingCase, setWorkingCase, setAndSendToServer])

  return workingCase.defendants && workingCase.defendants[0] ? (
    <Box component="section" marginBottom={5}>
      <SectionHeading title={formatMessage(m.selectDefenderHeading)} required />
      {defenderNotFound && <DefenderNotFound />}
      <BlueBox>
        <Box marginBottom={2}>
          <Text variant="h4">
            {`${capitalize(
              formatMessage(core.indictmentDefendant, {
                gender: workingCase.defendants[0].gender || 'NONE',
              }),
            )} ${workingCase.defendants[0].name}`}
          </Text>
        </Box>
        <Box marginBottom={2}>
          <Checkbox
            name="defentantRejectsHavingDefender"
            label={'Ákærði óskar eftir einvherju rugli'}
            checked={noDefenderChecked}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.target.checked) {
                clearDefender()
              }
              setNoDefenderChecked(event.target.checked)
            }}
            filled
            large
          />
        </Box>
        <DefenderInput
          disabled={noDefenderChecked}
          onDefenderNotFound={setDefenderNotFound}
        />
      </BlueBox>
    </Box>
  ) : null
}

export default SelectDefender
