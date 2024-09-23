import { useIntl } from 'react-intl'
import parseISO from 'date-fns/parseISO'

import { Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { tables } from '@island.is/judicial-system-web/messages'
import { CaseState } from '@island.is/judicial-system-web/src/graphql/schema'

export const getDurationDate = (
  state?: CaseState | null,
  validToDate?: string | null,
  initialRulingDate?: string | null,
  rulingDate?: string | null,
): string | null => {
  if (
    (state && [CaseState.REJECTED, CaseState.DISMISSED].includes(state)) ||
    !validToDate
  ) {
    return null
  } else if (initialRulingDate) {
    return `${formatDate(parseISO(initialRulingDate))} - ${formatDate(
      parseISO(validToDate),
    )}`
  } else if (rulingDate) {
    return `${formatDate(parseISO(rulingDate))} - ${formatDate(
      parseISO(validToDate),
    )}`
  } else if (validToDate) {
    return formatDate(parseISO(validToDate)) || null
  }
  return null
}

const DurationDate = ({ date }: { date: string | null }) => {
  const { formatMessage } = useIntl()
  if (!date) {
    return null
  }

  return (
    <Text fontWeight={'medium'} variant="small">
      {`${formatMessage(tables.duration)} ${date}`}
    </Text>
  )
}
export default DurationDate
