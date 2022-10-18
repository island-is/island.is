import React, { useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { formatDate, getExpiresIn } from '../../utils/dateUtils'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { SingleLicenseCard } from '../SingleLicenseCard/SingleLicenseCard'
import { m } from '../../lib/messages'

export const PassportLicense = ({
  id,
  expireDate,
  name,
  isInvalid,
}: {
  expireDate: Date
  id?: string | null
  name?: string
  isInvalid?: boolean
}) => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
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

  return (
    <SingleLicenseCard
      title={name || formatMessage(m.passportCardTitle)}
      subtitle={formatMessage(m.passportNumber) + ' - ' + id}
      link={ServicePortalPath.LicensesPassportDetail.replace(':id', id)}
      img={
        'https://images.ctfassets.net/8k0h54kbe6bj/2ETBroMeCKRQptFKNg83rW/2e1799555b5bf0f98b7ed985ce648b99/logo-square-400.png?w=100&h=100&fit=pad&bg=white'
      }
      tag={{
        text: getLabel(),
        color: expiresIn || isInvalid ? 'red' : 'blue',
      }}
    />
  )
}

export default PassportLicense
