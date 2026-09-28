import Head from 'next/head'
import { useRouter } from 'next/router'
import { IntlProvider, type IntlConfig } from 'react-intl'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { getThemeConfig, OrganizationWrapper } from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier,
  Query,
  QueryGetCustomPageArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen, ScreenContext } from '@island.is/web/types'

import { UmbodContent, type UmbodProps } from '../Umbod/Umbod'
import { GET_CUSTOM_PAGE_QUERY } from '../queries/CustomPage'
import { GET_PUBLIC_AUTH_TENANTS } from '../queries/Umbod'
import {
  getProps,
  StandaloneParentSubpageProps,
} from './Standalone/ParentSubpage'
import {
  getSubpageNavList,
  SubPageBottomSlices,
  SubPageContent,
} from './SubPage'
import * as styles from './ParentSubpage.css'

type OrganizationParentSubpageScreenContext = ScreenContext & {
  organizationPage?: Query['getOrganizationPage']
}

const isElectronicMandatesSubpage = (
  parentSubpageSlug: string | undefined,
  subpageSlug: string | undefined,
) =>
  (parentSubpageSlug === 'umbodskerfi' && subpageSlug === 'rafraen-umbod') ||
  (parentSubpageSlug === 'authorisation-system' &&
    subpageSlug === 'electronic-mandates')

export type OrganizationParentSubpageProps = StandaloneParentSubpageProps & {
  organizationPageSlug: string
  parentSubpageSlug: string
  subpageSlug?: string
  baseUrl: string
  tenants?: UmbodProps['tenants']
  mandatesMessages?: IntlConfig['messages']
}

const OrganizationParentSubpage: Screen<
  OrganizationParentSubpageProps,
  OrganizationParentSubpageScreenContext
> = ({
  organizationPage,
  parentSubpage,
  selectedHeadingId,
  subpage,
  tableOfContentHeadings,
  namespace,
  organizationPageSlug,
  parentSubpageSlug,
  subpageSlug,
  baseUrl,
  selectedIndex,
  tenants,
  mandatesMessages,
}) => {
  const router = useRouter()
  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  useLocalLinkTypeResolver('organizationparentsubpagechild')
  useContentfulId(organizationPage.id, parentSubpage.id, subpage.id)

  const showTableOfContents = parentSubpage.childLinks.length > 1
  const showUmbod =
    isElectronicMandatesSubpage(parentSubpageSlug, subpageSlug) &&
    Boolean(tenants)

  const pageTitle = `${parentSubpage?.title ?? ''}${
    Boolean(parentSubpage?.title) && Boolean(subpage?.title) ? ' - ' : ''
  }${subpage?.title ?? ''}`

  return (
    <OrganizationWrapper
      showExternalLinks={true}
      showReadSpeaker={false}
      pageTitle={pageTitle}
      organizationPage={organizationPage}
      organizationSubpageId={subpage.id}
      fullWidthContent={true}
      pageFeaturedImage={
        subpage?.featuredImage ?? organizationPage?.featuredImage
      }
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: organizationPage?.title ?? '',
          href: linkResolver('organizationpage', [organizationPage?.slug]).href,
        },
      ]}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: getSubpageNavList(
          organizationPage,
          router,
          activeLocale === 'is' ? 3 : 4,
        ),
      }}
      mainContent={
        <Box paddingTop={4}>
          {selectedIndex === 0 && (
            <Head>
              <link
                rel="canonical"
                href={`${baseUrl}${
                  linkResolver('organizationsubpage', [
                    organizationPageSlug,
                    parentSubpageSlug,
                  ]).href
                }`}
              />
            </Head>
          )}
          <GridContainer>
            <GridRow>
              <GridColumn
                span={['9/9', '9/9', '7/9']}
                offset={['0', '0', '1/9']}
              >
                <Stack space={3}>
                  <Stack space={4}>
                    <Text variant="h1" as="h1">
                      {parentSubpage.title}
                    </Text>
                    {showTableOfContents && (
                      <Box
                        paddingX={4}
                        paddingY={2}
                        borderLeftWidth="standard"
                        borderColor="blue200"
                      >
                        <Stack space={1}>
                          <Text variant="h5" as="h2">
                            {namespace?.['OrganizationTableOfContentsTitle'] ??
                            activeLocale === 'is'
                              ? 'Efnisyfirlit'
                              : 'Table of contents'}
                          </Text>
                          <Stack space={1}>
                            {tableOfContentHeadings.map(
                              ({ headingTitle, headingId, href }) => (
                                <Box
                                  key={headingId}
                                  className={styles.fitContentWidth}
                                >
                                  <LinkV2 href={href}>
                                    <Text
                                      fontWeight={
                                        headingId === selectedHeadingId
                                          ? 'semiBold'
                                          : 'regular'
                                      }
                                      variant="small"
                                      color={
                                        selectedHeadingId &&
                                        headingId === selectedHeadingId
                                          ? 'blue400'
                                          : 'blue600'
                                      }
                                    >
                                      {headingTitle}
                                    </Text>
                                  </LinkV2>
                                </Box>
                              ),
                            )}
                          </Stack>
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </Stack>
              </GridColumn>
            </GridRow>
          </GridContainer>
          {showUmbod ? (
            <IntlProvider locale={activeLocale} messages={mandatesMessages}>
              <UmbodContent tenants={tenants ?? []} embedded />
            </IntlProvider>
          ) : (
            <SubPageContent
              namespace={namespace}
              organizationPage={organizationPage}
              subpage={subpage}
              subpageTitleVariant="h2"
            />
          )}
        </Box>
      }
    >
      <SubPageBottomSlices
        namespace={namespace}
        organizationPage={organizationPage}
        subpage={subpage}
      />
    </OrganizationWrapper>
  )
}

OrganizationParentSubpage.getProps = async (context) => {
  const props = await getProps(context)
  const querySlugs = (context.query.slugs ?? []) as string[]
  const [organizationPageSlug, parentSubpageSlug, subpageSlug] = querySlugs
  const host = context.req.headers.host ?? ''
  const protocol = `http${host.startsWith('localhost') ? '' : 's'}://`
  const baseUrl = `${protocol}${host}`

  const tenants = isElectronicMandatesSubpage(parentSubpageSlug, subpageSlug)
    ? await context.apolloClient
        .query<{ publicAuthTenants: UmbodProps['tenants'] }>({
          query: GET_PUBLIC_AUTH_TENANTS,
        })
        .then((response) => response.data.publicAuthTenants)
    : undefined

  const mandatesMessages = isElectronicMandatesSubpage(
    parentSubpageSlug,
    subpageSlug,
  )
    ? await context.apolloClient
        .query<Query, QueryGetCustomPageArgs>({
          query: GET_CUSTOM_PAGE_QUERY,
          variables: {
            input: {
              lang: context.locale,
              uniqueIdentifier: CustomPageUniqueIdentifier.ElectronicMandates,
            },
          },
        })
        .then((response) => response.data.getCustomPage?.translationStrings)
    : undefined

  return {
    ...props,
    baseUrl,
    organizationPageSlug,
    parentSubpageSlug,
    subpageSlug,
    tenants,
    mandatesMessages,
    ...getThemeConfig(
      props.organizationPage.theme,
      props.organizationPage.organization,
    ),
  }
}

export default withMainLayout(OrganizationParentSubpage)
