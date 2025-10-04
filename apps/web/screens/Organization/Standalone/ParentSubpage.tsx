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
  QueryGetOrganizationSubpageByIdArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { useI18n } from '@island.is/web/i18n'
import { StandaloneLayout } from '@island.is/web/layouts/organization/standalone'
import type { Screen, ScreenContext } from '@island.is/web/types'
import {
  CustomNextError,
  CustomNextRedirect,
} from '@island.is/web/units/errors'

import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_PARENT_SUBPAGE_QUERY,
  GET_ORGANIZATION_SUBPAGE_BY_ID_QUERY,
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

const LanguageToggleSetup = (props: { ids: string[] }) => {
  useContentfulId(...props.ids)
  return null
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
  const router = useRouter()
  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()

  return (
    <StandaloneLayout
      organizationPage={organizationPage}
      seo={{
        title: `${subpage.title} | ${organizationPage.title}`,
      }}
    >
      <LanguageToggleSetup
        ids={[organizationPage.id, parentSubpage.id, subpage.id]}
      />
      <GridContainer>
        <GridRow>
          <GridColumn span={['9/9', '9/9', '7/9']} offset={['0', '0', '1/9']}>
            <Stack space={3}>
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
              {parentSubpage.childLinks.length > 1 && (
                <Stack space={4}>
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
              )}
            </Stack>
          </GridColumn>
        </GridRow>
        <SubPageContent
          namespace={namespace}
          organizationPage={organizationPage}
          subpage={subpage}
          subpageTitleVariant={
            parentSubpage.childLinks.length > 1 ? 'h2' : 'h1'
          }
        />
      </GridContainer>
    </StandaloneLayout>
  )
}

export const getProps: typeof StandaloneParentSubpage['getProps'] = async ({
  apolloClient,
  locale,
  query,
  organizationPage,
}) => {
  const querySlugs = (query.slugs ?? []) as string[]
  const [organizationPageSlug, parentSubpageSlug, subpageSlug] = querySlugs

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
              subpageSlugs: querySlugs.slice(1),
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
    if (index >= 0) {
      selectedIndex = index
    } else {
      throw new CustomNextError(
        404,
        'Subpage belonging to an organization parent subpage was not found',
      )
    }
  }

  const subpageLink = getOrganizationParentSubpage.childLinks[selectedIndex]

  if (!subpageLink) {
    throw new CustomNextError(
      404,
      'Subpage belonging to an organization parent subpage was not found',
    )
  }

  const subpage = !subpageLink.id
    ? (
        await apolloClient.query<Query, QueryGetOrganizationSubpageArgs>({
          query: GET_ORGANIZATION_SUBPAGE_QUERY,
          variables: {
            input: {
              organizationSlug: organizationPageSlug,
              slug: subpageLink.href.split('/').pop() as string,
              lang: locale as ContentLanguage,
            },
          },
        })
      ).data.getOrganizationSubpage
    : (
        await apolloClient.query<Query, QueryGetOrganizationSubpageByIdArgs>({
          query: GET_ORGANIZATION_SUBPAGE_BY_ID_QUERY,
          variables: {
            input: {
              id: subpageLink.id,
              lang: locale as ContentLanguage,
            },
          },
        })
      ).data.getOrganizationSubpageById

  if (!subpage) {
    throw new CustomNextError(
      404,
      'Subpage belonging to an organization parent subpage was not found',
    )
  }

  if (!subpageSlug) {
    throw new CustomNextRedirect(encodeURI(subpageLink.href))
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

StandaloneParentSubpage.getProps = getProps

export default StandaloneParentSubpage
