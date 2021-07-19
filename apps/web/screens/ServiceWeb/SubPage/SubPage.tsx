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
  SupportQna,
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
  Button,
  Link,
} from '@island.is/island-ui/core'

import { skirteini } from '../mock'
import { ServiceWebHeader } from '@island.is/web/components'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { asSlug } from '../utils'

import * as styles from './SubPage.treat'
import * as sharedStyles from '../shared/styles.treat'
import _ from 'lodash'

interface SubPageProps {
  organization?: Organization
  namespace: Query['getNamespace']
  organizationSlug: string
  categorySlug: string
  supportQNAs: Query['getSupportQNAsInCategory']
}

interface CategoryContainer {
  title: string
  questions: {
    title: string
    slug: string
  }
}

const SubPage: Screen<SubPageProps> = ({
  organizationSlug,
  categorySlug,
  organization,
  supportQNAs,
}) => {
  const { linkResolver } = useLinkResolver()
  const organizationTitle = organization ? organization.title : 'Ísland.is'

  const logoTitle = `Þjónustuvefur ${organizationTitle}`
  const supportQNAsBySubCategory = _.groupBy(
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
                            href: '/',
                          },
                          {
                            title: 'Skírteini',
                            typename: 'helpdesk',
                            href: '/',
                          },
                        ]}
                        renderLink={(link, { typename, slug }) => {
                          return (
                            <NextLink
                              {...linkResolver(typename as LinkType, slug)}
                              passHref
                            >
                              {link}
                            </NextLink>
                          )
                        }}
                      />
                    </Box>
                  </GridColumn>
                </GridRow>
                <GridRow>
                  <GridColumn span="12/12">
                    <Text variant="h1" as="h1">
                      {organizationTitle}
                    </Text>
                    <Text marginTop={2} variant="intro">
                      Vegabréf, ökuskírteini, bílpróf, ökuréttindi o.fl.
                    </Text>
                    <ContentBlock>
                      <Box paddingY={[1, 2]} marginTop={6}>
                        {Object.keys(supportQNAsBySubCategory).map((subcat) => {
                          const subCategoryDescription =
                            supportQNAsBySubCategory[subcat][0].subCategory
                              .description ?? ''
                          return (
                            <Box marginBottom={3}>
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
                                      ({ question, slug }, index) => {
                                        return (
                                          <Box>
                                            <TopicCard
                                              href={`/thjonustuvefur/${organizationSlug}/${categorySlug}/${slug}`}
                                              key={index}
                                            >
                                              {question}
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
                        })}
                      </Box>
                    </ContentBlock>
                  </GridColumn>
                </GridRow>
                <GridRow marginTop={30}>
                  <GridColumn span="12/12">
                    <Link
                      href={'https://island.is/stafraent-island/hafa-samband'}
                    >
                      <Box
                        background="purple100"
                        padding={10}
                        borderRadius="large"
                      >
                        <Text variant="h3" as="h3">
                          Finnurðu ekki það sem þig vantar?
                        </Text>
                        <Text marginTop={2} marginBottom={12} variant="intro">
                          Hvernig getum við aðstoðað?
                        </Text>
                        <Button
                          type="button"
                          variant="ghost"
                          icon="arrowForward"
                        >
                          Hafa samband
                        </Button>
                      </Box>
                    </Link>
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </>
  )
}

SubPage.getInitialProps = async ({ apolloClient, locale, query }) => {
  const slugs = query.slugs as string

  const organizationSlug = slugs[0] || ''
  const categorySlug = slugs[1]

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
    organizationSlug,
    categorySlug,
    supportQNAs: supportQNAs?.data?.getSupportQNAsInCategory,
  }
}

export default withMainLayout(SubPage, {
  showHeader: false,
})
