import type { FC } from 'react'

import {
  Box,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Tabs,
} from '@island.is/island-ui/core'
import Overview from '../../screens/Overview/Overview'
import { useLocale } from '@island.is/localization'
import { ApplicationSystemPaths } from '../../lib/paths'
import { m } from '../../lib/messages'
import Statistics from '../../screens/Statistics/Statistics'
import {
  useGetOrganizationsQuery,
  useGetApplicationV2InstitutionsSuperAdminQuery,
} from '../../queries/overview.generated'
import { useMemo } from 'react'
import { Organization } from '@island.is/shared/types'

interface LayoutProps {
  isSuperAdmin: boolean
}

export const Layout: FC<React.PropsWithChildren<LayoutProps>> = ({
  isSuperAdmin,
}) => {
  const { formatMessage } = useLocale()

  //These are all organizations in contentful
  const { data: contentfulOrgData, loading: contentfulOrgLoading } =
    useGetOrganizationsQuery({
      ssr: false,
    })

  const contentfulOrganizations = contentfulOrgData?.getOrganizations?.items

  // Institutions that have active application types (enriched with Contentful data)
  const { data: institutionsData, loading: institutionsLoading } =
    useGetApplicationV2InstitutionsSuperAdminQuery({
      ssr: false,
      skip: !isSuperAdmin,
    })

  const availableOrganizations = useMemo<Organization[]>(
    () =>
      (institutionsData?.applicationV2InstitutionsSuperAdmin ?? [])
        .flatMap((inst) => {
          const contentfulOrg = contentfulOrganizations?.find(
            (x) => x.slug === inst.contentfulSlug,
          )

          if (!contentfulOrg) {
            if (!inst.nationalId) {
              return []
            }
            return [
              {
                id: '',
                title: inst.name ?? inst.nationalId ?? '',
                slug: '',
                nationalId: inst.nationalId,
                logo: null,
              },
            ]
          }

          return [
            {
              ...contentfulOrg,
              nationalId: inst.nationalId,
            },
          ]
        })
        .sort((a, b) => a.title.localeCompare(b.title)),
    [institutionsData, contentfulOrganizations],
  )

  const isLoadingOrganizations = contentfulOrgLoading || institutionsLoading

  return (
    <GridContainer>
      <Breadcrumbs
        items={[
          { title: 'Ísland.is', href: '/stjornbord' },
          {
            title: formatMessage(m.applicationSystem),
            href: `/stjornbord${ApplicationSystemPaths.Root}`,
          },
        ]}
      />
      <GridRow rowGap={'gutter'} marginTop={4}>
        <GridColumn
          span={['12/12', '12/12', '12/12', '12/12', '12/12']}
          order={[2, 2, 2, 0]}
        >
          <Box position="sticky" top={4}>
            <Tabs
              label={formatMessage(m.applicationSystem)}
              contentBackground="white"
              selected="overview"
              tabs={[
                {
                  id: 'overview',
                  label: formatMessage(m.overview),
                  content: (
                    <Overview
                      isSuperAdmin={isSuperAdmin}
                      availableOrganizations={availableOrganizations}
                      isLoadingOrganizations={isLoadingOrganizations}
                    />
                  ),
                },
                {
                  id: 'statistics',
                  label: formatMessage(m.statistics),
                  content: (
                    <Statistics
                      isSuperAdmin={isSuperAdmin}
                      availableOrganizations={availableOrganizations}
                      isLoadingOrganizations={isLoadingOrganizations}
                    />
                  ),
                },
              ]}
            />
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
