import React, { useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { formatDate, getExpiresIn } from '../../utils/dateUtils'
import { ActionCard, ServicePortalPath } from '@island.is/service-portal/core'
import { m } from '../../lib/messages'
import { useHistory } from 'react-router-dom'

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
  const [currentDate] = useState(new Date())
  const history = useHistory()

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

  return (
    <ActionCard
      heading={name || formatMessage(m.passportCardTitle)}
      text={formatMessage(m.passportNumber) + ' - ' + id}
      cta={{
        label: formatMessage(m.seeDetails),
        onClick: () =>
          history.push(
            ServicePortalPath.LicensesPassportDetail.replace(':id', id),
          ),

        variant: 'text',
      }}
      image={{
        type: 'image',
        url:
          'https://images.ctfassets.net/8k0h54kbe6bj/2ETBroMeCKRQptFKNg83rW/2e1799555b5bf0f98b7ed985ce648b99/logo-square-400.png?w=100&h=100&fit=pad&bg=white',
      }}
      tag={{
        label: getLabel(),
        variant: expiresIn || isInvalid ? 'red' : 'blue',
        outlined: false,
      }}
    />
  )
}

export default PassportLicense
