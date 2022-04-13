import React, { useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ActionCard } from '@island.is/island-ui/core'
import { useHistory } from 'react-router-dom'
import { getExpiresIn, toDate } from '../../utils/dateUtils'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { m } from '../../lib/messages'

export const PassportLicense = ({
  id,
  expireDate,
  children = false,
  name,
}: {
  id: string
  expireDate: string
  children?: boolean
  name?: string
}) => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  const history = useHistory()
  const [currentDate] = useState(new Date())

  const expiresIn = getExpiresIn(currentDate, new Date(expireDate))

  const handleClick = () =>
    history.push(
      children
        ? ServicePortalPath.LicensesChildrenPassportDetail.replace(':id', id)
        : ServicePortalPath.LicensesPassportDetail.replace(':id', id),
    )
  return (
    <ActionCard
      heading={children ? name || '' : formatMessage(m.passportCardTitle)}
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
      image={{ variant: 'image', src: './assets/images/tjodskra.svg' }}
      text={formatMessage(m.passportNumber) + ' - ' + id}
      cta={{
        variant: 'text',
        onClick: handleClick,
        label: formatMessage(m.see),
      }}
    />
  )
}

export default PassportLicense
