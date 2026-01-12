import format from 'date-fns/format'
import localeIS from 'date-fns/locale/is'
import parseISO from 'date-fns/parseISO'

import { Text } from '@island.is/island-ui/core'

const TableDate = ({ displayDate }: { displayDate?: string | null }) => {
  if (!displayDate) {
    return null
  }

  return (
    <Text as="span">
      {format(parseISO(displayDate), 'd.M.y', {
        locale: localeIS,
      })}
    </Text>
  )
}
export default TableDate
