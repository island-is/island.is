import parseISO from 'date-fns/parseISO'

import { Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'

const CreatedDate = ({ created }: { created?: string | null }) => {
  if (!created) {
    return null
  }

  return <Text as="span">{formatDate(parseISO(created ?? ''))}</Text>
}
export default CreatedDate
