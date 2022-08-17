import React, { useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ActionCard } from '@island.is/island-ui/core'
import { useHistory } from 'react-router-dom'
import { getExpiresIn } from '../../utils/dateUtils'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { m } from '../../lib/messages'

export const PassportLicense = ({
  id,
  expireDate,
  name,
}: {
  expireDate: string
  id?: string
  name?: string
}) => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  const history = useHistory()
  const [currentDate] = useState(new Date())

  const expiresIn = getExpiresIn(currentDate, new Date(expireDate))

  if (!id) {
    return null
  }

  const handleClick = () =>
    history.push(ServicePortalPath.LicensesPassportDetail.replace(':id', id))
  return (
    <ActionCard
      heading={name || formatMessage(m.passportCardTitle)}
      headingVariant="h4"
      tag={{
        label: expiresIn
          ? expiresIn.value <= 0
            ? formatMessage(m.isExpired)
            : expiresIn?.key === 'months'
            ? formatMessage(m.expiresIn) +
              ' ' +
              Math.round(expiresIn?.value) +
              ' ' +
              formatMessage(m.months)
            : formatMessage(m.expiresIn) +
              ' ' +
              Math.round(expiresIn?.value) +
              ' ' +
              formatMessage(m.days)
          : formatMessage(m.isValid),
        variant: expiresIn ? 'red' : 'blue',
        outlined: false,
      }}
      logo="https://images.ctfassets.net/8k0h54kbe6bj/2ETBroMeCKRQptFKNg83rW/2e1799555b5bf0f98b7ed985ce648b99/logo-square-400.png?w=100&h=100&fit=pad&bg=white"
      text={formatMessage(m.passportNumber) + ' - ' + id}
      progressMeter={{
        active: false,
      }}
      cta={{
        variant: 'text',
        onClick: handleClick,
        label: formatMessage(m.see),
      }}
      // secondaryCta={{
      //   onClick: () => console.log('ONCLICK 2'),
      //   label: 'number 2',
      //   visible: true,
      //   size: 'small',
      //   icon: 'QRCode',
      // }}
    />
  )
}

export default PassportLicense
