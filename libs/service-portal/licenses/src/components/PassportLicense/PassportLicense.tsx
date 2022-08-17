import React, { useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ActionCard } from '@island.is/island-ui/core'
import { useHistory } from 'react-router-dom'
import { formatDate, getExpiresIn } from '../../utils/dateUtils'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { m } from '../../lib/messages'

export const PassportLicense = ({
  id,
  expireDate,
  name,
  isInvalid,
}: {
  expireDate: Date
  id?: string
  name?: string
  isInvalid?: boolean
}) => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  const history = useHistory()
  const [currentDate] = useState(new Date())

  const expiresIn = getExpiresIn(currentDate, new Date(expireDate))

  if (!id) {
    return null
  }

  const getLabel = () => {
    if (isInvalid) {
      return formatMessage(m.invalid)
    }
    if (expiresIn) {
      return expiresIn.value <= 0
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
    }
    if (expireDate) {
      return `${formatMessage(m.validUntil)} ${formatDate(expireDate)}`
    }

    return formatMessage(m.isValid)
  }

  const handleClick = () =>
    history.push(ServicePortalPath.LicensesPassportDetail.replace(':id', id))
  return (
    <ActionCard
      heading={name || formatMessage(m.passportCardTitle)}
      headingVariant="h4"
      tag={{
        label: getLabel(),
        variant: expiresIn || isInvalid ? 'red' : 'blue',
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
    />
  )
}

export default PassportLicense
