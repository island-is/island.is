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
import {
  CaseType,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { getDefendantLabel } from '../CaseInfo/CaseInfo'

interface Props {
  policeCaseNumber: string
  subtypes?: IndictmentSubtypeMap
  crimeScenes?: CrimeSceneMap
  defendants?: Pick<Defendant, 'name' | 'policeCaseNumbers' | 'gender'>[] | null
}

/** Bold label + normal value on one line. */
const LabelLine: FC<{
  label: string
  body: string
}> = ({ label, body }) => (
  <Text variant="small" as="div">
    <Text as="span" variant="small" fontWeight="semiBold">
      {label}
    </Text>
    <Text as="span" variant="small">{` ${body}`}</Text>
  </Text>
)

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

  const linkedDefendants =
    defendants?.filter((d) =>
      d.policeCaseNumbers?.includes(policeCaseNumber),
    ) ?? []

  const defendantNames = linkedDefendants
    .map((d) => d.name)
    .filter((name): name is string => Boolean(name))

  const showDefendants = defendantNames.length > 0

  const defendantHeading = showDefendants
    ? `${capitalize(
        getDefendantLabel(
          formatMessage,
          linkedDefendants as Defendant[],
          CaseType.INDICTMENT,
        ),
      )}:`
    : ''

  const readableSubtypes = capitalize(
    readableIndictmentSubtypes([policeCaseNumber], subtypes).join(', '),
  )
  const place = crimeScenes[policeCaseNumber]?.place
  const date = crimeScenes[policeCaseNumber]?.date

  const dateAndPlaceBody =
    place && date
      ? `${place} - ${formatDate(date, 'PPP')}`
      : place
      ? `${place}`
      : `${formatDate(date, 'PPP')}`

  return (
    <>
      {showDefendants && (
        <LabelLine label={defendantHeading} body={defendantNames.join(', ')} />
      )}
      <Box>
        {readableSubtypes && (
          <LabelLine label="Sakarefni:" body={readableSubtypes} />
        )}
      </Box>
      {(place || date) && (
        <LabelLine label="Vettvangur og tími:" body={dateAndPlaceBody} />
      )}
    </>
  )
}

export default IndictmentInfo
