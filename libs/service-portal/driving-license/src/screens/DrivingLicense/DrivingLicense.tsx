import React from 'react'
import { defineMessage } from 'react-intl'
import { gql, useQuery } from '@apollo/client'

import { Query } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { Application, Eligibility } from './components'

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

function DrivingLicense(): JSX.Element {
  useNamespaces('sp.driving-license')
  const { formatMessage } = useLocale()

  const { data } = useQuery<Query>(NationalRegistryUserQuery)
  const { nationalRegistryUser } = data || {}

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
