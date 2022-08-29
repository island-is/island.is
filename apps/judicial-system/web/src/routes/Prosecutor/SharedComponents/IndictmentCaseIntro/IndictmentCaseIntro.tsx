import React from 'react'
import { IntlShape, useIntl } from 'react-intl'
import flatMap from 'lodash/flatMap'

import { Box, Text } from '@island.is/island-ui/core'
import { Case, Defendant } from '@island.is/judicial-system/types'
import { enumerate } from '@island.is/judicial-system-web/src/utils/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import { capitalize } from '@island.is/judicial-system/formatters'

import PoliceCaseNumbersTags from '../PoliceCaseNumbersTags/PoliceCaseNumbersTags'

const Entry: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  return (
    <Text color="dark400" fontWeight="semiBold" paddingTop={'smallGutter'}>
      {`${label}: ${value}`}
    </Text>
  )
}

interface Props {
  workingCase: Case
}

export const getDefantantLabel = (
  formatMessage: IntlShape['formatMessage'],
  defantants: Defendant[],
) => {
  if (defantants.length === 1) {
    return formatMessage(core.indictmentDefendant, {
      gender: defantants[0].gender,
    })
  }

  return formatMessage(core.indictmentDefendants)
}

const IndictmentCaseIntro: React.FC<Props> = ({ workingCase }) => {
  const { policeCaseNumbers, defendants, court } = workingCase
  const { formatMessage } = useIntl()
  return (
    <Box marginBottom={5}>
      <PoliceCaseNumbersTags policeCaseNumbers={policeCaseNumbers} />
      {court?.name && (
        <Entry label={formatMessage(core.court)} value={court?.name} />
      )}
      {defendants && (
        <Entry
          label={capitalize(getDefentantLabel(formatMessage, defendants))}
          value={enumerate(
            flatMap(defendants, (d) => (d.name ? [d.name] : [])),
            formatMessage(core.and),
          )}
        />
      )}
    </Box>
  )
}

export default IndictmentCaseIntro
