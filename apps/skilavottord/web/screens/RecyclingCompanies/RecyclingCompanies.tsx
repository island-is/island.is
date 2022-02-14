import React, { FC, useContext } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import NextLink from 'next/link'

import {
  ActionCard,
  Box,
  Breadcrumbs,
  Button,
  GridColumn,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { PartnerPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import Sidenav from '@island.is/skilavottord-web/components/Sidenav/Sidenav'
import { hasPermission } from '@island.is/skilavottord-web/auth/utils'
import { UserContext } from '@island.is/skilavottord-web/context'
import { NotFound } from '@island.is/skilavottord-web/components'
import {
  RecyclingPartner,
  Query,
  Role,
} from '@island.is/skilavottord-web/graphql/schema'
import { filterInternalPartners } from '@island.is/skilavottord-web/utils'
import { BASE_PATH } from '@island.is/skilavottord/consts'

import { RecyclingCompanyImage } from './components'

export const SkilavottordAllRecyclingPartnersQuery = gql`
  query skilavottordAllRecyclingPartnersQuery {
    skilavottordAllRecyclingPartners {
      companyId
      companyName
      active
    }
  }
`

const RecyclingCompanies: FC = () => {
  const { user } = useContext(UserContext)
  const router = useRouter()
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

  const handleCreate = () => {
    router.push({
      pathname: routes.recyclingCompanies.add,
    })
  }

  const handleUpdate = (id: string) => {
    router.push({
      pathname: BASE_PATH + routes.recyclingCompanies.edit, // without BASE-PATH it changes the whole route, probably some bug
      query: { id },
    })
  }

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
              ...(hasPermission('accessControl', user?.role)
                ? {
                    icon: 'lockClosed',
                    title: `${sidenavText.accessControl}`,
                    link: `${routes.accessControl}`,
                  }
                : null),
            } as React.ComponentProps<typeof Sidenav>['sections'][0],
          ].filter(Boolean)}
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
          renderLink={(link, item) => {
            return item?.href ? (
              <NextLink href={item?.href}>{link}</NextLink>
            ) : (
              link
            )
          }}
        />
        <Box
          display="flex"
          alignItems="flexStart"
          justifyContent="spaceBetween"
        >
          <GridRow marginBottom={7}>
            <GridColumn span={['8/8', '6/8', '5/8']} order={[2, 1]}>
              <Text variant="h1" as="h1" marginBottom={4}>
                {t.title}
              </Text>
              <Text variant="intro">{t.info}</Text>
            </GridColumn>
            <GridColumn
              span={['8/8', '2/8']}
              offset={['0', '0', '1/8']}
              order={[1, 2]}
            >
              <Box textAlign={['center', 'right']} padding={[6, 0]}>
                <RecyclingCompanyImage />
              </Box>
            </GridColumn>
          </GridRow>
        </Box>
        <Box display="flex" justifyContent="flexEnd">
          <Button onClick={handleCreate}>{t.buttons.add}</Button>
        </Box>
        {error || (loading && !data) ? (
          <Text>{t.empty}</Text>
        ) : (
          <Stack space={3}>
            {recyclingPartners.map((partner: RecyclingPartner) => (
              <ActionCard
                key={partner.companyId}
                cta={{
                  label: t.buttons.view,
                  variant: 'text',
                  onClick: () => handleUpdate(partner.companyId),
                }}
                heading={partner.companyName}
                text={partner.companyId}
                tag={{
                  label: partner.active ? t.status.active : t.status.inactive,
                  variant: partner.active ? 'mint' : 'red',
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
