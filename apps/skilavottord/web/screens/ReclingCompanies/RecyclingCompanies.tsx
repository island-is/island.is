import React, { FC, useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Box, Stack, Text, Button } from '@island.is/island-ui/core'
import { PartnerPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import Sidenav from '@island.is/skilavottord-web/components/Sidenav/Sidenav'
import { useRouter } from 'next/router'
import { CompanyListItem } from './components'
import { GET_ALL_RECYCLING_PARTNERS } from '@island.is/skilavottord-web/graphql/queries'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import { Unauthorized } from '@island.is/skilavottord-web/components'
import { UserContext } from '@island.is/skilavottord-web/context'

const RecyclingCompanies: FC = () => {
  const { user } = useContext(UserContext)
  const { data, error, loading } = useQuery(GET_ALL_RECYCLING_PARTNERS)

  const {
    t: { recyclingCompanies: t, recyclingFundSidenav: sidenavText, routes },
  } = useI18n()

  if (!user) {
    return null
  } else if (!hasPermission('recyclingCompanies', user?.role as Role)) {
    console.log(user?.role, 'is not allowed to view this page')
    return <Unauthorized />
  }

  const recyclingPartners = data?.getAllRecyclingPartners || []

  return (
    <PartnerPageLayout
      bottom={
        <Box>
          <Stack space={4}>
            <Stack space={4}>
              <Stack space={2}>
                <Text variant="h1">{t.title}</Text>
                <Text variant="intro">{t.info}</Text>
              </Stack>
            </Stack>
            <Text variant="h3">{t.subtitles.companies}</Text>
            {error || (loading && !data) ? (
              <Text>{t.empty}</Text>
            ) : (
              <Box>
                {recyclingPartners.map((partner, index) => (
                  <CompanyListItem key={index} {...partner} />
                ))}
              </Box>
            )}
          </Stack>
        </Box>
      }
      left={
        <Sidenav
          title={sidenavText.title}
          sections={[
            {
              icon: 'car',
              title: `${sidenavText.recycled}`,
              link: `${routes.recycledVehicles}`,
            },
            {
              icon: 'business',
              title: `${sidenavText.companies}`,
              link: `${routes.recyclingCompanies.baseRoute}`,
            },
          ]}
          activeSection={1}
        />
      }
    />
  )
}

export default RecyclingCompanies
