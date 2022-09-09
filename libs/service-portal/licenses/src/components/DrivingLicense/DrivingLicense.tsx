import React, { useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Tag } from '@island.is/island-ui/core'
import { getExpiresIn, toDate } from '../../utils/dateUtils'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { m } from '../../lib/messages'
import { PkPass } from '../QRCodeModal/PkPass'
import { SingleLicenseCard } from '../SingleLicenseCard/SingleLicenseCard'

export const DrivingLicense = ({
  id,
  expireDate,
}: {
  id: string
  expireDate: string
}) => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  const [currentDate] = useState(new Date())

  const drivingLicenceImg =
    'https://images.ctfassets.net/8k0h54kbe6bj/6XhCz5Ss17OVLxpXNVDxAO/d3d6716bdb9ecdc5041e6baf68b92ba6/coat_of_arms.svg?w=100&h=100&fit=pad&bg=white&fm=png'

  const expiresIn = getExpiresIn(currentDate, new Date(expireDate))

  return (
    <SingleLicenseCard
      title={formatMessage(m.drivingLicense)}
      subtitle={`${formatMessage(m.drivingLicenseNumber)} - ${id}`}
      link={ServicePortalPath.LicensesDrivingDetail.replace(':id', id)}
      img={drivingLicenceImg}
      tag={{
        text: `${formatMessage(m.validUntil)} ${toDate(
          new Date(expireDate).getTime().toString(),
        )}`,
        color: 'blue',
      }}
      secondaryTag={
        expiresIn
          ? {
              color: 'red',
              text:
                expiresIn.value <= 0
                  ? formatMessage(m.isExpired)
                  : `${formatMessage(m.expiresIn)} ${Math.round(
                      expiresIn.value,
                    )} ${
                      expiresIn.key === 'months'
                        ? formatMessage(m.months)
                        : formatMessage(m.days)
                    }`,
            }
          : undefined
      }
      additionalLink={
        <PkPass
          expireDate={toDate(new Date(expireDate).getTime().toString())}
          textButton
        />
      }
    />
  )
}

export default DrivingLicense
