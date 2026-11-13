import { useContext } from 'react'

import { AlertBanner } from '@island.is/island-ui/core'
import { isNonBlank } from '@island.is/judicial-system/formatters'
import {
  isCourtOfAppealsUser,
  isDistrictCourtUser,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { useServiceInterruptionBannerQuery } from '@island.is/judicial-system-web/src/routes/Admin/ServiceInterruptionBanner/serviceInterruptionBanner.generated'

const DEFAULT_TITLE = 'Mikilvæg skilaboð'

const ServiceInterruptionBanner = () => {
  const { user } = useContext(UserContext)
  const { data } = useServiceInterruptionBannerQuery({
    fetchPolicy: 'cache-and-network',
    skip: !user,
  })

  const banner = data?.serviceInterruptionBanner

  if (!banner) {
    return null
  }

  let displayMessage = ''

  if (isNonBlank(banner.globalMessage)) {
    displayMessage = banner.globalMessage.trim()
  } else if (isProsecutionUser(user) && isNonBlank(banner.prosecutorMessage)) {
    displayMessage = banner.prosecutorMessage.trim()
  } else if (
    (isDistrictCourtUser(user) || isCourtOfAppealsUser(user)) &&
    isNonBlank(banner.courtMessage)
  ) {
    displayMessage = banner.courtMessage.trim()
  } else {
    return null
  }

  const title = isNonBlank(banner.title) ? banner.title.trim() : DEFAULT_TITLE

  return (
    <AlertBanner
      title={title}
      variant="warning"
      description={displayMessage}
      dismissable
    />
  )
}

export default ServiceInterruptionBanner
