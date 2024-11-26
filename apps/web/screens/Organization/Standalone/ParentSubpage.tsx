import { useMemo } from 'react'
import { useRouter } from 'next/router'

import {
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  TableOfContents,
  Text,
} from '@island.is/island-ui/core'
import {
  ContentLanguage,
  OrganizationPage,
  OrganizationParentSubpage,
  OrganizationSubpage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryGetOrganizationParentSubpageArgs,
  QueryGetOrganizationSubpageArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { StandaloneLayout } from '@island.is/web/layouts/organization/standalone'
import type { Screen, ScreenContext } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_PARENT_SUBPAGE_QUERY,
  GET_ORGANIZATION_SUBPAGE_QUERY,
} from '../../queries'
import { SubPageContent } from '../SubPage'

type StandaloneParentSubpageScreenContext = ScreenContext & {
  organizationPage?: Query['getOrganizationPage']
}

export interface StandaloneParentSubpageProps {
  organizationPage: OrganizationPage
  subpage: OrganizationSubpage
  tableOfContentHeadings: {
    headingId: string
    headingTitle: string
    label: string
    href: string
  }[]
  selectedHeadingId: string
  parentSubpage: OrganizationParentSubpage
  namespace: Record<string, string>
}

const StandaloneParentSubpage: Screen<
  StandaloneParentSubpageProps,
  StandaloneParentSubpageScreenContext
> = ({
  organizationPage,
  parentSubpage,
  selectedHeadingId,
  subpage,
  tableOfContentHeadings,
  namespace,
}) => {
  const organizationNamespace = useMemo(() => {
    return JSON.parse(organizationPage.organization?.namespace?.fields || '{}')
  }, [organizationPage.organization?.namespace?.fields])

  const n = useNamespace(organizationNamespace)

  const router = useRouter()
  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()

  return (
    <StandaloneLayout
      organizationPage={organizationPage}
      bannerTitle={n('bannerTitle', '')}
    >
      <GridContainer>
        <GridRow>
          <GridColumn span={['9/9', '9/9', '7/9']} offset={['0', '0', '1/9']}>
            <Stack space={4}>
              <Breadcrumbs
                items={[
                  {
                    title: organizationPage.title,
                    href: linkResolver('organizationpage', [
                      organizationPage.slug,
                    ]).href,
                  },
                ]}
              />
              <Text variant="h1" as="h1">
                {parentSubpage.title}
              </Text>
              <TableOfContents
                headings={tableOfContentHeadings}
                onClick={(headingId) => {
                  const href = tableOfContentHeadings.find(
                    (heading) => heading.headingId === headingId,
                  )?.href
                  if (href) {
                    router.push(href)
                  }
                }}
                tableOfContentsTitle={
                  namespace?.['standaloneTableOfContentsTitle'] ??
                  activeLocale === 'is'
                    ? 'Efnisyfirlit'
                    : 'Table of contents'
                }
                selectedHeadingId={selectedHeadingId}
              />
            </Stack>
          </GridColumn>
        </GridRow>
        <SubPageContent
          namespace={namespace}
          organizationPage={organizationPage}
          subpage={subpage}
          subpageTitleVariant="h2"
        />
      </GridContainer>
    </StandaloneLayout>
  )
}

StandaloneParentSubpage.getProps = async ({
  apolloClient,
  locale,
  query,
  organizationPage,
}) => {
  const [organizationPageSlug, parentSubpageSlug, subpageSlug] = (query.slugs ??
    []) as string[]

  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganizationParentSubpage },
    },
    namespace,
  ] = await Promise.all([
    !organizationPage
      ? apolloClient.query<Query, QueryGetOrganizationPageArgs>({
          query: GET_ORGANIZATION_PAGE_QUERY,
          variables: {
            input: {
              slug: organizationPageSlug,
              lang: locale as ContentLanguage,
            },
          },
        })
      : {
          data: { getOrganizationPage: organizationPage },
        },
    apolloClient.query<Query, QueryGetOrganizationParentSubpageArgs>({
      query: GET_ORGANIZATION_PARENT_SUBPAGE_QUERY,
      variables: {
        input: {
          organizationPageSlug: organizationPageSlug as string,
          slug: parentSubpageSlug as string,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'OrganizationPages',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables.data.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  if (!getOrganizationParentSubpage) {
    throw new CustomNextError(404, 'Organization parent subpage was not found')
  }

  let selectedIndex = 0

  if (subpageSlug) {
    const index = getOrganizationParentSubpage.childLinks.findIndex(
      (link) => link.href.split('/').pop() === subpageSlug,
    )
    if (index > 0) {
      selectedIndex = index
    }
  }

  let subpage = (
    await apolloClient.query<Query, QueryGetOrganizationSubpageArgs>({
      query: GET_ORGANIZATION_SUBPAGE_QUERY,
      variables: {
        input: {
          organizationSlug: organizationPageSlug,
          slug: getOrganizationParentSubpage.childLinks[selectedIndex].href
            .split('/')
            .pop() as string,
          lang: locale as ContentLanguage,
        },
      },
    })
  ).data.getOrganizationSubpage

  // Try getting the first subpage in case others can't be found
  if (!subpage && selectedIndex > 0) {
    selectedIndex = 0
    subpage = (
      await apolloClient.query<Query, QueryGetOrganizationSubpageArgs>({
        query: GET_ORGANIZATION_SUBPAGE_QUERY,
        variables: {
          input: {
            organizationSlug: organizationPageSlug,
            slug: getOrganizationParentSubpage.childLinks[selectedIndex].href
              .split('/')
              .pop() as string,
            lang: locale as ContentLanguage,
          },
        },
      })
    ).data.getOrganizationSubpage
  }

  if (!subpage) {
    throw new CustomNextError(
      404,
      'Subpage belonging to an organization parent subpage was not found',
    )
  }

  const tableOfContentHeadings = getOrganizationParentSubpage.childLinks.map(
    (link) => ({
      headingId: link.href,
      headingTitle: link.label,
      label: link.label,
      href: link.href,
    }),
  )
  const selectedHeadingId = tableOfContentHeadings[selectedIndex].headingId

  return {
    organizationPage: getOrganizationPage,
    parentSubpage: getOrganizationParentSubpage,
    subpage,
    tableOfContentHeadings,
    selectedHeadingId,
    namespace,
  }
}

export default StandaloneParentSubpage
