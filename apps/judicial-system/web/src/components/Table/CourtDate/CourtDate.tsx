import { FC } from 'react'
import { useIntl } from 'react-intl'
import format from 'date-fns/format'
import localeIS from 'date-fns/locale/is'
import parseISO from 'date-fns/parseISO'

import { Box, Text } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import { tables } from '@island.is/judicial-system-web/messages'

interface Props {
  courtDate?: string | null
  postponedIndefinitelyExplanation?: string | null
}

const CourtDate: FC<Props> = (props) => {
  const { courtDate, postponedIndefinitelyExplanation } = props
  const { formatMessage } = useIntl()

  if (!courtDate && !postponedIndefinitelyExplanation) {
    return null
  }

  return postponedIndefinitelyExplanation ? (
    <Text>{formatMessage(tables.postponed)}</Text>
  ) : (
    courtDate && (
      <>
        <Text>
          <Box component="span">
            {capitalize(
              format(parseISO(courtDate), 'EEEE d. LLLL y', {
                locale: localeIS,
              }),
            ).replace('dagur', 'd.')}
          </Box>
        </Text>
        <Text as="span" variant="small">
          kl. {format(parseISO(courtDate), 'kk:mm')}
        </Text>
      </>
    )
  )
}
export default CourtDate
