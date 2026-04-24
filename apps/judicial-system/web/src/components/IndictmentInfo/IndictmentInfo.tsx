import { FC } from 'react'
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
import { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'

import { indictmentInfo as strings } from './IndictmentInfo.strings'

interface Props {
  policeCaseNumber: string
  subtypes?: IndictmentSubtypeMap
  crimeScenes?: CrimeSceneMap
  defendants?: Pick<Defendant, 'name' | 'policeCaseNumbers'>[]
}

const IndictmentInfo: FC<Props> = ({
  policeCaseNumber,
  subtypes,
  crimeScenes,
  defendants,
}) => {
  const { formatMessage } = useIntl()

  if (!subtypes || !crimeScenes) {
    return null
  }

  const defendantNames = defendants
    ?.filter((d) => d.policeCaseNumbers?.includes(policeCaseNumber))
    .map((d) => d.name)
    .filter((name): name is string => Boolean(name))

  const showDefendants =
    defendants &&
    defendants.length > 1 &&
    defendantNames &&
    defendantNames.length > 0

  const readableSubtypes = capitalize(
    readableIndictmentSubtypes([policeCaseNumber], subtypes).join(', '),
  )
  const place = crimeScenes[policeCaseNumber]?.place
  const date = crimeScenes[policeCaseNumber]?.date

  return (
    <>
      {showDefendants && (
        <Text variant="small" fontWeight="semiBold">
          {formatMessage(strings.defendants, {
            defendants: defendantNames.join(', '),
          })}
        </Text>
      )}
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
