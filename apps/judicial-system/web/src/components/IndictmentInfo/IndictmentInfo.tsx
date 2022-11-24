import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import {
  CrimeSceneMap,
  IndictmentSubtypeMap,
} from '@island.is/judicial-system/types'

import { indictmentInfo as strings } from './IndictmentInfo.strings'
import {
  capitalize,
  formatDate,
  indictmentSubtypes,
  readableIndictmentSubtypes,
} from '@island.is/judicial-system/formatters'

interface Props {
  policeCaseNumber: string
  subtypes?: IndictmentSubtypeMap
  crimeScenes?: CrimeSceneMap
}

const IndictmentInfo: React.FC<Props> = (props) => {
  const { policeCaseNumber, subtypes, crimeScenes } = props
  const { formatMessage } = useIntl()

  if (!subtypes || !crimeScenes) {
    return null
  }

  return (
    <>
      <Box>
        <Text variant="small">
          {formatMessage(strings.subtypes, {
            subtypes: capitalize(
              readableIndictmentSubtypes([policeCaseNumber], subtypes).join(
                ', ',
              ) || '-',
            ),
          })}
        </Text>
      </Box>
      <Text variant="small">
        {formatMessage(strings.dateAndPlace, {
          place: crimeScenes[policeCaseNumber]?.place || '-',
          date: crimeScenes[policeCaseNumber]?.date
            ? formatDate(crimeScenes[policeCaseNumber]?.date, 'PPPP')
            : '-',
        })}
      </Text>
    </>
  )
}

export default IndictmentInfo
