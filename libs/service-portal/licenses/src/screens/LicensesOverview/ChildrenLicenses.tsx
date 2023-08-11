import React, { FC } from 'react'
import { useNamespaces } from '@island.is/localization'
import {
  EmptyState,
  CardLoader,
  formatNationalId,
} from '@island.is/service-portal/core'

import { Box } from '@island.is/island-ui/core'

import LicenseCards from '../../components/LicenseCards/LicenseCards'
import { IdentityDocumentModelChild } from '@island.is/api/schema'

interface Props {
  loading?: boolean
  data?: IdentityDocumentModelChild[] | null
}

export const ChildrenLicenses: FC<React.PropsWithChildren<Props>> = ({
  data,
  loading,
}) => {
  useNamespaces('sp.license')

  return (
    <Box marginTop={[2, 3, 6]}>
      {loading && (
        <Box marginBottom={1}>
          <CardLoader />
        </Box>
      )}
      {data?.map((item, i) => (
        <Box key={i} paddingTop={i === 0 ? 0 : 2}>
          <LicenseCards
            passportData={item.passports || undefined}
            noPassport={
              Array.isArray(item.passports) && item.passports.length === 0
            }
            title={item.childName}
            name={true}
          />
        </Box>
      ))}

      {!loading && !data && (
        <Box marginTop={[0, 8]}>
          <EmptyState />
        </Box>
      )}
    </Box>
  )
}

export default ChildrenLicenses
