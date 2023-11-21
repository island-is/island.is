import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import {
  capitalize,
  formatDate,
  readableIndictmentSubtypes,
} from '@island.is/judicial-system/formatters'
import {
  CrimeSceneMap,
  IndictmentSubtypeMap,
} from '@island.is/judicial-system/types'

import { indictmentInfo as strings } from './IndictmentInfo.strings'

interface Props {
  policeCaseNumber: string
  subtypes?: IndictmentSubtypeMap
  crimeScenes?: CrimeSceneMap
}

const IndictmentInfo: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const { policeCaseNumber, subtypes, crimeScenes } = props
  const { formatMessage } = useIntl()

  if (!subtypes || !crimeScenes) {
    return null
  }

  const readableSubtypes = capitalize(
    readableIndictmentSubtypes([policeCaseNumber], subtypes).join(', '),
  )
  const place = crimeScenes[policeCaseNumber]?.place
  const date = crimeScenes[policeCaseNumber]?.date

  return (
    <>
      <Box>
        {readableSubtypes && (
          <Text variant="small">
            {formatMessage(strings.subtypes, {
              subtypes: readableSubtypes,
            })}
          </Text>
        )}
      </Box>
      {(place || date) && (
        <Text variant="small">
          {formatMessage(strings.dateAndPlace, {
            dateAndPlace:
              place && date
                ? `${place} - ${formatDate(date, 'PPP')}`
                : place
                ? `${place}`
                : `${formatDate(date, 'PPP')}`,
          })}
        </Text>
      )}
    </>
  )
}

export default IndictmentInfo
