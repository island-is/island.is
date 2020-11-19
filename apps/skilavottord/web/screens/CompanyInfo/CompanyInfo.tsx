import React, { FC, useContext } from 'react'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import {
  Box,
  Stack,
  Text,
  Breadcrumbs,
  GridColumn,
} from '@island.is/island-ui/core'
import {
  PartnerPageLayout,
  ListItem,
  NotFound,
  Sidenav,
} from '@island.is/skilavottord-web/components'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import { UserContext } from '@island.is/skilavottord-web/context'
import { RecyclingPartner } from '@island.is/skilavottord-web/types'
import { ALL_ACTIVE_RECYCLING_PARTNERS } from '@island.is/skilavottord-web/graphql/queries'

const CompanyInfo: FC = () => {
  const { user } = useContext(UserContext)
  const { data } = useQuery(ALL_ACTIVE_RECYCLING_PARTNERS)

  const {
    t: { companyInfo: t, deregisterSidenav: sidenavText, routes },
  } = useI18n()

  if (!user) {
    return null
  } else if (!hasPermission('deregisterVehicle', user?.role as Role)) {
    return <NotFound />
  }

  const partnerId = user?.partnerId ?? ''

  const recyclingPartners = data?.skilavottordAllActiveRecyclingPartners || []
  const activePartner = recyclingPartners.filter(
    (partner) => partner.companyId === partnerId,
  )
  const partnerName = activePartner.length > 0 && activePartner[0].companyName

  return (
    <PartnerPageLayout
      side={
        <Sidenav
          title={partnerName || user?.name}
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
    >
      <GridColumn span={['8/8', '8/8', '7/8', '7/8']}>
        <Stack space={4}>
          <Breadcrumbs>
            <Link href={routes.home['recyclingCompany']}>Ísland.is</Link>
            <span>{t.title}</span>
          </Breadcrumbs>
          <Stack space={2}>
            <Text variant="h1">{t.title}</Text>
            <Text variant="intro">{t.info}</Text>
          </Stack>
          <Text variant="h3">{t.subtitles.location}</Text>
          <Box>
            {activePartner.length > 0 ? (
              activePartner.map((partner: RecyclingPartner, index) => (
                <ListItem
                  key={index}
                  title={partner.companyName}
                  content={[
                    {
                      text: `${partner.address}, ${partner.postnumber}`,
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
              ))
            ) : (
              <Text>{t.empty}</Text>
            )}
          </Box>
        </Stack>
      </GridColumn>
    </PartnerPageLayout>
  )
}

export default CompanyInfo
