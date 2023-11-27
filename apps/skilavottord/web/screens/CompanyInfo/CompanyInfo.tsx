import React, { FC, useContext } from 'react'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import {
  Box,
  Stack,
  Text,
  BreadcrumbsDeprecated as Breadcrumbs,
  GridColumn,
} from '@island.is/island-ui/core'
import {
  PartnerPageLayout,
  ListItem,
  NotFound,
  Sidenav,
  CompanyProps,
} from '@island.is/skilavottord-web/components'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { hasPermission } from '@island.is/skilavottord-web/auth/utils'
import { UserContext } from '@island.is/skilavottord-web/context'
import {
  RecyclingPartner,
  Query,
  Role,
} from '@island.is/skilavottord-web/graphql/schema'
import { BASE_PATH } from '@island.is/skilavottord/consts'

const SkilavottordAllActiveRecyclingPartnersQuery = gql`
  query skilavottordAllActiveRecyclingPartnersQuery {
    skilavottordAllActiveRecyclingPartners {
      companyId
      companyName
      nationalId
      email
      address
      postnumber
      phone
      website
    }
  }
`

const CompanyInfo: FC<React.PropsWithChildren<unknown>> = () => {
  const { user } = useContext(UserContext)
  const { data } = useQuery<Query>(SkilavottordAllActiveRecyclingPartnersQuery)

  const {
    t: { companyInfo: t, deregisterSidenav: sidenavText, routes },
  } = useI18n()

  if (!user) {
    return null
  } else if (!hasPermission('companyInfo', user?.role as Role)) {
    return <NotFound />
  }

  const partnerId = user?.partnerId ?? ''

  const recyclingPartners = data?.skilavottordAllActiveRecyclingPartners || []
  const activePartner = recyclingPartners.filter(
    (partner: RecyclingPartner) => partner.companyId === partnerId,
  )
  const partnerName = activePartner.length > 0 && activePartner[0].companyName

  return (
    <PartnerPageLayout
      side={
        <Sidenav
          title={partnerName || sidenavText.title}
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
            {
              ...(hasPermission('accessControlCompany', user?.role)
                ? {
                    icon: 'lockClosed',
                    title: `${sidenavText.accessControl}`,
                    link: `${routes.accessControlCompany}`,
                  }
                : null),
            } as React.ComponentProps<typeof Sidenav>['sections'][0],
          ].filter(Boolean)}
          activeSection={1}
        />
      }
    >
      <GridColumn span={['8/8', '8/8', '7/8', '7/8']}>
        <Stack space={4}>
          <Breadcrumbs>
            <Link href={`${BASE_PATH}${routes.home['recyclingCompany']}`}>
              Ísland.is
            </Link>
            <span>{t.title}</span>
          </Breadcrumbs>
          <Stack space={2}>
            <Text variant="h1">{t.title}</Text>
            <Text variant="intro">{t.info}</Text>
          </Stack>
          <Text marginTop={4} variant="h3">
            {t.subtitles.location}
          </Text>
          <Box>
            {activePartner.length > 0 ? (
              activePartner.map(
                (partner: RecyclingPartner, index: string | number) => (
                  <ListItem
                    key={index}
                    title={partner.companyName}
                    content={[
                      {
                        text: `${partner.address}, ${partner.postnumber}`,
                      },
                      {
                        ...((partner?.nationalId
                          ? { text: `${partner.nationalId}` }
                          : null) as React.ComponentProps<
                          typeof ListItem
                        >['content'][0]),
                      },
                      {
                        ...((partner?.email
                          ? { text: `${partner.email}` }
                          : null) as React.ComponentProps<
                          typeof ListItem
                        >['content'][0]),
                      },
                      {
                        text: `${partner.phone}`,
                        isHighlighted: true,
                      },
                      {
                        text: `${partner.website}`,
                        href: partner.website as string | undefined,
                      },
                    ].filter(Boolean)}
                  />
                ),
              )
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
