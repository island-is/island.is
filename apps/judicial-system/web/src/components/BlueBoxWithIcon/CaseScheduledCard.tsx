import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'

import { Institution } from '../../graphql/schema'
import BlueBoxWithIcon from './BlueBoxWithIcon'
import { strings } from './CaseScheduledCard.strings'

interface Props {
  court: Institution
  courtDate: string
  courtRoom?: string | null
  title?: string | null
}

const CaseScheduledCard: FC<Props> = (props) => {
  const { court, courtDate, courtRoom, title } = props
  const { formatMessage } = useIntl()

  return (
    <BlueBoxWithIcon
      data={[
        {
          title: title ?? formatMessage(strings.scheduled),
          value: (
            <>
              <Text variant="eyebrow" marginBottom={1} marginTop={2}>
                {formatDate(courtDate, 'PPPp')}
              </Text>
              {<Text>{court.name}</Text>}
              <Text>
                {formatMessage(strings.courtRoom, {
                  courtRoom: courtRoom || 'NONE', // Must use || because courtRoom can be an empty string
                })}
              </Text>
            </>
          ),
        },
      ]}
      icon="calendar"
    />
  )
}

export default CaseScheduledCard
