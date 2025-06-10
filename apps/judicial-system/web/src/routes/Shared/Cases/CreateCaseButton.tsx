import { useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { capitalize } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import {
  ContextMenu,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { UserRole } from '@island.is/judicial-system-web/src/graphql/schema'

export const CreateCaseButton = () => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const items = useMemo(() => {
    if (user?.role === UserRole.PROSECUTOR_REPRESENTATIVE) {
      return [
        {
          href: constants.CREATE_INDICTMENT_ROUTE,
          title: capitalize(formatMessage(core.indictment)),
        },
      ]
    } else if (user?.role === UserRole.PROSECUTOR) {
      return [
        {
          href: constants.CREATE_INDICTMENT_ROUTE,
          title: capitalize(formatMessage(core.indictment)),
        },
        {
          href: constants.CREATE_RESTRICTION_CASE_ROUTE,
          title: capitalize(formatMessage(core.restrictionCase)),
        },
        {
          href: constants.CREATE_TRAVEL_BAN_ROUTE,
          title: capitalize(formatMessage(core.travelBan)),
        },
        {
          href: constants.CREATE_INVESTIGATION_CASE_ROUTE,
          title: capitalize(formatMessage(core.investigationCase)),
        },
      ]
    } else {
      return []
    }
  }, [formatMessage, user?.role])

  return (
    <Box marginTop={[2, 2, 0]}>
      <ContextMenu title="Nýtt mál" items={items} />
    </Box>
  )
}
