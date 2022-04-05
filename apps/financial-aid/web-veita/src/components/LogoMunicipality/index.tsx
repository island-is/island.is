import React, { useContext } from 'react'
import cn from 'classnames'
import LogoSvg from './LogoSvg'
import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import { LoadingContainer } from '@island.is/financial-aid-web/veita/src/components'
import { AdminContext } from '../AdminProvider/AdminProvider'
import {
  logoKeyFromMunicipalityCode,
  StaffRole,
} from '@island.is/financial-aid/shared/lib'

interface LogoProps {
  className?: string
}

const LogoMunicipality = ({ className }: LogoProps) => {
  const { admin, municipality } = useContext(AdminContext)

  const isSuperAdmin = admin?.staff?.roles.includes(StaffRole.SUPERADMIN)

  const logoSize = 48

  return (
    <LoadingContainer
      isLoading={admin === undefined}
      loader={
        <Box>
          <SkeletonLoader display="block" height={logoSize} width={logoSize} />
        </Box>
      }
    >
      {admin && (
        <a
          href={municipality?.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className={cn({ [`${className}`]: true })}
        >
          <LogoSvg
            name={
              logoKeyFromMunicipalityCode[
                isSuperAdmin ? '' : municipality?.municipalityId ?? ''
              ]
            }
          />
        </a>
      )}
    </LoadingContainer>
  )
}

export default LogoMunicipality
