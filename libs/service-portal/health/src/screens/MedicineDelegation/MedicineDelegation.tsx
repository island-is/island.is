import React from 'react'
import { useLocale } from '@island.is/localization'
import {
  HEALTH_DIRECTORATE_SLUG,
  IntroHeader,
} from '@island.is/service-portal/core'
import { messages as m } from '../../lib/messages'
import { Box } from '@island.is/island-ui/core'

const MedicineDelegation = () => {
  const { formatMessage } = useLocale()

  return (
    <>
      <IntroHeader
        title={formatMessage(m.medicineDelegation)}
        intro={formatMessage(m.medicineDelegationIntroText)}
        serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
        serviceProviderTooltip={formatMessage(
          m.landlaeknirMedicineDelegationTooltip,
        )}
      />
      <Box>{}</Box>
    </>
  )
}

export default MedicineDelegation
