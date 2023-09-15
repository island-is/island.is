import format from 'date-fns/format'
import localeIS from 'date-fns/locale/is'
import parseISO from 'date-fns/parseISO'

import { Text } from '@island.is/island-ui/core'

const CreatedDate = ({ created }: { created: string | null }) => {
  if (!created) {
    return null
  }

  return (
    <Text as="span">
      {format(parseISO(created), 'd.M.y', {
        locale: localeIS,
      })}
    </Text>
  )
}
export default CreatedDate
