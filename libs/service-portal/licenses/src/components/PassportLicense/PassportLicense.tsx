import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { formatDate } from '../../utils/dateUtils'
import { SingleLicenseCard } from '../SingleLicenseCard/SingleLicenseCard'
import { m } from '../../lib/messages'
import { passportLogo } from '../../lib/constants'
import { LicensePaths } from '../../lib/paths'

export const PassportLicense = ({
  id,
  expireDate,
  name,
  isInvalid,
  expiresWithinNoticeTime,
}: {
  expireDate: Date
  id?: string | null
  name?: string | null
  isInvalid?: boolean
  expiresWithinNoticeTime?: boolean
}) => {
  useNamespaces('sp.license')
  const { formatMessage, lang } = useLocale()

  if (!id) {
    return null
  }

  const getLabel = () => {
    if (isInvalid) {
      return formatMessage(m.invalid)
    }
    if (expiresWithinNoticeTime) {
      return formatMessage(m.passportExpiring)
    }
    if (expireDate) {
      return `${formatMessage(m.validUntil)} ${formatDate(expireDate, lang)}`
    }

    return formatMessage(m.isValid)
  }

  return (
    <SingleLicenseCard
      title={name || formatMessage(m.passportCardTitle)}
      subtitle={formatMessage(m.passportNumber) + ': ' + id}
      link={LicensePaths.LicensesPassportDetail.replace(':id', id)}
      img={passportLogo}
      dataTestId="passport-card"
      translateTitle={name ? 'no' : 'yes'}
      tag={{
        text: getLabel(),
        color: expiresWithinNoticeTime || isInvalid ? 'red' : 'blue',
      }}
    />
  )
}

export default PassportLicense
