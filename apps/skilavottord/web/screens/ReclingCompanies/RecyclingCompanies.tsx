import React, { FC, useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Box, GridColumn, Stack, Text } from '@island.is/island-ui/core'
import { PartnerPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import Sidenav from '@island.is/skilavottord-web/components/Sidenav/Sidenav'
import { GET_ALL_RECYCLING_PARTNERS } from '@island.is/skilavottord-web/graphql/queries'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import { ListItem } from '@island.is/skilavottord-web/components'
import { UserContext } from '@island.is/skilavottord-web/context'
import { NotFound } from '@island.is/skilavottord-web/components'
import { RecyclingPartner } from '@island.is/skilavottord-web/types'

const RecyclingCompanies: FC = () => {
  const { user } = useContext(UserContext)
  const { data, error, loading } = useQuery(GET_ALL_RECYCLING_PARTNERS)

  const {
    t: { recyclingCompanies: t, recyclingFundSidenav: sidenavText, routes },
  } = useI18n()

  if (!user) {
    return null
  } else if (!hasPermission('recyclingCompanies', user?.role as Role)) {
    return <NotFound />
  }

  const recyclingPartners = data?.skilavottordAllRecyclingPartners || []

  return (
    <PartnerPageLayout
      side={
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
    >
      <GridColumn span={['8/8', '8/8', '7/8', '7/8']}>
        <Stack space={4}>
          <Stack space={2}>
            <Text variant="h1">{t.title}</Text>
            <Text variant="intro">{t.info}</Text>
          </Stack>
          <Text variant="h3">{t.subtitles.companies}</Text>
          {error || (loading && !data) ? (
            <Text>{t.empty}</Text>
          ) : (
            <Box>
              {recyclingPartners.map((partner: RecyclingPartner, index) => (
                <ListItem
                  key={index}
                  title={partner.companyName}
                  content={[
                    {
                      text: `${partner.companyId}`,
                    },
                    {
                      text: partner.active
                        ? t.status.active
                        : t.status.inactive,
                    },
                  ]}
                />
              ))}
            </Box>
          )}
        </Stack>
      </GridColumn>
    </PartnerPageLayout>
  )
}

export default RecyclingCompanies
