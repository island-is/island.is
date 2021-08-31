import React from 'react'
import NextLink from 'next/link'
import cn from 'classnames'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Organization,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationArgs,
  QueryGetSupportQnAsInCategoryArgs,
} from '@island.is/web/graphql/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_QUERY,
  GET_SUPPORT_QNAS_IN_CATEGORY,
} from '../../queries'
import { Screen } from '../../../types'
import {
  Box,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
  TopicCard,
  ContentBlock,
  AccordionCard,
} from '@island.is/island-ui/core'
import { ServiceWebHeader } from '@island.is/web/components'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

import * as sharedStyles from '../shared/styles.treat'
import ContactBanner from '../ContactBanner/ContactBanner'
import groupBy from 'lodash/groupBy'
import { richText, SliceType } from '@island.is/island-ui/contentful'

interface SubPageProps {
  organization?: Organization
  namespace: Query['getNamespace']
  supportQNAs: Query['getSupportQNAsInCategory']
  questionSlug: string
}

const SubPage: Screen<SubPageProps> = ({
  organization,
  supportQNAs,
  questionSlug,
}) => {
  const { linkResolver } = useLinkResolver()
  const organizationTitle = organization ? organization.title : 'Ísland.is'
  const organizationSlug = organization.slug
  const question = supportQNAs.find(
    (supportQNA) => supportQNA.slug === questionSlug,
  )

  const logoTitle = `Þjónustuvefur ${organizationTitle}`

  // Already filtered by category, simply
  const categoryDescription = supportQNAs[0]?.category?.description ?? ''
  const categoryTitle = supportQNAs[0]?.category?.title
  const categorySlug = supportQNAs[0]?.category?.slug
  const supportQNAsBySubCategory = groupBy(
    supportQNAs,
    (supportQNA) => supportQNA.subCategory.title,
  )

  return (
    <>
      <ServiceWebHeader logoTitle={logoTitle} />
      <div className={cn(sharedStyles.bg, sharedStyles.bgSmall)} />
      <Box marginY={[3, 3, 10]}>
        <GridContainer>
          <GridRow>
            <GridColumn
              offset={[null, null, null, '1/12']}
              span={['12/12', '12/12', '12/12', '10/12']}
            >
              <GridContainer>
                <GridRow>
                  <GridColumn span="12/12" paddingBottom={[2, 2, 4]}>
                    <Box printHidden>
                      <Breadcrumbs
                        items={[
                          {
                            title: logoTitle,
                            typename: 'helpdesk',
                            href: `${
                              linkResolver('helpdesk').href
                            }/${organizationSlug}`,
                          },
                          {
                            title: `${categoryTitle}`,
                            typename: 'helpdesk',
                            href: `${
                              linkResolver('helpdesk').href
                            }/${organizationSlug}/${categorySlug}`,
                          },
                        ]}
                      />
                    </Box>
                  </GridColumn>
                </GridRow>
                <GridRow>
                  <GridColumn span={['12/12', '12/12', '10/12']}>
                    {!question?.title && (
                      <>
                        <Text variant="h1" as="h1">
                          {categoryTitle}
                        </Text>
                        <Text marginTop={2} variant="intro">
                          {categoryDescription}
                        </Text>
                      </>
                    )}

                    {question && (
                      <>
                        <Text variant="h2" as="h2">
                          {question.title}
                        </Text>

                        <Box>
                          {richText(question.answer as SliceType[], undefined)}
                        </Box>
                      </>
                    )}

                    <ContentBlock>
                      <Box paddingY={[1, 2]} marginTop={6}>
                        {Object.keys(supportQNAsBySubCategory).map(
                          (subcat, key) => {
                            const subCategoryDescription =
                              supportQNAsBySubCategory[subcat][0].subCategory
                                .description ?? ''
                            return (
                              <Box marginBottom={3} key={key}>
                                <AccordionCard
                                  id="id_1"
                                  label={subcat}
                                  visibleContent={
                                    <Text>{subCategoryDescription}</Text>
                                  }
                                >
                                  <Box marginTop={3}>
                                    <Stack space={2}>
                                      {supportQNAsBySubCategory[subcat].map(
                                        ({ title, slug }, index) => {
                                          return (
                                            <Box key={index}>
                                              <TopicCard
                                                href={`/thjonustuvefur/${organizationSlug}/${categorySlug}?&q=${slug}`}
                                              >
                                                {title}
                                              </TopicCard>
                                            </Box>
                                          )
                                        },
                                      )}
                                    </Stack>
                                  </Box>
                                </AccordionCard>
                              </Box>
                            )
                          },
                        )}
                      </Box>
                    </ContentBlock>
                  </GridColumn>
                </GridRow>
              </GridContainer>
              <Box marginTop={[10, 10, 20]}>
                <ContactBanner />
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </>
  )
}

const single = <T,>(x: T | T[]): T => (Array.isArray(x) ? x[0] : x)

SubPage.getInitialProps = async ({ apolloClient, locale, query }) => {
  const slugs = query.slugs as string
  const organizationSlug = slugs[0]
  const categorySlug = slugs[1]
  const questionSlug = single(query.q) ?? undefined

  const [organization, namespace, supportQNAs] = await Promise.all([
    !!organizationSlug &&
      apolloClient.query<Query, QueryGetOrganizationArgs>({
        query: GET_ORGANIZATION_QUERY,
        variables: {
          input: {
            slug: organizationSlug,
            lang: locale as ContentLanguage,
          },
        },
      }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Global',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables.data.getNamespace.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
    !!categorySlug &&
      apolloClient.query<Query, QueryGetSupportQnAsInCategoryArgs>({
        query: GET_SUPPORT_QNAS_IN_CATEGORY,
        variables: {
          input: {
            lang: locale as ContentLanguage,
            slug: categorySlug,
          },
        },
      }),
  ])

  return {
    namespace,
    organization: organization?.data?.getOrganization,
    supportQNAs: supportQNAs?.data?.getSupportQNAsInCategory,
    questionSlug,
  }
}

export default withMainLayout(SubPage, {
  showHeader: false,
})
