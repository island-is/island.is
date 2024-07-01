import { FC } from 'react'
import { useIntl } from 'react-intl'
import format from 'date-fns/format'
import localeIS from 'date-fns/locale/is'
import parseISO from 'date-fns/parseISO'

import { Box, Text } from '@island.is/island-ui/core'
import {
  capitalize,
  formatDate,
  FormatPattern,
} from '@island.is/judicial-system/formatters'
import { courtSessionTypeNames } from '@island.is/judicial-system/types'
import { tables } from '@island.is/judicial-system-web/messages'
import { CourtSessionType } from '@island.is/judicial-system-web/src/graphql/schema'

interface Props {
  courtDate?: string | null
  postponedIndefinitelyExplanation?: string | null
  courtSessionType?: CourtSessionType | null
}

const PostponedCourtDate = () => {
  const { formatMessage } = useIntl()

  return <Text>{formatMessage(tables.postponed)}</Text>
}

const CourtDateWithCourtSessionType: FC<{
  courtDate: string
  courtSessionType: CourtSessionType
}> = ({ courtDate, courtSessionType }) => {
  return (
    <>
      <Text>{courtSessionTypeNames[courtSessionType]}</Text>
      <Text as="span" variant="small">
        {capitalize(
          format(parseISO(courtDate), 'EEEE', {
            locale: localeIS,
          }),
        ).substring(0, 3)}
        {'. '}
        {capitalize(
          formatDate(
            parseISO(courtDate),
            FormatPattern.LONG_DAY_DATE_YEAR_TIME,
            true,
          ),
        )}
      </Text>
    </>
  )
}

const SimpleCourtDate: FC<{ courtDate: string }> = ({ courtDate }) => {
  return (
    <>
      <Text>
        <Box component="span">
          {capitalize(
            formatDate(
              parseISO(courtDate),
              FormatPattern.LONG_DAY_DATE_YEAR,
              true,
            ),
          )}
        </Box>
      </Text>
      <Text as="span" variant="small">
        kl. {formatDate(parseISO(courtDate), FormatPattern.TIME)}
      </Text>
    </>
  )
}

const CourtDate: FC<Props> = ({
  courtDate,
  postponedIndefinitelyExplanation,
  courtSessionType,
}) => {
  if (postponedIndefinitelyExplanation) {
    return <PostponedCourtDate />
  }

  if (!courtDate) {
    return null
  }

  if (courtSessionType) {
    return (
      <CourtDateWithCourtSessionType
        courtDate={courtDate}
        courtSessionType={courtSessionType}
      />
    )
  }

  return <SimpleCourtDate courtDate={courtDate} />
}
export default CourtDate
