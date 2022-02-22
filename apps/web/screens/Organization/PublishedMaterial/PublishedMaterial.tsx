import {
  Filter,
  FilterInput,
  FilterMultiChoice,
  GridColumn,
  GridContainer,
  GridRow,
  NavigationItem,
  Text,
  TopicCard,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { getThemeConfig, OrganizationWrapper } from '@island.is/web/components'
import {
  ContentLanguage,
  Query,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { linkResolver } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Screen } from '../../../types'
import { GET_ORGANIZATION_PAGE_QUERY } from '../../queries'

interface Item {
  id: number
  href: string
  name: string
}

const items: Item[] = [
  {
    id: 1,
    href:
      'https://www.landlaeknir.is/servlet/file/store93/item41986/Lei%C3%B0beiningar%20til%20hj%C3%BAkrunarheimila_21.02.2022.pdf',
    name: 'Leiðbeiningar til starfsmanna hjúkrunarheimila og dagdvala',
  },
  {
    id: 2,
    href:
      'https://www.landlaeknir.is/servlet/file/store93/item32543/Skurdstofustarfsemi%20vidmid.pdf',
    name: 'Skurðstofustarfsemi - viðmið',
  },
  {
    id: 3,
    href:
      'https://www.landlaeknir.is/servlet/file/store93/item46999/Lei%C3%B0beiningar%20fyrir%20sundlaugar.pdf',
    name: 'Leiðbeiningar fyrir sund- og baðstaði og baðstaði í náttúrunni',
  },
  {
    id: 4,
    href:
      'https://www.landlaeknir.is/servlet/file/store93/item48630/Talnabrunnur_jan%C3%BAar_2022.pdf',
    name: 'Talnabrunnur. Janúar 2022.',
  },
]

interface PublishedMaterialProps {
  organizationPage: Query['getOrganizationPage']
}

const PublishedMaterial: Screen<PublishedMaterialProps> = ({
  organizationPage,
}) => {
  const { activeLocale } = useI18n()
  const router = useRouter()
  const { width } = useWindowSize()
  const [searchValue, setSearchValue] = useState('')

  useContentfulId(organizationPage.id)
  useLocalLinkTypeResolver()

  const pageUrl = `${organizationPage.slug}/${router.asPath.split('/').pop()}`

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink.text,
      href: primaryLink.url,
      active:
        primaryLink.url.includes(pageUrl) ||
        childrenLinks.some((link) => link.url.includes(pageUrl)),
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
        active: url.includes(pageUrl),
      })),
    }),
  )

  const pageTitle =
    activeLocale === 'en' ? 'Published material' : 'Útgefið efni'

  const isMobile = width < theme.breakpoints.md

  const filteredItems = items.filter(
    (item) => item.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1,
  )

  return (
    <OrganizationWrapper
      pageTitle={pageTitle}
      organizationPage={organizationPage}
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: organizationPage.title,
          href: linkResolver('organizationpage', [organizationPage.slug]).href,
        },
      ]}
      navigationData={{
        title: activeLocale === 'en' ? 'Menu' : 'Efnisyfirlit',
        items: navList,
      }}
    >
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12', '6/12', '8/12']}>
            <Text variant="h1" as="h1" marginBottom={4} marginTop={1}>
              {pageTitle}
            </Text>
          </GridColumn>
        </GridRow>
        <GridRow>
          <Filter
            variant={isMobile ? 'dialog' : 'popover'}
            align="right"
            labelClear={activeLocale === 'en' ? 'Clear' : 'Hreinsa síu'}
            labelClearAll={
              activeLocale === 'en' ? 'Clear all' : 'Hreinsa allar síur'
            }
            labelOpen={activeLocale === 'en' ? 'Open filter' : 'Opna síu'}
            labelClose={activeLocale === 'en' ? 'Close filter' : 'Loka síu'}
            labelResult={
              activeLocale === 'en' ? 'View results' : 'Skoða niðurstöður'
            }
            labelTitle={
              activeLocale === 'en'
                ? 'Filter published material'
                : 'Sía útgefið efni'
            }
            filterInput={
              <FilterInput
                placeholder={
                  activeLocale === 'en' ? 'Search' : 'Sía eftir leitarorði'
                }
                name="filterInput"
                value={searchValue}
                onChange={setSearchValue}
              />
            }
            onFilterClear={() => {}}
          >
            <FilterMultiChoice
              labelClear={
                activeLocale === 'en' ? 'Clear selection' : 'Hreinsa val'
              }
              onChange={() => {}}
              onClear={() => {}}
              categories={[]}
            ></FilterMultiChoice>
          </Filter>
        </GridRow>

        <GridContainer>
          {filteredItems.map((item, index) => {
            return (
              <GridRow
                key={item.id}
                marginTop={index === 0 ? 6 : 2}
                marginBottom={2}
              >
                <TopicCard
                  href={item.href}
                  tag={item.href.split('.').pop().toLowerCase()}
                >
                  {item.name}
                </TopicCard>
              </GridRow>
            )
          })}
        </GridContainer>
      </GridContainer>
    </OrganizationWrapper>
  )
}

PublishedMaterial.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getOrganizationPage },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: query.slug as string,
          lang: locale as ContentLanguage,
        },
      },
    }),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  return {
    organizationPage: getOrganizationPage,
    ...getThemeConfig(getOrganizationPage.theme),
  }
}

export default withMainLayout(PublishedMaterial)
