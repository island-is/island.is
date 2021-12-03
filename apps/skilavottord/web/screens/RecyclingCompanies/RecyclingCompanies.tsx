import React, { FC, useContext } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import NextLink from 'next/link'

import { ActionCard, Breadcrumbs, Stack, Text } from '@island.is/island-ui/core'
import { PartnerPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import Sidenav from '@island.is/skilavottord-web/components/Sidenav/Sidenav'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import { UserContext } from '@island.is/skilavottord-web/context'
import { NotFound } from '@island.is/skilavottord-web/components'
import {
  RecyclingPartner,
  Query,
} from '@island.is/skilavottord-web/graphql/schema'
import { filterInternalPartners } from '@island.is/skilavottord-web/utils'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

const SkilavottordAllRecyclingPartnersQuery = gql`
  query skilavottordAllRecyclingPartnersQuery {
    skilavottordAllRecyclingPartners {
      companyId
      companyName
      active
    }
  }
`

const RecyclingCompanies: FC = () => {
  const { linkResolver } = useLinkResolver()
  const { user } = useContext(UserContext)
  const { data, error, loading } = useQuery<Query>(
    SkilavottordAllRecyclingPartnersQuery,
  )

  const {
    t: { recyclingCompanies: t, recyclingFundSidenav: sidenavText, routes },
  } = useI18n()

  if (!user) {
    return null
  } else if (!hasPermission('recyclingCompanies', user?.role as Role)) {
    return <NotFound />
  }

  const partners = data?.skilavottordAllRecyclingPartners || []
  const recyclingPartners = filterInternalPartners(partners)

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
            {
              icon: 'lockClosed',
              title: `${sidenavText.accessControl}`,
              link: `${routes.accessControl}`,
            },
          ]}
          activeSection={1}
        />
      }
    >
      <Stack space={4}>
        <Breadcrumbs
          items={[
            { title: 'Ísland.is', href: routes.home['recyclingCompany'] },
            {
              title: t.title,
            },
          ]}
          renderLink={(link) => {
            return (
              <NextLink {...linkResolver('homepage')} passHref>
                {link}
              </NextLink>
            )
          }}
        />
        <Text variant="h1">{t.title}</Text>
        <Text variant="intro">{t.info}</Text>
        {error || (loading && !data) ? (
          <Text>{t.empty}</Text>
        ) : (
          <Stack space={3}>
            {recyclingPartners.map((partner: RecyclingPartner, index) => (
              <ActionCard
                cta={{ label: '' }}
                heading={partner.companyName}
                text={partner.companyId}
                tag={{
                  label: partner.active ? t.status.active : t.status.inactive,
                  variant: partner.active ? 'blue' : 'red',
                }}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </PartnerPageLayout>
  )
}

export default RecyclingCompanies
