import React, { FC, useContext } from 'react'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { Box, Stack, Text, Breadcrumbs } from '@island.is/island-ui/core'
import { PartnerPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import Sidenav from '@island.is/skilavottord-web/components/Sidenav/Sidenav'
import { GET_RECYCLING_PARTNER } from '@island.is/skilavottord-web/graphql/queries'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import { ListItem } from '@island.is/skilavottord-web/components'
import { UserContext } from '@island.is/skilavottord-web/context'
import { NotFound } from '@island.is/skilavottord-web/components'

const CompanyInfo: FC = () => {
  const { user } = useContext(UserContext)
  const { data, loading, error } = useQuery(GET_RECYCLING_PARTNER, {
    variables: { id: 1 },
  })

  const {
    t: { companyInfo: t, deregisterSidenav: sidenavText, routes },
  } = useI18n()

  if (!user) {
    return null
  } else if (!hasPermission('deregisterVehicle', user?.role as Role)) {
    return <NotFound />
  }

  return (
    <PartnerPageLayout
      bottom={
        <Box>
          <Box paddingBottom={6}>
            <Breadcrumbs>
              <Link href={routes.home['recyclingPartner']}>Ísland.is</Link>
              <span>{t.title}</span>
            </Breadcrumbs>
          </Box>
          <Stack space={4}>
            <Stack space={4}>
              <Stack space={2}>
                <Text variant="h1">{t.title}</Text>
                <Text variant="intro">{t.info}</Text>
              </Stack>
            </Stack>
            <Text variant="h3">{t.subtitles.location}</Text>
            {error || (loading && !data) ? (
              <Text>{t.empty}</Text>
            ) : (
              <Box>
                {[data?.getRecyclingPartner].map((partner, index) => (
                  <ListItem
                    key={index}
                    title={partner.name}
                    content={[
                      {
                        text: `${partner.address}, ${partner.postNumber}`,
                      },
                      {
                        text: `${partner.phone}`,
                        isHighlighted: true,
                      },
                      {
                        text: `${partner.website}`,
                        href: partner.website,
                      },
                    ]}
                  />
                ))}
              </Box>
            )}
          </Stack>
        </Box>
      }
      left={
        <Sidenav
          title="Company name"
          sections={[
            {
              icon: 'car',
              title: `${sidenavText.deregister}`,
              link: `${routes.deregisterVehicle.baseRoute}`,
            },
            {
              icon: 'business',
              title: `${sidenavText.companyInfo}`,
              link: `${routes.companyInfo.baseRoute}`,
            },
          ]}
          activeSection={1}
        />
      }
    />
  )
}

export default CompanyInfo
