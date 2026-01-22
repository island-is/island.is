import { useQuery } from '@apollo/client'
import {
  Box,
  BreadcrumbsDeprecated as Breadcrumbs,
  GridColumn,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { hasPermission } from '@island.is/skilavottord-web/auth/utils'
import {
  ListItem,
  PartnerPageLayout,
  Sidenav,
} from '@island.is/skilavottord-web/components'
import AuthGuard from '@island.is/skilavottord-web/components/AuthGuard/AuthGuard'
import PageHeader from '@island.is/skilavottord-web/components/PageHeader/PageHeader'
import { UserContext } from '@island.is/skilavottord-web/context'
import {
  Query,
  RecyclingPartner,
} from '@island.is/skilavottord-web/graphql/schema'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { BASE_PATH } from '@island.is/skilavottord/consts'
import gql from 'graphql-tag'
import Link from 'next/link'
import React, { FC, useContext } from 'react'

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
  const { data, loading } = useQuery<Query>(
    SkilavottordAllActiveRecyclingPartnersQuery,
  )

  const {
    t: { companyInfo: t, deregisterSidenav: sidenavText, routes },
  } = useI18n()

  const partnerId = user?.partnerId ?? ''

  const recyclingPartners = data?.skilavottordAllActiveRecyclingPartners || []
  const activePartner = recyclingPartners.filter(
    (partner: RecyclingPartner) => partner.companyId === partnerId,
  )
  const partnerName = activePartner.length > 0 && activePartner[0].companyName

  return (
    <AuthGuard permission="companyInfo" loading={loading && !data}>
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
                ...(user?.role &&
                hasPermission('accessControlCompany', user.role)
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
            <PageHeader title={t.title} info={t.info} />

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
    </AuthGuard>
  )
}

export default CompanyInfo
