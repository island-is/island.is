import React, { FC } from 'react'
import { useNamespaces } from '@island.is/localization'
import { EmptyState, CardLoader } from '@island.is/service-portal/core'

import { Box } from '@island.is/island-ui/core'

import LicenseCards from '../../components/LicenseCards/LicenseCards'
import { IdentityDocumentModelChild } from '@island.is/api/schema'

interface Props {
  loading?: boolean
  data?: IdentityDocumentModelChild[] | null
}

export const ChildrenLicenses: FC<Props> = ({ data, loading }) => {
  useNamespaces('sp.license')

  return (
    <Box marginTop={6}>
      {loading && (
        <Box marginBottom={1}>
          <CardLoader />
        </Box>
      )}
      {data?.map((item, i) => (
        <LicenseCards
          key={i}
          passportData={item.passports || undefined}
          noPassport={
            Array.isArray(item.passports) && item.passports.length === 0
          }
          nationalId={item.childNationalId}
          name={true}
        />
      ))}

      {!loading && !data && (
        <Box marginTop={8}>
          <EmptyState />
        </Box>
      )}
    </Box>
  )
}

export default ChildrenLicenses
