import React from 'react'
import { defineMessage } from 'react-intl'
import { gql, useQuery } from '@apollo/client'

import { Query } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Stack } from '@island.is/island-ui/core'
import { Application, Eligibility } from './components'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'

const ELIGABLE_FOR_RENEWAL_AGE = 68
const ELIGABLE_FOR_DRIVING_LICENSE_AGE = 16

const NationalRegistryUserQuery = gql`
  query NationalRegistryUserQuery {
    nationalRegistryUser {
      nationalId
      age
    }
  }
`

const DrivingLicenseQuery = gql`
  query DrivingLicenseQuery {
    drivingLicense {
      id
      name
      issued
      expires
      categories {
        name
        issued
        expires
      }
    }
  }
`

const DrivingLicense: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.driving-license')
  const { formatMessage } = useLocale()

  const userData = useQuery<Query>(NationalRegistryUserQuery)
  const licenceData = useQuery<Query>(DrivingLicenseQuery)

  const { nationalRegistryUser } = userData.data || {}
  const { name, issued, expires, categories } =
    licenceData.data?.drivingLicense || {}
  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={[6, 6, 10]}>
        <Eligibility />
        {(nationalRegistryUser?.age || 0) >=
          ELIGABLE_FOR_DRIVING_LICENSE_AGE && (
          <Application
            heading={defineMessage({
              id: 'sp.driving-license:general-license-title',
              defaultMessage: 'Almenn ökuréttindi',
            })}
            subText={defineMessage({
              id: 'sp.driving-license:general-license-subtext',
              defaultMessage:
                'Ökunám á fólksbifreið getur hafist við 16 ára aldur en ökuréttindi eru fyrst veitt við 17 ára aldur. Réttindi til að aka bifhjóli (skellinöðru) er hægt að fá 15 ára og dráttarvél 16 ára. Til að hefja ökunám þarf að hafa samband við löggiltan ökukennara. Hann hefur umsjón með bæði verklegum og bóklegum hluta námsins og vísar á ökuskóla þar sem bóklegt nám fer fram.',
            })}
          />
        )}

        {(nationalRegistryUser?.age || 0) >= ELIGABLE_FOR_RENEWAL_AGE && (
          <Application
            heading={defineMessage({
              id: 'sp.driving-license:renewal-heading',
              defaultMessage: 'Endurnýjun ökuskírteinis vegna aldurs',
            })}
            subText={defineMessage({
              id: 'sp.driving-license:renewal-subtext',
              defaultMessage:
                'Almenn ökuréttindi (B réttindi) þarf að endurnýja við 70 ára aldur. Nýja ökuskírteinið gildir í 4 ár. Eftir það þarf að endurnýja það þriðja og annað hvert ár en eftir 80 ára aldur á árs fresti.',
            })}
          />
        )}
      </Stack>
    </Box>
  )
}

export default DrivingLicense
