import { useContext } from 'react'

import { AlertBanner } from '@island.is/island-ui/core'
import {
  isDistrictCourtUser,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { useServiceInterruptionBannerQuery } from '@island.is/judicial-system-web/src/routes/Admin/ServiceInterruptionBanner/serviceInterruptionBanner.generated'

const DEFAULT_TITLE = 'Mikilvæg skilaboð'

const hasMessage = (value: string | null | undefined): value is string =>
  Boolean(value?.trim())

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

  if (hasMessage(banner.globalMessage)) {
    displayMessage = banner.globalMessage.trim()
  } else if (
    isProsecutionUser(user) &&
    hasMessage(banner.prosecutorMessage)
  ) {
    displayMessage = banner.prosecutorMessage.trim()
  } else if (
    isDistrictCourtUser(user) &&
    hasMessage(banner.courtMessage)
  ) {
    displayMessage = banner.courtMessage.trim()
  } else {
    return null
  }

  const title = hasMessage(banner.title)
    ? banner.title.trim()
    : DEFAULT_TITLE

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
